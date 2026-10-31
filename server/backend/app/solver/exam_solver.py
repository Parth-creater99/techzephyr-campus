import time
from collections import defaultdict
from typing import Any, Dict, List, Optional

from ortools.sat.python import cp_model


class ExamSolver:
    """CP-SAT Midsem Exam Solver for Chilika Institute of Technology.
    
    Enforces:
    - E1: All exams scheduled exactly once in valid calendar slots (MON-SAT, AM/PM).
    - E2: Rooms must have 'exam' in allowed_uses.
    - H4: No room double-booked in the same slot.
    - H3: No student group has more than one exam in the same slot.
    - H5: Half-capacity rule: sum(room.capacity // 2) >= exam.size.
    - Soft constraint: Minimize student groups having >1 exam on the same day.
    """

    def __init__(self, dataset: Dict[str, Any]):
        self.data = dataset
        self.cal = dataset["calendar"]["exam_week"]
        self.days = self.cal["days"]  # MON..SAT (6 days)
        self.sessions_list = [s["id"] for s in self.cal["sessions"]]  # ["AM", "PM"]
        self.exams = {e["id"]: e for e in dataset["exams"]}
        self.exam_rooms = [r for r in dataset["rooms"] if "exam" in r.get("allowed_uses", [])]
        self.room_half_cap = {r["id"]: r["capacity"] // 2 for r in self.exam_rooms}

    def solve(self, timeout_seconds: float = 25.0) -> Dict[str, Any]:
        """Solve midsem exam assignments using CP-SAT."""
        t0 = time.time()
        model = cp_model.CpModel()

        # Decision Variables:
        # T[eid, d_idx, s_idx]: Boolean indicating exam eid is scheduled in slot (d_idx, s_idx)
        # Z[eid, d_idx, s_idx, rid]: Boolean indicating exam eid uses room rid in slot (d_idx, s_idx)
        T = {}
        Z = {}

        for eid in self.exams:
            for d_idx in range(len(self.days)):
                for s_idx in range(len(self.sessions_list)):
                    t_var = model.NewBoolVar(f"T_{eid}_{d_idx}_{s_idx}")
                    T[eid, d_idx, s_idx] = t_var
                    for r in self.exam_rooms:
                        rid = r["id"]
                        z_var = model.NewBoolVar(f"Z_{eid}_{d_idx}_{s_idx}_{rid}")
                        Z[eid, d_idx, s_idx, rid] = z_var
                        # Room rid can only be used if exam is assigned to this slot
                        model.Add(z_var <= t_var)

        # 1. E1: Every exam must be scheduled exactly once
        for eid in self.exams:
            model.AddExactlyOne([
                T[eid, d_idx, s_idx]
                for d_idx in range(len(self.days))
                for s_idx in range(len(self.sessions_list))
            ])

        # 2. H5: Exam capacity - sum of half-capacity of assigned rooms >= exam size
        for eid, e in self.exams.items():
            req_size = e["size"]
            cap_terms = []
            for d_idx in range(len(self.days)):
                for s_idx in range(len(self.sessions_list)):
                    for r in self.exam_rooms:
                        rid = r["id"]
                        cap_terms.append(self.room_half_cap[rid] * Z[eid, d_idx, s_idx, rid])
            model.Add(sum(cap_terms) >= req_size)

        # 3. H4: Room double-booking - at most one exam per room per slot
        for r in self.exam_rooms:
            rid = r["id"]
            for d_idx in range(len(self.days)):
                for s_idx in range(len(self.sessions_list)):
                    model.AddAtMostOne([Z[eid, d_idx, s_idx, rid] for eid in self.exams])

        # 4. H3: Student group double-booking - at most one exam per group per slot
        for g in self.data["student_groups"]:
            gid = g["id"]
            g_exams = [eid for eid, e in self.exams.items() if gid in e["groups"]]
            if g_exams:
                for d_idx in range(len(self.days)):
                    for s_idx in range(len(self.sessions_list)):
                        model.AddAtMostOne([T[eid, d_idx, s_idx] for eid in g_exams])

        # 5. Soft constraint: Minimize multiple exams on the same day for a group
        obj_terms = []
        for g in self.data["student_groups"]:
            gid = g["id"]
            g_exams = [eid for eid, e in self.exams.items() if gid in e["groups"]]
            if len(g_exams) > 1:
                for d_idx in range(len(self.days)):
                    day_exam_terms = [
                        T[eid, d_idx, s_idx]
                        for eid in g_exams
                        for s_idx in range(len(self.sessions_list))
                    ]
                    pen = model.NewIntVar(0, len(g_exams), f"pen_{gid}_{d_idx}")
                    model.Add(pen >= sum(day_exam_terms) - 1)
                    # 5 penalty points per extra exam for a group on the same day
                    obj_terms.append(5 * pen)

        # Tie-breaker: Minimize total number of room allocations
        for k, v in Z.items():
            obj_terms.append(1 * v)

        model.Minimize(sum(obj_terms))

        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = timeout_seconds
        solver.parameters.num_search_workers = 8

        status = solver.Solve(model)
        solve_time = time.time() - t0

        if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
            raise RuntimeError(f"Exam solver failed to find a valid schedule (Status: {solver.StatusName(status)})")

        exams_out = []
        for eid in self.exams:
            chosen_slot = None
            chosen_rooms = []
            for d_idx, day in enumerate(self.days):
                for s_idx, sess in enumerate(self.sessions_list):
                    if solver.Value(T[eid, d_idx, s_idx]) == 1:
                        chosen_slot = (day, sess)
                        for r in self.exam_rooms:
                            rid = r["id"]
                            if solver.Value(Z[eid, d_idx, s_idx, rid]) == 1:
                                chosen_rooms.append(rid)
                        break
                if chosen_slot:
                    break

            exams_out.append({
                "exam_id": eid,
                "day": chosen_slot[0],
                "session": chosen_slot[1],
                "rooms": chosen_rooms
            })

        return {
            "status": "success",
            "solver_status": solver.StatusName(status),
            "solve_time_seconds": round(solve_time, 2),
            "objective_value": solver.ObjectiveValue(),
            "exams_scheduled": len(exams_out),
            "exams": exams_out
        }
