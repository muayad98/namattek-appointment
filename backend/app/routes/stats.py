from fastapi import APIRouter
from datetime import datetime, timedelta
from ..main import db

router = APIRouter(prefix="/stats", tags=["stats"])

appointments = db.appointments

@router.get("/overview")
def overview():
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    today_count = appointments.count_documents({
        "start_time": {"$gte": today_start, "$lt": today_end},
        "status": "scheduled",
    })

    since = datetime.utcnow() - timedelta(days=30)
    total_30 = appointments.count_documents({"start_time": {"$gte": since}})
    no_show_30 = appointments.count_documents({
        "start_time": {"$gte": since},
        "status": "no-show",
    })
    no_show_rate = (no_show_30 / total_30) * 100 if total_30 else 0.0

    return {
        "today_bookings": today_count,
        "no_show_rate": round(no_show_rate, 1),
    }
