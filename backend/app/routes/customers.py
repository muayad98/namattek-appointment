from fastapi import APIRouter, HTTPException
from bson import ObjectId, regex
from typing import Optional

from ..main import db
from ..utils import to_str
from ..schemas import CustomerIn

router = APIRouter(prefix="/customers", tags=["customers"])
col = db.customers


# ─── CREATE ──────────────────────────────────────────────────────────
@router.post("")
def create_customer(payload: CustomerIn):
    res = col.insert_one(payload.model_dump())
    return {"id": str(res.inserted_id)}


# ─── LIST with scalable search ──────────────────────────────────────
@router.get("")
def list_customers(
        q: Optional[str] = None,
        phone: Optional[str] = None,
        email: Optional[str] = None,
):
    query = {}
    if q:
        regex_q = {"$regex": q, "$options": "i"}
        query = {
            "$or": [
                {"name": regex_q},
                {"phone": regex_q},
                {"email": regex_q},
            ]
        }
    if phone:
        query["phone"] = phone
    if email:
        query["email"] = email

    docs = list(col.find(query))
    return to_str(docs)


# ─── GET ONE ─────────────────────────────────────────────────────────
@router.get("/{cid}")
def get_customer(cid: str):
    doc = col.find_one({"_id": ObjectId(cid)})
    if not doc:
        raise HTTPException(404)
    return to_str(doc)


# ─── UPDATE ──────────────────────────────────────────────────────────
@router.put("/{cid}")
def update_customer(cid: str, payload: CustomerIn):
    ok = col.update_one({"_id": ObjectId(cid)}, {"$set": payload.model_dump()})
    if ok.matched_count == 0:
        raise HTTPException(404)
    return {"ok": True}


# ─── DELETE ──────────────────────────────────────────────────────────
@router.delete("/{cid}")
def delete_customer(cid: str):
    col.delete_one({"_id": ObjectId(cid)})
    return {"ok": True}
