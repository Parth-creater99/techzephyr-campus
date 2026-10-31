import unittest
from fastapi import HTTPException

from backend.app.main import allocate_bookings, list_bookings, review_booking, ReviewBookingRequest


class TestFestBookings(unittest.TestCase):
    def test_list_bookings(self):
        res = list_bookings()
        self.assertEqual(res.total_requests, 25)
        self.assertEqual(len(res.requests), 25)

    def test_allocate_bookings(self):
        res = allocate_bookings()
        self.assertEqual(res.status, "success")
        total = res.approved_count + res.alternative_count + res.rejected_count
        self.assertEqual(total, 25)
        self.assertGreater(res.booking_score, 0)
        self.assertIn("bookings", res.fest_week)

    def test_self_approval_prevention(self):
        # Dramatics Society requested BR-07
        with self.assertRaises(HTTPException) as ctx:
            review_booking(
                "BR-07",
                ReviewBookingRequest(
                    status="approved",
                    reason="Self approval test",
                    day="THU",
                    start_period=10,
                    end_period=12,
                    room_id="AUD",
                    reviewer_role="admin",
                    reviewer_id="Dramatics Society",
                ),
            )
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Self-approval is forbidden", ctx.exception.detail)

    def test_unauthorized_role_prevention(self):
        with self.assertRaises(HTTPException) as ctx:
            review_booking(
                "BR-07",
                ReviewBookingRequest(
                    status="approved",
                    reason="Club approval test",
                    day="THU",
                    start_period=10,
                    end_period=12,
                    room_id="AUD",
                    reviewer_role="club",
                    reviewer_id="Random Club",
                ),
            )
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("not authorized", ctx.exception.detail)


if __name__ == "__main__":
    unittest.main()
