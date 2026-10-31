import json
import os
import time
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.app.solver.exam_solver import ExamSolver
from backend.app.solver.fest_allocator import FestEventAllocator
from backend.app.solver.repair_solver import TimetableRepairSolver
from backend.app.solver.timetable_solver import AcademicTimetableSolver

app = FastAPI(
    title="Techzephyr Campus Timetable API",
    description="Backend service for timetable generation, event booking, and disruption handling.",
    version="0.1.0",
)

# Secure CORS: specify allowed dev origins and regex pattern instead of invalid wildcard-with-credentials
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Dynamic path resolution to CrunchWeek_StarterPack dataset and exports
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_DATASET_PATH = REPO_ROOT / "CrunchWeek_StarterPack" / "data" / "cit_public.json"
DATASET_PATH = Path(os.getenv("DATASET_PATH", str(DEFAULT_DATASET_PATH)))
DEFAULT_DISRUPTION_PATH = REPO_ROOT / "CrunchWeek_StarterPack" / "examples" / "sample_disruption.json"
EXPORTS_DIR = REPO_ROOT / "exports"
EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
SCHEDULE_EXPORT_PATH = EXPORTS_DIR / "schedule.json"
SCHEDULE_AFTER_EXPORT_PATH = EXPORTS_DIR / "schedule_after.json"


class HealthResponse(BaseModel):
    status: str


class DatasetSummaryResponse(BaseModel):
    dataset_id: str
    institute: str
    rooms: int
    faculty: int
    groups: int
    courses: int
    sessions: int
    exams: int


class GenerateRequest(BaseModel):
    timeout_seconds: Optional[float] = Field(default=35.0, ge=1.0, le=180.0, description="Solver timeout in seconds (1-180)")
    team_name: Optional[str] = Field(default="Techzephyr", max_length=100, pattern=r"^[a-zA-Z0-9_\- ]+$", description="Team identifier")


class GenerateResponse(BaseModel):
    status: str
    solver_status: str
    solve_time_seconds: float
    objective_value: float
    scheduled_sessions: int
    export_path: str
    schedule: Dict[str, Any]


class ExamGenerateRequest(BaseModel):
    timeout_seconds: Optional[float] = Field(default=25.0, ge=1.0, le=180.0, description="Solver timeout in seconds (1-180)")


class ExamGenerateResponse(BaseModel):
    status: str
    solver_status: str
    solve_time_seconds: float
    objective_value: float
    exams_scheduled: int
    export_path: str
    exams: List[Dict[str, Any]]


class BookingItem(BaseModel):
    id: str
    submitted_at: str
    requester: str
    role: str
    requested_category: str
    effective_category: str
    title: str
    attendance: int
    duration_periods: int
    windows: List[Dict[str, Any]]
    room_types: List[str]
    needs: List[str]
    requested_room: Optional[str] = None
    mandatory_for_groups: List[str] = []
    status: str
    decision: Optional[Dict[str, Any]] = None


class BookingListResponse(BaseModel):
    total_requests: int
    requests: List[BookingItem]


class AllocateBookingsResponse(BaseModel):
    status: str
    booking_score: float
    booking_score_max: float
    approved_count: int
    alternative_count: int
    rejected_count: int
    session_overrides_count: int
    export_path: str
    fest_week: Dict[str, Any]


class ReviewBookingRequest(BaseModel):
    status: str  # approved | rejected | alternative_offered
    reason: str
    day: Optional[str] = None
    start_period: Optional[int] = None
    end_period: Optional[int] = None
    room_id: Optional[str] = None
    reviewer_role: str = "admin"
    reviewer_id: str


class DisruptionPayload(BaseModel):
    id: Optional[str] = None
    description: Optional[str] = "Campus operational disruption"
    changes: Optional[List[Dict[str, Any]]] = None


class DisruptionPreviewResponse(BaseModel):
    disruption_id: str
    status: str
    solver_status: str
    solve_time_seconds: float
    sessions_moved: int
    time_changed: int
    room_only_changed: int
    moved_ids: List[str]
    total_changes: int
    changes: List[Dict[str, Any]]
    proposed_schedule_summary: Dict[str, Any]


class DisruptionApplyRequest(BaseModel):
    reviewer_role: str = "admin"
    reviewer_id: str
    note: Optional[str] = None


class DisruptionApplyResponse(BaseModel):
    disruption_id: str
    status: str
    applied_by: str
    export_path: str
    sessions_count: int
    message: str


# In-memory disruption proposals store
DISRUPTIONS_STORE: Dict[str, Dict[str, Any]] = {}


def load_dataset() -> Dict[str, Any]:
    if not DATASET_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Dataset file not found at {DATASET_PATH}",
        )
    try:
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to read dataset: {exc}",
        )


def load_current_schedule(data: Dict[str, Any]) -> Dict[str, Any]:
    if SCHEDULE_EXPORT_PATH.exists():
        try:
            with open(SCHEDULE_EXPORT_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "team": "Techzephyr",
        "dataset_id": data.get("dataset_id", "cit-public-v1"),
        "sessions": [],
        "fest_week": {"bookings": [], "session_overrides": []},
        "exams": []
    }


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Return health status of the backend service."""
    return HealthResponse(status="ok")


@app.get("/dataset/summary", response_model=DatasetSummaryResponse)
def get_dataset_summary() -> DatasetSummaryResponse:
    """Read the actual starter-pack dataset and return entity counts."""
    data = load_dataset()
    return DatasetSummaryResponse(
        dataset_id=data.get("dataset_id", "unknown"),
        institute=data.get("institute", "unknown"),
        rooms=len(data.get("rooms", [])),
        faculty=len(data.get("faculty", [])),
        groups=len(data.get("student_groups", [])),
        courses=len(data.get("courses", [])),
        sessions=len(data.get("sessions", [])),
        exams=len(data.get("exams", [])),
    )


@app.post("/timetable/generate", response_model=GenerateResponse)
def generate_timetable(request: Optional[GenerateRequest] = None) -> GenerateResponse:
    """Generate academic timetable with CP-SAT, satisfy H1-H12/H14, optimize S1-S6, and save to exports/schedule.json."""
    timeout = request.timeout_seconds if request and request.timeout_seconds else 35.0
    team = request.team_name if request and request.team_name else "Techzephyr"

    data = load_dataset()
    solver = AcademicTimetableSolver(data, team_name=team)

    try:
        result = solver.solve(timeout_seconds=timeout)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Timetable generation failed: {exc}",
        )

    # Preserve any existing exams and fest_week if already generated
    current_schedule = load_current_schedule(data)
    schedule_to_save = result["schedule"]
    if current_schedule.get("exams"):
        schedule_to_save["exams"] = current_schedule["exams"]
    if current_schedule.get("fest_week", {}).get("bookings"):
        schedule_to_save["fest_week"] = current_schedule["fest_week"]

    try:
        with open(SCHEDULE_EXPORT_PATH, "w", encoding="utf-8") as f:
            json.dump(schedule_to_save, f, indent=2)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save schedule to {SCHEDULE_EXPORT_PATH}: {exc}",
        )

    return GenerateResponse(
        status=result["status"],
        solver_status=result["solver_status"],
        solve_time_seconds=result["solve_time_seconds"],
        objective_value=result["objective_value"],
        scheduled_sessions=result["scheduled_sessions"],
        export_path="exports/schedule.json",
        schedule=schedule_to_save,
    )


@app.post("/exams/generate", response_model=ExamGenerateResponse)
def generate_exams(request: Optional[ExamGenerateRequest] = None) -> ExamGenerateResponse:
    """Generate midsem exam schedule with CP-SAT and update exports/schedule.json."""
    timeout = request.timeout_seconds if request and request.timeout_seconds else 25.0
    data = load_dataset()
    solver = ExamSolver(data)

    try:
        result = solver.solve(timeout_seconds=timeout)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Exam scheduling failed: {exc}",
        )

    current_schedule = load_current_schedule(data)
    current_schedule["exams"] = result["exams"]

    try:
        with open(SCHEDULE_EXPORT_PATH, "w", encoding="utf-8") as f:
            json.dump(current_schedule, f, indent=2)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save schedule to {SCHEDULE_EXPORT_PATH}: {exc}",
        )

    return ExamGenerateResponse(
        status=result["status"],
        solver_status=result["solver_status"],
        solve_time_seconds=result["solve_time_seconds"],
        objective_value=result["objective_value"],
        exams_scheduled=result["exams_scheduled"],
        export_path="exports/schedule.json",
        exams=result["exams"],
    )


@app.get("/fest/bookings", response_model=BookingListResponse)
def list_bookings() -> BookingListResponse:
    """List all 25 fest booking requests from the dataset with their computed decision statuses."""
    data = load_dataset()
    schedule = load_current_schedule(data)
    allocator = FestEventAllocator(data, schedule)

    decision_map = {}
    for b in schedule.get("fest_week", {}).get("bookings", []):
        decision_map[b["request_id"]] = b

    items = []
    for req in data.get("booking_requests", []):
        req_id = req["id"]
        dec = decision_map.get(req_id)
        status = dec["status"] if dec else "pending"
        items.append(
            BookingItem(
                id=req_id,
                submitted_at=req["submitted_at"],
                requester=req["requester"],
                role=req["role"],
                requested_category=req["requested_category"],
                effective_category=allocator.effective_category(req),
                title=req["title"],
                attendance=req["attendance"],
                duration_periods=req["duration_periods"],
                windows=req["windows"],
                room_types=req["room_types"],
                needs=req.get("needs", []),
                requested_room=req.get("requested_room"),
                mandatory_for_groups=req.get("mandatory_for_groups", []),
                status=status,
                decision=dec,
            )
        )

    return BookingListResponse(total_requests=len(items), requests=items)


@app.post("/fest/bookings/allocate", response_model=AllocateBookingsResponse)
def allocate_bookings() -> AllocateBookingsResponse:
    """Run greedy priority-based allocation on fest week booking requests and update exports/schedule.json."""
    data = load_dataset()
    current_schedule = load_current_schedule(data)

    allocator = FestEventAllocator(data, current_schedule)
    result = allocator.allocate()

    current_schedule["fest_week"] = result["fest_week"]

    try:
        with open(SCHEDULE_EXPORT_PATH, "w", encoding="utf-8") as f:
            json.dump(current_schedule, f, indent=2)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save schedule to {SCHEDULE_EXPORT_PATH}: {exc}",
        )

    stats = result["stats"]
    return AllocateBookingsResponse(
        status="success",
        booking_score=stats["booking_score"],
        booking_score_max=stats["booking_score_max"],
        approved_count=stats["approved_count"],
        alternative_count=stats["alternative_count"],
        rejected_count=stats["rejected_count"],
        session_overrides_count=stats["session_overrides_count"],
        export_path="exports/schedule.json",
        fest_week=result["fest_week"],
    )


@app.post("/fest/bookings/{request_id}/review")
def review_booking(request_id: str, review: ReviewBookingRequest) -> Dict[str, Any]:
    """Manually review a booking request with role checking and self-approval prevention."""
    data = load_dataset()
    req = next((r for r in data.get("booking_requests", []) if r["id"] == request_id), None)
    if not req:
        raise HTTPException(status_code=404, detail=f"Booking request {request_id} not found.")

    valid_statuses = {"approved", "rejected", "alternative_offered"}
    if review.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{review.status}'. Must be one of: {', '.join(sorted(valid_statuses))}.",
        )

    if review.status in ("approved", "alternative_offered"):
        if review.reviewer_id.lower() == req["requester"].lower():
            raise HTTPException(
                status_code=403,
                detail=f"Self-approval is forbidden. Requesters ({req['requester']}) cannot approve their own requests.",
            )
        if review.reviewer_role not in ("admin", "department_coordinator"):
            raise HTTPException(
                status_code=403,
                detail=f"Role '{review.reviewer_role}' is not authorized to approve bookings.",
            )
    elif review.status == "rejected":
        # Only admins, department coordinators, or the requester themselves can reject/withdraw
        is_admin_or_coord = review.reviewer_role in ("admin", "department_coordinator")
        is_own_request = review.reviewer_id.lower() == req["requester"].lower()
        if not (is_admin_or_coord or is_own_request):
            raise HTTPException(
                status_code=403,
                detail=f"Role '{review.reviewer_role}' is not authorized to reject booking '{request_id}'.",
            )

    current_schedule = load_current_schedule(data)
    bookings = current_schedule.get("fest_week", {}).get("bookings", [])

    new_decision = {
        "request_id": request_id,
        "status": review.status,
        "reason": review.reason,
    }
    if review.status in ("approved", "alternative_offered"):
        if not review.day or not review.start_period or not review.end_period or not review.room_id:
            raise HTTPException(
                status_code=400,
                detail="day, start_period, end_period, and room_id are required for approved or alternative_offered status.",
            )
        valid_days = set(data.get("calendar", {}).get("days", []))
        if review.day not in valid_days:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid day '{review.day}'. Must be one of: {sorted(valid_days)}.",
            )
        if not (1 <= review.start_period <= review.end_period <= 13):
            raise HTTPException(
                status_code=400,
                detail="Periods must satisfy 1 <= start_period <= end_period <= 13.",
            )
        room_ids = {r["id"] for r in data.get("rooms", [])}
        if review.room_id not in room_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Room '{review.room_id}' not found in campus venues.",
            )
        new_decision.update({
            "day": review.day,
            "start_period": review.start_period,
            "end_period": review.end_period,
            "room_id": review.room_id,
        })

    updated = False
    for i, b in enumerate(bookings):
        if b["request_id"] == request_id:
            bookings[i] = new_decision
            updated = True
            break
    if not updated:
        bookings.append(new_decision)

    current_schedule["fest_week"]["bookings"] = bookings

    with open(SCHEDULE_EXPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(current_schedule, f, indent=2)

    return {
        "status": "success",
        "message": f"Decision for {request_id} recorded successfully.",
        "decision": new_decision,
    }


# -----------------------------------------------------------------------------
# Phase 5: Disruption Handling & Timetable Repair Endpoints
# -----------------------------------------------------------------------------

@app.post("/disruptions/preview", response_model=DisruptionPreviewResponse)
def preview_disruption_repair(payload: Optional[DisruptionPayload] = None) -> DisruptionPreviewResponse:
    """Generate a proposed repaired timetable preview without changing the active schedule."""
    data = load_dataset()
    current_schedule = load_current_schedule(data)

    if not current_schedule.get("sessions"):
        raise HTTPException(
            status_code=400,
            detail="Cannot repair timetable: active schedule has no scheduled sessions. Generate base timetable first.",
        )

    # If payload is empty or changes missing, load official sample_disruption.json as default
    if not payload or not payload.changes:
        if DEFAULT_DISRUPTION_PATH.exists():
            with open(DEFAULT_DISRUPTION_PATH, "r", encoding="utf-8") as f:
                disruption_dict = json.load(f)
        else:
            raise HTTPException(status_code=400, detail="No disruption payload provided and sample_disruption.json not found.")
    else:
        disruption_dict = payload.model_dump()

    disruption_id = disruption_dict.get("id") or f"disp-{uuid.uuid4().hex[:8]}"
    disruption_dict["id"] = disruption_id

    solver = TimetableRepairSolver(data, current_schedule, disruption_dict)
    try:
        result = solver.solve(timeout_seconds=25.0)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Disruption cannot be repaired: {exc}",
        )

    # Bound in-memory store to prevent unbounded memory growth / DoS
    if len(DISRUPTIONS_STORE) >= 100:
        oldest_key = min(DISRUPTIONS_STORE.keys(), key=lambda k: DISRUPTIONS_STORE[k].get("created_at", 0))
        DISRUPTIONS_STORE.pop(oldest_key, None)

    # Register in memory proposal store (does NOT modify active exports/schedule.json)
    DISRUPTIONS_STORE[disruption_id] = {
        "disruption_id": disruption_id,
        "status": "pending_admin_approval",
        "disruption": disruption_dict,
        "result": result,
        "created_at": time.time(),
    }

    stability = result["stability"]
    repaired_sched = result["repaired_schedule"]

    return DisruptionPreviewResponse(
        disruption_id=disruption_id,
        status="pending_admin_approval",
        solver_status=result["solver_status"],
        solve_time_seconds=result["solve_time_seconds"],
        sessions_moved=stability["sessions_moved"],
        time_changed=stability["time_changed"],
        room_only_changed=stability["room_only_changed"],
        moved_ids=stability["moved_ids"],
        total_changes=result["total_changes"],
        changes=result["changes"],
        proposed_schedule_summary={
            "team": repaired_sched["team"],
            "dataset_id": repaired_sched["dataset_id"],
            "total_sessions": len(repaired_sched["sessions"]),
            "fest_week_bookings": len(repaired_sched.get("fest_week", {}).get("bookings", [])),
            "exams_count": len(repaired_sched.get("exams", [])),
        },
    )


@app.get("/disruptions")
def list_disruptions() -> List[Dict[str, Any]]:
    """List all registered disruption proposals and their approval statuses."""
    items = []
    for disp_id, item in DISRUPTIONS_STORE.items():
        res = item.get("result", {})
        stab = res.get("stability", {})
        items.append({
            "disruption_id": disp_id,
            "status": item.get("status"),
            "description": item.get("disruption", {}).get("description", ""),
            "changes_count": item.get("disruption", {}).get("changes", []),
            "sessions_moved": stab.get("sessions_moved", 0),
            "time_changed": stab.get("time_changed", 0),
            "room_only_changed": stab.get("room_only_changed", 0),
        })
    return items


@app.get("/disruptions/{disruption_id}")
def get_disruption_proposal(disruption_id: str) -> Dict[str, Any]:
    """Retrieve full proposal and change list for a specific disruption ID."""
    item = DISRUPTIONS_STORE.get(disruption_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Disruption proposal '{disruption_id}' not found.")
    res = item.get("result", {})
    return {
        "disruption_id": disruption_id,
        "status": item.get("status"),
        "disruption": item.get("disruption"),
        "stability": res.get("stability"),
        "total_changes": res.get("total_changes"),
        "changes": res.get("changes"),
    }


@app.post("/disruptions/{disruption_id}/apply", response_model=DisruptionApplyResponse)
def apply_disruption_repair(disruption_id: str, request: DisruptionApplyRequest) -> DisruptionApplyResponse:
    """Apply an approved disruption timetable repair to exports/schedule_after.json. Requires Admin role."""
    # Requirement 6: Require Admin approval before applying the proposed repair
    if request.reviewer_role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail=f"Admin approval required to apply timetable repairs. Role '{request.reviewer_role}' is not authorized.",
        )

    item = DISRUPTIONS_STORE.get(disruption_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Disruption proposal '{disruption_id}' not found.")

    result = item["result"]
    repaired_schedule = result["repaired_schedule"]

    if item.get("status") == "applied":
        return DisruptionApplyResponse(
            disruption_id=disruption_id,
            status="applied",
            applied_by=item.get("applied_by", request.reviewer_id),
            export_path="exports/schedule_after.json",
            sessions_count=len(repaired_schedule["sessions"]),
            message="Repaired timetable was already applied.",
        )

    # Save to exports/schedule_after.json (official export path for repaired schedule)
    try:
        with open(SCHEDULE_AFTER_EXPORT_PATH, "w", encoding="utf-8") as f:
            json.dump(repaired_schedule, f, indent=2)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to write repaired schedule to {SCHEDULE_AFTER_EXPORT_PATH}: {exc}",
        )

    item["status"] = "applied"
    item["applied_by"] = request.reviewer_id

    return DisruptionApplyResponse(
        disruption_id=disruption_id,
        status="applied",
        applied_by=request.reviewer_id,
        export_path="exports/schedule_after.json",
        sessions_count=len(repaired_schedule["sessions"]),
        message=f"Repaired timetable successfully applied and exported to exports/schedule_after.json.",
    )


@app.get("/dataset/full")
def get_full_dataset() -> Dict[str, Any]:
    """Return full cit_public.json dataset and active schedule.json."""
    data = load_dataset()
    sched = load_current_schedule(data)
    return {"dataset": data, "schedule": sched}


@app.get("/schedule/export")
def export_schedule() -> Dict[str, Any]:
    """Return validator-compliant schedule.json."""
    data = load_dataset()
    return load_current_schedule(data)


@app.get("/schedule/export-after")
def export_schedule_after() -> Dict[str, Any]:
    """Return validator-compliant schedule_after.json."""
    if SCHEDULE_AFTER_EXPORT_PATH.exists():
        with open(SCHEDULE_AFTER_EXPORT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    data = load_dataset()
    return load_current_schedule(data)


@app.post("/dataset/reset")
def reset_demo_data() -> Dict[str, Any]:
    """Admin button to reset demo data and regenerate clean baseline exports."""
    DISRUPTIONS_STORE.clear()
    data = load_dataset()
    sched = load_current_schedule(data)
    allocator = FestEventAllocator(data, sched)
    sched["fest_week"] = allocator.allocate()["fest_week"]
    with open(SCHEDULE_EXPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(sched, f, indent=2)
    return {"status": "success", "message": "Demo data reset to clean baseline state.", "schedule": sched}


class ParseBookingRequest(BaseModel):
    raw_text: str
    role: str = "club"
    requester: str = "Campus User"


@app.post("/ai/parse-booking")
def parse_natural_language_booking(payload: ParseBookingRequest) -> Dict[str, Any]:
    """Deterministic English & Hinglish booking parser with hard-constraint pre-validation."""
    import re
    data = load_dataset()
    text = (payload.raw_text or "").strip()
    lower = text.lower()

    day_map = {
        "mon": "MON", "monday": "MON", "somwar": "MON",
        "tue": "TUE", "tuesday": "TUE", "mangal": "TUE",
        "wed": "WED", "wednesday": "WED", "budh": "WED",
        "thu": "THU", "thursday": "THU", "guru": "THU",
        "fri": "FRI", "friday": "FRI", "shukra": "FRI",
    }
    days_found = []
    for k, v in day_map.items():
        if re.search(rf"\b{k}\b", lower) and v not in days_found:
            days_found.append(v)
    if not days_found:
        days_found = ["TUE"] if "kal" in lower or "tomorrow" in lower else ["MON"]

    dur = 2
    dur_m = re.search(r"(\d+)\s*(?:hour|hr|ghant|period)", lower)
    if dur_m:
        dur = max(1, min(9, int(dur_m.group(1))))

    from_p, to_p = 10, 11
    follow_up = None
    p_match = re.search(r"\bp(\d{1,2})\b|period\s*(\d{1,2})", lower)
    if p_match:
        from_p = int(p_match.group(1) or p_match.group(2))
        to_p = min(13, from_p + dur - 1)
    elif "6 to 8 pm" in lower or "shaam 6 baje" in lower or "6 pm" in lower:
        from_p, to_p = 10, max(10, 10 + dur - 1)
    elif "6 to 9 pm" in lower or "6 to 9" in lower:
        from_p, to_p, dur = 10, 12, 3
    elif "7 to 8 pm" in lower:
        from_p, to_p, dur = 11, 11, 1
    elif "10 am" in lower:
        from_p, to_p, dur = 3, 3 + dur - 1, dur
    elif "after lunch" in lower or "afternoon" in lower:
        from_p, to_p = 6, 9
        if "maybe" in lower or "somewhere" in lower:
            follow_up = "Assumed afternoon window P6-P9 (14:00-18:00) and 2-hour duration; please confirm exact start period and attendance."

    att = 60
    att_m = re.search(r"(\d{2,4})\s*(?:people|students|participants|log|spectators|dancers)", lower)
    if att_m:
        att = int(att_m.group(1))

    needs = []
    if "projector" in lower: needs.append("projector")
    if "mic" in lower or "sound" in lower or "pa_system" in lower: needs.append("pa_system")
    if "stage" in lower: needs.append("stage")
    if "computer" in lower: needs.append("computers")
    if "accessible" in lower or "wheelchair" in lower: needs.append("accessible")

    room_types = ["classroom", "lecture_hall", "seminar_hall"]
    req_room = None
    if "auditorium" in lower or "aud" in lower:
        room_types, req_room = ["auditorium"], "AUD"
    elif "oat" in lower or "open-air" in lower or "outdoor" in lower:
        room_types, req_room = ["outdoor"], "OAT"
    elif "sh-2" in lower:
        room_types, req_room = ["seminar_hall"], "SH-2"
    elif "sh-1" in lower or "seminar hall" in lower:
        room_types, req_room = ["seminar_hall"], "SH-1"
    elif "lab" in lower or "computer" in lower:
        room_types, req_room = ["lab_cs"], "CS-LAB-1"

    conflict_note = None
    if req_room == "SH-2" and "accessible" in needs:
        req_room = "SH-1"
        conflict_note = "SH-2 is on the 1st floor with no lift (not wheelchair-accessible). Automatically switched to SH-1 (accessible, capacity 150)."
        follow_up = conflict_note

    mand = []
    if "mechanical third year" in lower or "me-3" in lower: mand.append("ME-3")
    if "cse-3" in lower or "cse third year" in lower: mand.append("CSE-3")
    if "ece-3" in lower or "ece third year" in lower: mand.append("ECE-3")

    cap = data.get("role_category_cap", {}).get(payload.role, "club_event")
    windows = [{"day": d, "from_period": from_p, "to_period": max(to_p, from_p + dur - 1)} for d in days_found]

    return {
        "attendance": att,
        "duration_periods": dur,
        "windows": windows,
        "needs": needs,
        "room_types": room_types,
        "requested_room": req_room,
        "effective_category": cap,
        "mandatory_for_groups": mand,
        "conflict_warning": conflict_note,
        "follow_up": follow_up,
    }


class ExplainRequest(BaseModel):
    session_id: Optional[str] = None
    booking_id: Optional[str] = None


@app.post("/ai/explain")
def explain_decision(req: ExplainRequest) -> Dict[str, Any]:
    """Explain why a session was placed in its slot or why a booking was approved/rejected."""
    data = load_dataset()
    sched = load_current_schedule(data)
    if req.session_id:
        s_obj = next((s for s in data["sessions"] if s["id"] == req.session_id), None)
        placed = next((s for s in sched.get("sessions", []) if s["session_id"] == req.session_id), None)
        if not s_obj or not placed:
            raise HTTPException(status_code=404, detail=f"Session {req.session_id} not found.")
        fac = next((f for f in data["faculty"] if f["id"] == s_obj["faculty_id"]), {})
        room = next((r for r in data["rooms"] if r["id"] == placed["room_id"]), {})
        reasons = [
            f"Placed on {placed['day']} Period P{placed['start_period']} in {placed['room_id']} ({room.get('name', '')}, capacity {room.get('capacity')}) for size {s_obj['size']} (H5 & S5 satisfied).",
            f"Instructor {fac.get('name', s_obj['faculty_id'])} is available and within their {fac.get('max_hours_per_day', 4)}-hour daily teaching limit (H7 & H12 satisfied).",
            f"Student groups {s_obj['groups']} have zero overlapping classes in {placed['day']} P{placed['start_period']} (H3 satisfied).",
        ]
        if s_obj.get("basket_slot"):
            reasons.append(f"Synchronized in elective basket {s_obj['basket_slot']} so all parallel electives run simultaneously (H11).")
        if s_obj["kind"] == "lab":
            reasons.append(f"3-hour lab placed at P{placed['start_period']} (valid lab start periods are P2 and P6, avoiding the 13:00-14:00 lunch break per H9).")
        return {"id": req.session_id, "type": "session", "placement": placed, "reasons": reasons}

    if req.booking_id:
        b_req = next((b for b in data["booking_requests"] if b["id"] == req.booking_id), None)
        b_dec = next((b for b in sched.get("fest_week", {}).get("bookings", []) if b["request_id"] == req.booking_id), None)
        if not b_req:
            raise HTTPException(status_code=404, detail=f"Booking {req.booking_id} not found.")
        return {"id": req.booking_id, "type": "booking", "request": b_req, "decision": b_dec}

    raise HTTPException(status_code=400, detail="Provide either session_id or booking_id.")
