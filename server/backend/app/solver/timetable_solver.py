import time
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

from ortools.sat.python import cp_model


class AcademicTimetableSolver:
    """CP-SAT Academic Timetable Solver satisfying H1-H12, H14 and optimizing S1-S6."""

    def __init__(self, dataset: Dict[str, Any], team_name: str = "Techzephyr"):
        self.data = dataset
        self.team_name = team_name
        self.days = dataset["calendar"]["days"]
        self.lunch = dataset["calendar"]["lunch"]["after_period"]
        self.lab_starts = set(dataset["calendar"]["lab_start_periods"])
        self.rooms = {r["id"]: r for r in dataset["rooms"]}
        self.faculty = {f["id"]: f for f in dataset["faculty"]}
        self.groups = {g["id"]: g for g in dataset["student_groups"]}
        self.sessions = {s["id"]: s for s in dataset["sessions"]}

        # Lookup tables for unavailabilities
        self.fac_un = set()
        for f in dataset["faculty"]:
            for u in f.get("unavailable", []):
                for p in u["periods"]:
                    self.fac_un.add((f["id"], u["day"], p))

        self.room_un = set()
        for u in dataset.get("room_unavailability", []):
            for p in u["periods"]:
                self.room_un.add((u["room_id"], u["day"], p))

    def _generate_candidates(self) -> Dict[str, List[Tuple[int, int, str]]]:
        """Pre-filter domain for every session based on static hard constraints."""
        candidates = {}
        for sid, s in self.sessions.items():
            dur = s["duration"]
            fid = s["faculty_id"]
            fx = s.get("fixed_slot")
            cands = []
            for d_idx, day in enumerate(self.days):
                # H14: Fixed slot day match
                if fx and fx["day"] != day:
                    continue
                for p in range(1, 10 - dur + 1):
                    # H14: Fixed slot start_period match
                    if fx and fx["start_period"] != p:
                        continue
                    # H9: Lunch boundary non-overlap (cannot cross P5 into P6)
                    if p <= self.lunch < p + dur:
                        continue
                    # H9: Lab start period must be in lab_start_periods (P2 or P6)
                    if s["kind"] == "lab" and p not in self.lab_starts:
                        continue
                    # H7: Faculty availability
                    if any((fid, day, q) in self.fac_un for q in range(p, p + dur)):
                        continue

                    # Room filtering
                    for rid, r in self.rooms.items():
                        # H5: Room capacity
                        if r["capacity"] < s["size"]:
                            continue
                        # H6: Room type
                        if r["type"] not in s["room_types"]:
                            continue
                        # H10: Accessibility
                        if s.get("needs_accessible") and not r.get("accessible"):
                            continue
                        # H8: Room unavailability
                        if any((rid, day, q) in self.room_un for q in range(p, p + dur)):
                            continue

                        cands.append((d_idx, p, rid))
            candidates[sid] = cands
        return candidates

    def solve(self, timeout_seconds: float = 35.0) -> Dict[str, Any]:
        """Build and solve CP-SAT model for academic sessions."""
        t0 = time.time()
        candidates = self._generate_candidates()

        for sid, cands in candidates.items():
            if not cands:
                raise ValueError(f"Session {sid} has no feasible candidate slots (hard constraints violated).")

        model = cp_model.CpModel()

        # Decision variables: x[sid, d_idx, p, rid]
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

        # H1 & H11: Basket synchronization and individual assignment
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
                raise ValueError(f"Elective basket {b} has no mutually feasible time slots across its sessions.")

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

        # H2: Faculty conflict (no two classes in same period)
        for (fid, d_idx, q), vlist in fac_period_vars.items():
            if len(vlist) > 1:
                model.AddAtMostOne(vlist)

        # H4: Room conflict (no double booking)
        for (rid, d_idx, q), vlist in room_period_vars.items():
            if len(vlist) > 1:
                model.AddAtMostOne(vlist)

        # H3: Student group conflict
        for (gid, d_idx, q), vlist in grp_period_vars.items():
            if len(vlist) > 1:
                model.AddAtMostOne(vlist)

        # H12: Faculty daily workload limit
        for (fid, d_idx), dur_var_list in fac_day_hours.items():
            mx = self.faculty[fid].get("max_hours_per_day", 4)
            model.Add(sum(dur * v for dur, v in dur_var_list) <= mx)

        # Soft constraints S1-S6
        obj_terms = []

        # S1: Faculty avoid preferences (+2 per avoided hour)
        for sid, s in self.sessions.items():
            dur = s["duration"]
            fid = s["faculty_id"]
            prefs = self.faculty[fid].get("preferences", [])
            for (d_idx, p, rid) in candidates[sid]:
                day = self.days[d_idx]
                per = list(range(p, p + dur))
                pen_s1 = 0
                for pref in prefs:
                    if pref.get("type") == "avoid" and day in pref.get("days", self.days):
                        pen_s1 += 2 * sum(1 for q in per if q in pref.get("periods", []))
                if pen_s1 > 0:
                    obj_terms.append(pen_s1 * x[sid, d_idx, p, rid])

        # S5: Room underutilization (+1 if size / capacity < 0.40)
        for sid, s in self.sessions.items():
            for (d_idx, p, rid) in candidates[sid]:
                cap = self.rooms[rid]["capacity"]
                if cap and (s["size"] / cap < 0.4):
                    obj_terms.append(1 * x[sid, d_idx, p, rid])

        # S6: Period 9 scheduling (+1 if in period 9)
        for sid, s in self.sessions.items():
            dur = s["duration"]
            for (d_idx, p, rid) in candidates[sid]:
                if 9 in range(p, p + dur):
                    obj_terms.append(1 * x[sid, d_idx, p, rid])

        # S4: Same course lecture twice in a day for a group (+3 per extra)
        lectures_by_group_course_day = defaultdict(list)
        for sid, s in self.sessions.items():
            if s["kind"] == "lecture" and not s.get("basket_slot"):
                cid = s["course_id"]
                for (d_idx, p, rid) in candidates[sid]:
                    v = x[sid, d_idx, p, rid]
                    for g in s["groups"]:
                        lectures_by_group_course_day[g, cid, d_idx].append(v)

        for (g, cid, d_idx), vlist in lectures_by_group_course_day.items():
            if len(vlist) > 1:
                excess = model.NewIntVar(0, len(vlist), f"s4_{g}_{cid}_{d_idx}")
                model.Add(excess >= sum(vlist) - 1)
                obj_terms.append(3 * excess)

        basket_courses = defaultdict(set)
        for sid, s in self.sessions.items():
            if s.get("basket_slot"):
                basket_courses[s["course_id"]].add(s["basket_slot"])

        for cid, b_slots in basket_courses.items():
            for d_idx in range(len(self.days)):
                b_day_vars = []
                for b in b_slots:
                    for p in range(1, 10):
                        if (b, d_idx, p) in basket_indicators:
                            b_day_vars.append(basket_indicators[b, d_idx, p])
                if len(b_day_vars) > 1:
                    excess_b = model.NewIntVar(0, len(b_day_vars), f"s4_basket_{cid}_{d_idx}")
                    model.Add(excess_b >= sum(b_day_vars) - 1)
                    obj_terms.append(3 * excess_b)

        # S3: Group daily overload > 6 hours (+3 per hour over 6)
        for gid in self.groups:
            for d_idx in range(len(self.days)):
                ghours_terms = []
                seen_basket = set()
                for sid, s in self.sessions.items():
                    if gid in s["groups"]:
                        b = s.get("basket_slot")
                        if b:
                            if b not in seen_basket:
                                seen_basket.add(b)
                                b_dur = s["duration"]
                                for p in range(1, 10):
                                    if (b, d_idx, p) in basket_indicators:
                                        ghours_terms.append(b_dur * basket_indicators[b, d_idx, p])
                        else:
                            for (d_idx_c, p, rid) in candidates[sid]:
                                if d_idx_c == d_idx:
                                    ghours_terms.append(s["duration"] * x[sid, d_idx, p, rid])
                if ghours_terms:
                    over6 = model.NewIntVar(0, 9, f"s3_over6_{gid}_{d_idx}")
                    model.Add(sum(ghours_terms) - 6 <= over6)
                    obj_terms.append(3 * over6)

        # S2: Idle gaps for student groups (+1 per gap period)
        for gid in self.groups:
            for d_idx in range(len(self.days)):
                active_vars = {}
                for q in range(1, 10):
                    vlist = grp_period_vars.get((gid, d_idx, q), [])
                    if vlist:
                        av = model.NewBoolVar(f"act_{gid}_{d_idx}_{q}")
                        model.Add(av == sum(vlist))
                        active_vars[q] = av
                    else:
                        active_vars[q] = None

                before = {}
                for q in range(2, 9):
                    prev_terms = [active_vars[k] for k in range(1, q) if active_vars[k] is not None]
                    if prev_terms:
                        b_var = model.NewBoolVar(f"bef_{gid}_{d_idx}_{q}")
                        model.AddMaxEquality(b_var, prev_terms)
                        before[q] = b_var
                    else:
                        before[q] = None

                after = {}
                for q in range(2, 9):
                    next_terms = [active_vars[k] for k in range(q + 1, 10) if active_vars[k] is not None]
                    if next_terms:
                        a_var = model.NewBoolVar(f"aft_{gid}_{d_idx}_{q}")
                        model.AddMaxEquality(a_var, next_terms)
                        after[q] = a_var
                    else:
                        after[q] = None

                for q in range(2, 9):
                    if before[q] is not None and after[q] is not None:
                        gap_q = model.NewBoolVar(f"gap_{gid}_{d_idx}_{q}")
                        act_expr = active_vars[q] if active_vars[q] is not None else 0
                        model.Add(gap_q >= before[q] + after[q] - act_expr - 1)
                        obj_terms.append(1 * gap_q)

        model.Minimize(sum(obj_terms))

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = timeout_seconds
        solver.parameters.num_search_workers = 8

        status = solver.Solve(model)
        solve_time = time.time() - t0

        if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            raise RuntimeError(f"Solver failed to find a feasible academic schedule (Status: {solver.StatusName(status)})")

        sessions_out = []
        for sid in self.sessions:
            for (d_idx, p, rid) in candidates[sid]:
                if solver.Value(x[sid, d_idx, p, rid]) == 1:
                    sessions_out.append({
                        "session_id": sid,
                        "day": self.days[d_idx],
                        "start_period": p,
                        "room_id": rid
                    })
                    break

        schedule_dict = {
            "team": self.team_name,
            "dataset_id": self.data.get("dataset_id", "cit-public-v1"),
            "sessions": sessions_out,
            "fest_week": {
                "bookings": [],
                "session_overrides": []
            },
            "exams": []
        }

        return {
            "status": "success",
            "solver_status": solver.StatusName(status),
            "solve_time_seconds": round(solve_time, 2),
            "objective_value": solver.ObjectiveValue(),
            "scheduled_sessions": len(sessions_out),
            "schedule": schedule_dict
        }
