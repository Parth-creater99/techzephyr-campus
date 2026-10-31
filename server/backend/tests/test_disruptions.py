import json
import unittest
from fastapi import HTTPException

from backend.app.main import (
    apply_disruption_repair,
    get_disruption_proposal,
    list_disruptions,
    preview_disruption_repair,
    DisruptionApplyRequest,
    DisruptionPayload,
    SCHEDULE_AFTER_EXPORT_PATH,
    SCHEDULE_EXPORT_PATH,
)
from backend.app.solver.repair_solver import TimetableRepairSolver


class TestDisruptionHandling(unittest.TestCase):

    def test_successful_repair_preview(self):
        """Test previewing repair on official sample_disruption.json without modifying active schedule."""
        # Ensure active schedule exists
        self.assertTrue(SCHEDULE_EXPORT_PATH.exists())
        with open(SCHEDULE_EXPORT_PATH, "r", encoding="utf-8") as f:
            sched_before = json.load(f)

        res = preview_disruption_repair()
        self.assertEqual(res.status, "pending_admin_approval")
        self.assertIn(res.solver_status, ("OPTIMAL", "FEASIBLE"))
        self.assertGreater(res.total_changes, 0)
        self.assertTrue(len(res.changes) > 0)

        # Check change record structure (Requirement 5)
        ch0 = res.changes[0]
        self.assertIn("session_id", ch0)
        self.assertIn("type", ch0)
        self.assertIn("reason", ch0)

        # Check stability: room_only_changed should be majority
        self.assertGreaterEqual(res.room_only_changed, res.time_changed)

        # Active schedule must NOT have changed (Requirement 4)
        with open(SCHEDULE_EXPORT_PATH, "r", encoding="utf-8") as f:
            sched_after_preview = json.load(f)
        self.assertEqual(len(sched_before["sessions"]), len(sched_after_preview["sessions"]))

    def test_admin_approval_behavior(self):
        """Requirement 6: Non-admin cannot apply, admin can apply."""
        preview = preview_disruption_repair()
        disp_id = preview.disruption_id

        # 1. Non-admin approval attempt -> Must raise HTTP 403
        with self.assertRaises(HTTPException) as ctx:
            apply_disruption_repair(
                disp_id,
                DisruptionApplyRequest(
                    reviewer_role="faculty",
                    reviewer_id="Prof. Sharma",
                ),
            )
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Admin approval required", ctx.exception.detail)

        # 2. Admin approval -> Must succeed
        apply_res = apply_disruption_repair(
            disp_id,
            DisruptionApplyRequest(
                reviewer_role="admin",
                reviewer_id="Dean Academic",
            ),
        )
        self.assertEqual(apply_res.status, "applied")
        self.assertEqual(apply_res.applied_by, "Dean Academic")
        self.assertTrue(SCHEDULE_AFTER_EXPORT_PATH.exists())

    def test_impossible_disruption(self):
        """Test that impossible disruption returns clear error rather than invalid timetable."""
        # Impossible disruption: new session with 1000 size requiring small classroom
        impossible_payload = DisruptionPayload(
            id="impossible-test",
            description="Impossible class size",
            changes=[
                {
                    "type": "add_session",
                    "session": {
                        "id": "IMPOSSIBLE-101",
                        "course_id": "CS999",
                        "kind": "lecture",
                        "groups": ["CSE-2"],
                        "faculty_id": "F01",
                        "size": 5000,  # No room on campus seats 5,000 students
                        "duration": 1,
                        "room_types": ["classroom"],
                        "needs_accessible": False,
                        "basket_slot": None,
                        "fixed_slot": None,
                    },
                }
            ],
        )

        with self.assertRaises(HTTPException) as ctx:
            preview_disruption_repair(impossible_payload)
        self.assertEqual(ctx.exception.status_code, 422)
        self.assertIn("cannot be repaired", ctx.exception.detail)

    def test_hard_constraint_preservation_with_validator(self):
        """Requirement 2 & 9: Official validator reports 0 hard violations on repaired schedule."""
        import sys
        sys.path.append("CrunchWeek_StarterPack")
        import validator

        with open("CrunchWeek_StarterPack/data/cit_public.json", encoding="utf-8") as f:
            data = json.load(f)
        with open("CrunchWeek_StarterPack/examples/sample_disruption.json", encoding="utf-8") as f:
            disruption = json.load(f)
        with open("exports/schedule.json", encoding="utf-8") as f:
            baseline = json.load(f)
        with open("exports/schedule_after.json", encoding="utf-8") as f:
            sched_after = json.load(f)

        mutated_data = validator.apply_disruption(data, disruption)
        rep = validator.run(mutated_data, sched_after, baseline=baseline)

        self.assertEqual(rep["hard_violation_count"], 0)
        self.assertGreater(rep["stability"]["sessions_moved"], 0)


if __name__ == "__main__":
    unittest.main()
