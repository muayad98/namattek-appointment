from fastapi import APIRouter, HTTPException
from bson import ObjectId
from dateutil.relativedelta import relativedelta
from ..main import db
from ..schemas import AppointmentIn
from ..utils import to_str

router = APIRouter(prefix="/appointments", tags=["appointments"])
col = db.appointments
services = db.services

# index for fast overlap checks
col.create_index([("start_time", 1), ("service_id", 1)])

@router.post("")
def create_appointment(payload: AppointmentIn):
    svc = services.find_one({"_id": ObjectId(payload.service_id)})
    if not svc:
        raise HTTPException(400, "invalid service_id")

    # compute end_time
    end_time = payload.start_time + relativedelta(minutes=svc["duration_minutes"])

    # check overlap
    clash = col.find_one({
        "service_id": payload.service_id,
        "status": "scheduled",
        "start_time": {"$lt": end_time},
        "end_time": {"$gt": payload.start_time},
    })
    if clash:
        raise HTTPException(409, "slot already booked")

    rec = payload.model_dump()
    rec["end_time"] = end_time
    rec["status"] = "scheduled"
    res = col.insert_one(rec)
    return {"id": str(res.inserted_id)}

@router.get("")
def list_appointments():
    return to_str(list(col.find()))

@router.put("/{aid}")
def update_status(aid: str, status: str):
    ok = col.update_one({"_id": ObjectId(aid)}, {"$set": {"status": status}})
    if ok.matched_count == 0:
        raise HTTPException(404)
    return {"ok": True}

@router.delete("/{aid}")
def delete_appointment(aid: str):
    col.delete_one({"_id": ObjectId(aid)})
    return {"ok": True}
