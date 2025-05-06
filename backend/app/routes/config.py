from fastapi import APIRouter
from ..main import db

router = APIRouter(prefix="/config", tags=["config"])
cfg = db.config

# ensure doc exists
cfg.update_one({"_id": "settings"}, {"$setOnInsert": {"accepting": True}}, upsert=True)

@router.get("/accepting")
def get_accepting():
    doc = cfg.find_one({"_id": "settings"})
    return {"accepting": doc["accepting"]}

@router.put("/accepting")
def set_accepting(state: dict):
    accepting = bool(state.get("accepting", True))
    cfg.update_one({"_id": "settings"}, {"$set": {"accepting": accepting}})
    return {"accepting": accepting}
