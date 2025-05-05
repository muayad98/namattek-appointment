from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import os, jwt

router = APIRouter(prefix="/auth", tags=["auth"])

ADMIN_USER = os.getenv("ADMIN_USER", "admin")
ADMIN_PASS = os.getenv("ADMIN_PASS", "namat2025")
JWT_SECRET = os.getenv("JWT_SECRET", "change-me-later")

@router.post("/login")
def login(data: dict):
    if data.get("username") != ADMIN_USER or data.get("password") != ADMIN_PASS:
        raise HTTPException(401, "invalid credentials")
    token = jwt.encode(
        {"sub": ADMIN_USER, "exp": datetime.utcnow() + timedelta(hours=6)},
        JWT_SECRET,
        algorithm="HS256",
    )
    return {"token": token}
