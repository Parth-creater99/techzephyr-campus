import copy
import time
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

from ortools.sat.python import cp_model


def apply_disruption_to_data(data: Dict[str, Any], disruption: Dict[str, Any]) -> Dict[str, Any]:
    """Apply atomic disruption mutations to dataset, matching official validator logic with defensive validation."""
    if not isinstance(disruption, dict):
        raise ValueError("Disruption payload must be a JSON object.")

    d = copy.deepcopy(data)
    fac = {f["id"]: f for f in d.get("faculty", [])}
    rooms = {r["id"]: r for r in d.get("rooms", [])}

    for ch in disruption.get("changes", []):
        if not isinstance(ch, dict):
            raise ValueError("Each item in 'changes' must be an object.")
        t = ch.get("type")
        if t == "faculty_unavailable":
            fid = ch.get("faculty_id")
            if not fid or fid not in fac:
                raise ValueError(f"Faculty '{fid}' not found in dataset.")
            days = ch.get("days", [])
            periods = ch.get("periods", [])
            if not isinstance(days, list) or not isinstance(periods, list):
                raise ValueError(f"faculty_unavailable change for '{fid}' must include 'days' and 'periods' lists.")
            for day in days:
                fac[fid].setdefault("unavailable", []).append({
                    "day": day,
                    "periods": periods,
                    "reason": ch.get("reason", "")
                })
        elif t == "room_unavailable":
            rid = ch.get("room_id")
            if not rid or rid not in rooms:
                raise ValueError(f"Room '{rid}' not found in dataset.")
            days = ch.get("days", [])
            periods = ch.get("periods", [])
            if not isinstance(days, list) or not isinstance(periods, list):
                raise ValueError(f"room_unavailable change for '{rid}' must include 'days' and 'periods' lists.")
            for day in days:
                d.setdefault("room_unavailability", []).append({
                    "room_id": rid,
                    "day": day,
                    "periods": periods,
                    "reason": ch.get("reason", "")
                })
        elif t == "add_faculty":
            new_fac = ch.get("faculty")
            if not isinstance(new_fac, dict) or "id" not in new_fac:
                raise ValueError("add_faculty change must include a valid 'faculty' object with an 'id'.")
            d.setdefault("faculty", []).append(new_fac)
            fac[new_fac["id"]] = new_fac
        elif t == "add_session":
            new_sess = ch.get("session")
            if not isinstance(new_sess, dict) or "id" not in new_sess:
                raise ValueError("add_session change must include a valid 'session' object with an 'id'.")
            d.setdefault("sessions", []).append(new_sess)
        elif t == "remove_session":
            sid = ch.get("session_id")
            if not sid:
                raise ValueError("remove_session change must include 'session_id'.")
            d["sessions"] = [s for s in d.get("sessions", []) if s["id"] != sid]
        else:
            raise ValueError(f"Unknown disruption change type: '{t}'.")
    return d


class TimetableRepairSolver:
    """CP-SAT Timetable Repair Solver with Stability Optimization.
    
    Preserves all hard constraints (H1-H12, H14) while heavily penalizing:
    - Moving sessions from their baseline slots.
    - Changing time slots (W_TIME = 1000) vs keeping the time slot and only changing the room (W_ROOM = 100).
    """

    def __init__(self, dataset: Dict[str, Any], baseline_schedule: Dict[str, Any], disruption: Dict[str, Any]):
        self.original_data = dataset
        self.disruption = disruption
        self.mutated_data = apply_disruption_to_data(dataset, disruption)
        self.baseline_schedule = baseline_schedule

        # Base assignment lookup: sid -> (day, start, rid)
        self.b_assign = {}
        for s in baseline_schedule.get("sessions", []):
            self.b_assign[s["session_id"]] = (s["day"], s["start_period"], s["room_id"])

        self.days = self.mutated_data["calendar"]["days"]
        self.day_to_idx = {d: i for i, d in enumerate(self.days)}
        self.idx_to_day = {i: d for i, d in enumerate(self.days)}
        self.lunch = self.mutated_data["calendar"]["lunch"]["after_period"]
        self.lab_starts = set(self.mutated_data["calendar"]["lab_start_periods"])
        self.rooms = {r["id"]: r for r in self.mutated_data["rooms"]}
        self.faculty = {f["id"]: f for f in self.mutated_data["faculty"]}
        self.groups = {g["id"]: g for g in self.mutated_data["student_groups"]}
        self.sessions = {s["id"]: s for s in self.mutated_data["sessions"]}

        self.fac_un = set()
        for f in self.mutated_data["faculty"]:
            for u in f.get("unavailable", []):
                for p in u["periods"]:
                    self.fac_un.add((f["id"], u["day"], p))

        self.room_un = set()
        for u in self.mutated_data.get("room_unavailability", []):
            for p in u["periods"]:
                self.room_un.add((u["room_id"], u["day"], p))

    def _generate_candidates(self) -> Dict[str, List[Tuple[int, int, str]]]:
        candidates = {}
        for sid, s in self.sessions.items():
            dur = s["duration"]
            fid = s["faculty_id"]
            fx = s.get("fixed_slot")
            cands = []
            for d_idx, day in enumerate(self.days):
                if fx and fx["day"] != day:
                    continue
                for p in range(1, 10 - dur + 1):
                    if fx and fx["start_period"] != p:
                        continue
                    if p <= self.lunch < p + dur:
                        continue
                    if s["kind"] == "lab" and p not in self.lab_starts:
                        continue
                    if any((fid, day, q) in self.fac_un for q in range(p, p + dur)):
                        continue

                    for rid, r in self.rooms.items():
                        if r["capacity"] < s["size"]:
                            continue
                        if r["type"] not in s["room_types"]:
                            continue
                        if s.get("needs_accessible") and not r.get("accessible"):
                            continue
                        if any((rid, day, q) in self.room_un for q in range(p, p + dur)):
                            continue

                        cands.append((d_idx, p, rid))
            candidates[sid] = cands
        return candidates

    def solve(self, timeout_seconds: float = 25.0) -> Dict[str, Any]:
        """Solve timetable repair maximizing stability."""
        t0 = time.time()
        candidates = self._generate_candidates()

        # Check immediate infeasibility
        infeasible_sessions = [sid for sid, c in candidates.items() if not c]
        if infeasible_sessions:
            raise RuntimeError(
                f"Disruption causes impossible scheduling: sessions {infeasible_sessions} have 0 feasible slots under new constraints."
            )

        model = cp_model.CpModel()
        x = {}
        sess_vars = defaultdict(list)
        room_period_vars = defaultdict(list)
        fac_period_vars = defaultdict(list)
        fac_day_hours = defaultdict(list)
        grp_period_vars = defaultdict(list)
        sess_time_room_vars = defaultdict(lambda: defaultdict(list))

        for sid, s in self.sessions.items():
            dur = s["duration"]
            fid = s["faculty_id"]
            b = s.get("basket_slot")
            for (d_idx, p, rid) in candidates[sid]:
                v = model.NewBoolVar(f"x_{sid}_{d_idx}_{p}_{rid}")
                x[sid, d_idx, p, rid] = v
                sess_vars[sid].append(v)
                sess_time_room_vars[sid][d_idx, p].append(v)
                fac_day_hours[fid, d_idx].append((dur, v))
                for q in range(p, p + dur):
                    room_period_vars[rid, d_idx, q].append(v)
                    fac_period_vars[fid, d_idx, q].append(v)
                    if not b:
                        for g in s["groups"]:
                            grp_period_vars[g, d_idx, q].append(v)

        # H1 & H11: Basket synchronization
        basket_sessions = defaultdict(list)
        for sid, s in self.sessions.items():
            b = s.get("basket_slot")
            if b:
                basket_sessions[b].append(sid)
            else:
                model.AddExactlyOne(sess_vars[sid])

        basket_indicators = {}
        for b, sids in basket_sessions.items():
            common_times = set.intersection(*(set(sess_time_room_vars[sid].keys()) for sid in sids))
            if not common_times:
                raise RuntimeError(f"Elective basket {b} has no mutually available time slots after disruption.")

            b_vars = []
            b_dur = self.sessions[sids[0]]["duration"]
            b_groups = self.sessions[sids[0]]["groups"]

            for (d_idx, p) in common_times:
                bv = model.NewBoolVar(f"B_{b}_{d_idx}_{p}")
                basket_indicators[b, d_idx, p] = bv
                b_vars.append(bv)
                for sid in sids:
                    model.Add(sum(sess_time_room_vars[sid][d_idx, p]) == bv)
                for q in range(p, p + b_dur):
                    for g in b_groups:
                        grp_period_vars[g, d_idx, q].append(bv)

            model.AddExactlyOne(b_vars)
            for sid in sids:
                for (d_idx, p), vlist in sess_time_room_vars[sid].items():
                    if (d_idx, p) not in common_times:
                        for v in vlist:
                            model.Add(v == 0)

        # H2: Faculty conflict
        for (fid, d_idx, q), vlist in fac_period_vars.items():
            if len(vlist) > 1:
                model.AddAtMostOne(vlist)

        # H4: Room conflict
        for (rid, d_idx, q), vlist in room_period_vars.items():
            if len(vlist) > 1:
                model.AddAtMostOne(vlist)

        # H3: Student group conflict
        for (gid, d_idx, q), vlist in grp_period_vars.items():
            if len(vlist) > 1:
                model.AddAtMostOne(vlist)

        # H12: Faculty workload limit
        for (fid, d_idx), dur_var_list in fac_day_hours.items():
            mx = self.faculty[fid].get("max_hours_per_day", 4)
            model.Add(sum(dur * v for dur, v in dur_var_list) <= mx)

        # Stability Objective (Heavy penalty for changing slots)
        obj_terms = []
        W_TIME = 1000
        W_ROOM = 100

        for sid in self.sessions:
            if sid in self.b_assign:
                old_day, old_p, old_rid = self.b_assign[sid]
                old_d_idx = self.day_to_idx.get(old_day)
                if old_d_idx is not None:
                    for (d_idx, p, rid) in candidates[sid]:
                        if d_idx == old_d_idx and p == old_p and rid == old_rid:
                            cost = 0
                        elif d_idx == old_d_idx and p == old_p:
                            cost = W_ROOM
                        else:
                            cost = W_TIME
                        if cost > 0:
                            obj_terms.append(cost * x[sid, d_idx, p, rid])

        # Provide warm-start hints from baseline schedule for faster and more stable convergence
        for sid in self.sessions:
            if sid in self.b_assign:
                old_day, old_p, old_rid = self.b_assign[sid]
                old_d_idx = self.day_to_idx.get(old_day)
                if old_d_idx is not None and (sid, old_d_idx, old_p, old_rid) in x:
                    model.AddHint(x[sid, old_d_idx, old_p, old_rid], 1)

        model.Minimize(sum(obj_terms))

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = timeout_seconds
        solver.parameters.num_search_workers = 8

        status = solver.Solve(model)
        solve_time = time.time() - t0

        if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            raise RuntimeError(
                f"Repair solver failed to find a valid conflict-free schedule (Status: {solver.StatusName(status)})"
            )

        sessions_after = []
        changes = []
        sessions_moved = 0
        time_changed = 0
        room_only_changed = 0

        # Check removed sessions
        removed_ids = set(self.b_assign.keys()) - set(self.sessions.keys())
        for rsid in sorted(removed_ids):
            old_day, old_p, old_rid = self.b_assign[rsid]
            changes.append({
                "session_id": rsid,
                "type": "removed_session",
                "old": {"day": old_day, "start_period": old_p, "room_id": old_rid},
                "new": None,
                "reason": "Session removed due to disruption"
            })

        for sid in self.sessions:
            for (d_idx, p, rid) in candidates[sid]:
                if solver.Value(x[sid, d_idx, p, rid]) == 1:
                    cur_day = self.idx_to_day[d_idx]
                    sessions_after.append({
                        "session_id": sid,
                        "day": cur_day,
                        "start_period": p,
                        "room_id": rid
                    })
                    if sid in self.b_assign:
                        old_day, old_p, old_rid = self.b_assign[sid]
                        if (old_day, old_p, old_rid) != (cur_day, p, rid):
                            sessions_moved += 1
                            if (old_day, old_p) == (cur_day, p):
                                ch_type = "room_only"
                                room_only_changed += 1
                                reason = f"Room reassigned from {old_rid} to {rid} at same time {cur_day} P{p}."
                            else:
                                ch_type = "time_and_room" if old_rid != rid else "time_only"
                                time_changed += 1
                                reason = f"Rescheduled from {old_day} P{old_p} ({old_rid}) to {cur_day} P{p} ({rid})."

                            changes.append({
                                "session_id": sid,
                                "type": ch_type,
                                "old": {"day": old_day, "start_period": old_p, "room_id": old_rid},
                                "new": {"day": cur_day, "start_period": p, "room_id": rid},
                                "reason": reason
                            })
                    else:
                        changes.append({
                            "session_id": sid,
                            "type": "added_session",
                            "old": None,
                            "new": {"day": cur_day, "start_period": p, "room_id": rid},
                            "reason": f"New session placed at {cur_day} P{p} in {rid}."
                        })
                    break

        repaired_schedule = {
            "team": self.baseline_schedule.get("team", "Techzephyr"),
            "dataset_id": self.mutated_data.get("dataset_id", "cit-public-v1"),
            "sessions": sessions_after,
            "fest_week": self.baseline_schedule.get("fest_week", {"bookings": [], "session_overrides": []}),
            "exams": self.baseline_schedule.get("exams", [])
        }

        # Re-allocate fest week around repaired academic timetable to eliminate any fest clashes
        if self.baseline_schedule.get("fest_week", {}).get("bookings"):
            from backend.app.solver.fest_allocator import FestEventAllocator
            fest_result = FestEventAllocator(self.mutated_data, repaired_schedule).allocate()
            repaired_schedule["fest_week"] = fest_result["fest_week"]

        return {
            "status": "success",
            "solver_status": solver.StatusName(status),
            "solve_time_seconds": round(solve_time, 2),
            "stability": {
                "sessions_moved": sessions_moved,
                "time_changed": time_changed,
                "room_only_changed": room_only_changed,
                "moved_ids": [c["session_id"] for c in changes if c["type"] in ("room_only", "time_only", "time_and_room")]
            },
            "total_changes": len(changes),
            "changes": changes,
            "repaired_schedule": repaired_schedule,
            "mutated_data": self.mutated_data
        }
