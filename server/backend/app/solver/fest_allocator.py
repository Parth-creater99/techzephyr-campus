import copy
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple


CAT_WEIGHT = {
    "institute_event": 5,
    "guest_lecture": 4,
    "department_event": 3,
    "club_event": 2,
}
MAX_PERIOD = 13
LAST_TEACHING = 9


class FestEventAllocator:
    """Spectra Fest Week Event Booking Allocator adhering to CIT priority rules."""

    def __init__(self, dataset: Dict[str, Any], current_schedule: Dict[str, Any]):
        self.data = dataset
        self.schedule = current_schedule
        self.order = dataset["priority_order"]
        self.cap_map = dataset["role_category_cap"]
        self.cancelled = {c["request_id"] for c in dataset.get("cancellations", [])}
        self.rooms = {r["id"]: r for r in dataset["rooms"]}
        self.faculty = {f["id"]: f for f in dataset["faculty"]}
        self.sessions = {s["id"]: s for s in dataset["sessions"]}
        self.days = dataset["calendar"]["days"]
        self.lunch = dataset["calendar"]["lunch"]["after_period"]
        self.lab_starts = set(dataset["calendar"]["lab_start_periods"])

        self.fac_un = defaultdict(set)
        for f in dataset["faculty"]:
            for u in f.get("unavailable", []):
                for p in u["periods"]:
                    self.fac_un[f["id"]].add((u["day"], p))

        self.room_un = defaultdict(set)
        for u in dataset.get("room_unavailability", []):
            for p in u["periods"]:
                self.room_un[u["room_id"]].add((u["day"], p))

        self.base_assign = {}
        for s in current_schedule.get("sessions", []):
            self.base_assign[s["session_id"]] = (s["day"], s["start_period"], s["room_id"])

    def effective_category(self, req: Dict[str, Any]) -> str:
        cap = self.cap_map.get(req.get("role", "club"), "club_event")
        req_cat = req.get("requested_category", "club_event")
        a = self.order.index(req_cat) if req_cat in self.order else len(self.order) - 1
        return self.order[max(a, self.order.index(cap))]

    def outranks(self, r1: Dict[str, Any], r2: Dict[str, Any]) -> bool:
        c1 = self.order.index(self.effective_category(r1))
        c2 = self.order.index(self.effective_category(r2))
        if c1 != c2:
            return c1 < c2
        return r1["submitted_at"] < r2["submitted_at"]

    def get_candidate_rooms(self, req: Dict[str, Any]) -> List[str]:
        cands = []
        req_needs = set(req.get("needs", []))
        req_types = req.get("room_types", [])
        attendance = req.get("attendance", 0)

        for rid, r in self.rooms.items():
            if "event" not in r.get("allowed_uses", []):
                continue
            if r["type"] not in req_types:
                continue
            if r["capacity"] < attendance:
                continue
            feats = set(r["features"]) | ({"accessible"} if r.get("accessible") else set())
            if req_needs - feats:
                continue
            cands.append(rid)

        pref_room = req.get("requested_room")
        if pref_room in cands:
            cands.remove(pref_room)
            cands.insert(0, pref_room)
        return cands

    def allocate(self) -> Dict[str, Any]:
        sorted_requests = sorted(
            self.data["booking_requests"],
            key=lambda req: (self.order.index(self.effective_category(req)), req["submitted_at"])
        )

        week_assign = dict(self.base_assign)
        session_overrides = []

        def build_occupancy():
            room_busy = defaultdict(list)
            wgrp = defaultdict(set)
            for sid, (day, start, rid) in week_assign.items():
                s = self.sessions.get(sid)
                if s:
                    for p in range(start, start + s["duration"]):
                        room_busy[(rid, day, p)].append(sid)
                        for g in s["groups"]:
                            wgrp[(g, day, p)].add(s.get("basket_slot") or sid)
            return room_busy, wgrp

        room_busy, wgrp = build_occupancy()

        def is_slot_free(rid, day, a, b, req, allow_displace=False):
            if a < 1 or b > MAX_PERIOD or b < a:
                return False, []
            if b - a + 1 != req["duration_periods"]:
                return False, []
            for p in range(a, b + 1):
                if (day, p) in self.room_un[rid]:
                    return False, []
            for g in req.get("mandatory_for_groups", []):
                for p in range(a, b + 1):
                    if wgrp.get((g, day, p)):
                        return False, []
            clashing = []
            for p in range(a, b + 1):
                for occ in room_busy.get((rid, day, p), []):
                    if occ.startswith("BR-"):
                        return False, []
                    elif occ in self.sessions:
                        if not allow_displace:
                            return False, []
                        if occ not in clashing:
                            clashing.append(occ)
            return True, clashing

        def find_override_slot(sid, avoid_slots):
            s = self.sessions[sid]
            if s.get("fixed_slot") or s.get("basket_slot"):
                return None
            dur = s["duration"]
            fid = s["faculty_id"]
            groups = s["groups"]
            own_key = s.get("basket_slot") or sid
            mx_hours = self.faculty[fid].get("max_hours_per_day", 4)
            for d in self.days:
                day_hours = sum(
                    self.sessions[o_sid]["duration"]
                    for o_sid, (o_day, _, _) in week_assign.items()
                    if o_sid != sid and o_day == d and self.sessions[o_sid]["faculty_id"] == fid
                )
                if day_hours + dur > mx_hours:
                    continue
                for start in range(1, 10 - dur + 1):
                    if start <= self.lunch < start + dur - 1:
                        continue
                    if s["kind"] == "lab" and start not in self.lab_starts:
                        continue
                    per = range(start, start + dur)
                    if any((d, q) in self.fac_un[fid] for q in per):
                        continue
                    fac_busy = False
                    for o_sid, (o_day, o_start, o_rid) in week_assign.items():
                        if o_sid == sid:
                            continue
                        o_s = self.sessions[o_sid]
                        if o_s["faculty_id"] == fid and o_day == d:
                            if any(q in range(o_start, o_start + o_s["duration"]) for q in per):
                                fac_busy = True
                                break
                    if fac_busy:
                        continue

                    grp_busy = False
                    for g in groups:
                        for q in per:
                            other_grps = wgrp.get((g, d, q), set()) - {own_key}
                            if other_grps:
                                grp_busy = True
                                break
                        if grp_busy:
                            break
                    if grp_busy:
                        continue

                    for r_cand in self.rooms.values():
                        if r_cand["capacity"] < s["size"]:
                            continue
                        if r_cand["type"] not in s["room_types"]:
                            continue
                        if s.get("needs_accessible") and not r_cand.get("accessible"):
                            continue
                        if any((d, q) in self.room_un[r_cand["id"]] for q in per):
                            continue
                        if any((r_cand["id"], d, q) in avoid_slots for q in per):
                            continue
                        if any([x for x in room_busy.get((r_cand["id"], d, q), []) if x != sid] for q in per):
                            continue
                        return d, start, r_cand["id"]
            return None

        decisions = []

        for req in sorted_requests:
            req_id = req["id"]
            eff_cat = self.effective_category(req)
            dur = req["duration_periods"]

            if req_id in self.cancelled:
                decisions.append({
                    "request_id": req_id,
                    "status": "rejected",
                    "reason": "Cancelled / withdrawn by requester"
                })
                continue

            cands = self.get_candidate_rooms(req)
            if not cands:
                decisions.append({
                    "request_id": req_id,
                    "status": "rejected",
                    "reason": f"No venue on campus seats {req['attendance']} with required features {req.get('needs', [])}"
                })
                continue

            approved_slot = None
            allow_displace = (self.order.index(eff_cat) <= self.order.index("institute_event"))

            for w in req.get("windows", []):
                day = w["day"]
                w_from = w["from_period"]
                w_to = w["to_period"]
                for start in range(w_from, w_to - dur + 2):
                    end = start + dur - 1
                    if end > MAX_PERIOD or end > w_to:
                        continue
                    for rid in cands:
                        free, clashing = is_slot_free(rid, day, start, end, req, allow_displace=allow_displace)
                        if free:
                            if not clashing:
                                approved_slot = (rid, day, start, end, [])
                                break
                            else:
                                can_displace = True
                                plan = []
                                avoid = {(rid, day, p) for p in range(start, end + 1)}
                                for csid in clashing:
                                    ov = find_override_slot(csid, avoid)
                                    if ov:
                                        plan.append((csid, ov[0], ov[1], ov[2]))
                                    else:
                                        can_displace = False
                                        break
                                if can_displace:
                                    approved_slot = (rid, day, start, end, plan)
                                    break
                    if approved_slot:
                        break
                if approved_slot:
                    break

            if approved_slot:
                rid, day, a, b, ov_plan = approved_slot
                for (csid, new_d, new_p, new_r) in ov_plan:
                    session_overrides.append({
                        "session_id": csid,
                        "day": new_d,
                        "start_period": new_p,
                        "room_id": new_r,
                        "displaced_by": req_id
                    })
                    week_assign[csid] = (new_d, new_p, new_r)

                if ov_plan:
                    room_busy, wgrp = build_occupancy()

                for p in range(a, b + 1):
                    room_busy[(rid, day, p)].append(req_id)

                reason_str = "Approved in requested window"
                if ov_plan:
                    moved_str = ", ".join(f"{csid} moved to {nd} P{np} ({nr})" for csid, nd, np, nr in ov_plan)
                    reason_str = f"Institute event approved in requested window ({moved_str})"

                decisions.append({
                    "request_id": req_id,
                    "status": "approved",
                    "day": day,
                    "start_period": a,
                    "end_period": b,
                    "room_id": rid,
                    "reason": reason_str
                })
                continue

            alt_slot = None
            period_ranges = [
                list(range(10, 14 - dur + 1)),
                list(range(6, 10 - dur + 1)),
                list(range(1, 6 - dur + 1))
            ]
            all_starts = [p for pr in period_ranges for p in pr]

            for day in self.days:
                for start in all_starts:
                    end = start + dur - 1
                    if end > MAX_PERIOD:
                        continue
                    for rid in cands:
                        free, clashing = is_slot_free(rid, day, start, end, req, allow_displace=False)
                        if free and not clashing:
                            alt_slot = (rid, day, start, end)
                            break
                    if alt_slot:
                        break
                if alt_slot:
                    break

            if alt_slot:
                rid, day, a, b = alt_slot
                for p in range(a, b + 1):
                    room_busy[(rid, day, p)].append(req_id)

                decisions.append({
                    "request_id": req_id,
                    "status": "alternative_offered",
                    "day": day,
                    "start_period": a,
                    "end_period": b,
                    "room_id": rid,
                    "reason": f"Requested window unavailable or out of bounds; alternative offered in {rid} on {day} P{a}-P{b}"
                })
            else:
                decisions.append({
                    "request_id": req_id,
                    "status": "rejected",
                    "reason": "No venue available matching requirements during requested or alternative time slots"
                })

        score = 0.0
        max_score = 0.0
        for req in self.data["booking_requests"]:
            if req["id"] not in self.cancelled:
                cat = self.effective_category(req)
                max_score += CAT_WEIGHT.get(cat, 0)

        for d in decisions:
            req_id = d["request_id"]
            if req_id in self.cancelled:
                continue
            req = next((r for r in self.data["booking_requests"] if r["id"] == req_id), None)
            if not req:
                continue
            cat = self.effective_category(req)
            weight = CAT_WEIGHT.get(cat, 0)
            if d["status"] == "approved":
                score += weight * 1.0
            elif d["status"] == "alternative_offered":
                score += weight * 0.5

        return {
            "fest_week": {
                "bookings": decisions,
                "session_overrides": session_overrides
            },
            "stats": {
                "booking_score": score,
                "booking_score_max": max_score,
                "approved_count": sum(1 for d in decisions if d["status"] == "approved"),
                "alternative_count": sum(1 for d in decisions if d["status"] == "alternative_offered"),
                "rejected_count": sum(1 for d in decisions if d["status"] == "rejected"),
                "session_overrides_count": len(session_overrides)
            }
        }
