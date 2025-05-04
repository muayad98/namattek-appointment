from fastapi import APIRouter, HTTPException
from bson import ObjectId
from dateutil.relativedelta import relativedelta
from ..main import db
from ..schemas import AppointmentIn
from ..utils import to_str

router = APIRouter(prefix="/appointments", tags=["appointments"])

svc_col = db.services
cust_col = db.customers
appt_col = db.appointments

# Ensure a fast overlap check
appt_col.create_index([("start_time", 1), ("service_id", 1)], background=True)


@router.post("")
def create_appointment(payload: AppointmentIn):
    """Create a new appointment, auto‑creating the customer if needed."""

    # 1) validate service
    service = svc_col.find_one({"_id": ObjectId(payload.service_id)})
    if not service:
        raise HTTPException(status_code=400, detail="invalid service_id")

    # 2) compute end_time from service duration
    end_time = payload.start_time + relativedelta(
        minutes=service["duration_minutes"]
    )

    # 3) prevent double‑booking
    clash = appt_col.find_one(
        {
            "service_id": payload.service_id,
            "status": "scheduled",
            "start_time": {"$lt": end_time},
            "end_time": {"$gt": payload.start_time},
        }
    )
    if clash:
        raise HTTPException(status_code=409, detail="slot already booked")

    # 4) look up or create customer by phone
    customer = cust_col.find_one({"phone": payload.phone})
    if not customer:
        customer_id = cust_col.insert_one(
            {
                "name": payload.name,
                "phone": payload.phone,
                "email": payload.email,
            }
        ).inserted_id
    else:
        customer_id = customer["_id"]

    # 5) insert appointment record
    rec = {
        "service_id": payload.service_id,
        "customer_id": str(customer_id),
        "start_time": payload.start_time,
        "end_time": end_time,
        "status": "scheduled",
    }
    appt_id = appt_col.insert_one(rec).inserted_id
    return {"id": str(appt_id)}


@router.get("")
def list_appointments():
    """Return all appointments (admin use)."""
    return to_str(list(appt_col.find()))


@router.put("/{aid}")
def update_status(aid: str, status: str):
    """Update the status: scheduled → arrived / cancelled / no‑show."""
    ok = appt_col.update_one(
        {"_id": ObjectId(aid)}, {"$set": {"status": status}}
    )
    if ok.matched_count == 0:
        raise HTTPException(404)
    return {"ok": True}


@router.delete("/{aid}")
def delete_appointment(aid: str):
    appt_col.delete_one({"_id": ObjectId(aid)})
    return {"ok": True}
