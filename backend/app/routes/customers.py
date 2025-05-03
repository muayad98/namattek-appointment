from fastapi import APIRouter, HTTPException
from bson import ObjectId
from ..main import db
from ..schemas import CustomerIn
from ..utils import to_str

router = APIRouter(prefix="/customers", tags=["customers"])
col = db.customers

@router.post("")
def create_customer(payload: CustomerIn):
    res = col.insert_one(payload.model_dump())
    return {"id": str(res.inserted_id)}

@router.get("")
def list_customers():
    return to_str(list(col.find()))

@router.get("/{cid}")
def get_customer(cid: str):
    doc = col.find_one({"_id": ObjectId(cid)})
    if not doc:
        raise HTTPException(404)
    return to_str(doc)

@router.put("/{cid}")
def update_customer(cid: str, payload: CustomerIn):
    ok = col.update_one({"_id": ObjectId(cid)}, {"$set": payload.model_dump()})
    if ok.matched_count == 0:
        raise HTTPException(404)
    return {"ok": True}

@router.delete("/{cid}")
def delete_customer(cid: str):
    col.delete_one({"_id": ObjectId(cid)})
    return {"ok": True}
