from pydantic import BaseModel,Field
from datetime import datetime
from typing import Optional
from enum import Enum

class PrescriptionStatus(str, Enum):
    pending = "Pending"
    approved = "Approved"
    rejected = "Rejected"

class Prescription(BaseModel):
    id: Optional[str] = None
    user_name: str
    doctor_name: str
    date: datetime = datetime.now()
    prescription_file: str
    status: PrescriptionStatus.pending