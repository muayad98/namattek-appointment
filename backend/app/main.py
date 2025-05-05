from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from pymongo import MongoClient

load_dotenv()

# ----- DB connection -----
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URI)
db = client.namattek_booking

# ----- FastAPI app -----
app = FastAPI(title="NamatTech Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

# ✨ IMPORT ROUTERS *AFTER* db & app are ready
from .routes import services, customers, appointments, auth  # noqa: E402

app.include_router(services.router)
app.include_router(customers.router)
app.include_router(appointments.router)
app.include_router(auth.router)
