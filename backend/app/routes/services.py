from fastapi import APIRouter, HTTPException
from bson import ObjectId
from ..main import db
from ..schemas import ServiceIn
from ..utils import to_str

router = APIRouter(prefix="/services", tags=["services"])
col = db.services

@router.post("")
def create_service(payload: ServiceIn):
    res = col.insert_one(payload.model_dump())
    return {"id": str(res.inserted_id)}

@router.get("")
def list_services():
    return to_str(list(col.find()))

@router.get("/{sid}")
def get_service(sid: str):
    doc = col.find_one({"_id": ObjectId(sid)})
    if not doc:
        raise HTTPException(404)
    return to_str(doc)

@router.put("/{sid}")
def update_service(sid: str, payload: ServiceIn):
    ok = col.update_one({"_id": ObjectId(sid)}, {"$set": payload.model_dump()})
    if ok.matched_count == 0:
        raise HTTPException(404)
    return {"ok": True}

@router.delete("/{sid}")
def delete_service(sid: str):
    col.delete_one({"_id": ObjectId(sid)})
    return {"ok": True}
