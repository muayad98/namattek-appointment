from fastapi import APIRouter, HTTPException
from bson import ObjectId
from dateutil.relativedelta import relativedelta
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from ..main import db
from ..schemas import AppointmentIn
from ..utils import to_str

router = APIRouter(prefix="/appointments", tags=["appointments"])

svc_col = db.services
cust_col = db.customers
appt_col = db.appointments

# index for fast overlap checks
appt_col.create_index([("start_time", 1), ("service_id", 1)], background=True)


# ───────────────────────────── create ──────────────────────────────
@router.post("")
def create_appointment(payload: AppointmentIn):
    service = svc_col.find_one({"_id": ObjectId(payload.service_id)})
    if not service:
        raise HTTPException(400, "invalid service_id")

    end_time = payload.start_time + relativedelta(
        minutes=service["duration_minutes"]
    )

    clash = appt_col.find_one(
        {
            "service_id": payload.service_id,
            "status": "scheduled",
            "start_time": {"$lt": end_time},
            "end_time": {"$gt": payload.start_time},
        }
    )
    if clash:
        raise HTTPException(409, "slot already booked")

    # find or create customer by phone
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

    rec = {
        "service_id": payload.service_id,
        "customer_id": str(customer_id),
        "start_time": payload.start_time,
        "end_time": end_time,
        "status": "scheduled",
    }
    appt_id = appt_col.insert_one(rec).inserted_id
    return {"id": str(appt_id)}


# ───────────────────────────── list ────────────────────────────────
@router.get("")
def list_appointments():
    return to_str(list(appt_col.find()))


# ───────────────────────────── get one ─────────────────────────────
@router.get("/{aid}")
def get_appointment(aid: str):
    doc = appt_col.find_one({"_id": ObjectId(aid)})
    if not doc:
        raise HTTPException(404, "not found")
    return to_str(doc)


# ───────────────────────────── update ──────────────────────────────
class AppointmentUpdate(BaseModel):
    service_id: Optional[str] = None
    customer_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None


@router.put("/{aid}")
def update_appointment(aid: str, payload: AppointmentUpdate):
    update_doc = {
        k: v for k, v in payload.model_dump(exclude_none=True).items()
    }
    if not update_doc:
        raise HTTPException(400, "no fields to update")

    ok = appt_col.update_one({"_id": ObjectId(aid)}, {"$set": update_doc})
    if ok.matched_count == 0:
        raise HTTPException(404, "not found")
    return {"id": aid, **update_doc}


# ───────────────────────────── delete ──────────────────────────────
@router.delete("/{aid}")
def delete_appointment(aid: str):
    appt_col.delete_one({"_id": ObjectId(aid)})
    return {"ok": True}
