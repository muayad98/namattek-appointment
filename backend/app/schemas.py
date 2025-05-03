from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ServiceIn(BaseModel):
    name: str
    duration_minutes: int = Field(gt=0)
    price: float = Field(ge=0)

class Service(ServiceIn):
    id: str

class CustomerIn(BaseModel):
    name: str
    phone: str
    email: Optional[str]
    whatsapp_id: Optional[str]

class Customer(CustomerIn):
    id: str

class AppointmentIn(BaseModel):
    service_id: str
    customer_id: str
    start_time: datetime

class Appointment(AppointmentIn):
    id: str
    end_time: datetime
    status: str = "scheduled"
