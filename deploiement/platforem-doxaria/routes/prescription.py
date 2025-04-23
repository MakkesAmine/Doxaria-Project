# from fastapi import APIRouter, HTTPException, UploadFile, File, Form
# from fastapi.responses import FileResponse
# from pydantic import BaseModel, Field
# from datetime import datetime
# from typing import List, Optional
# from enum import Enum
# import os
# import uuid
# from bson import ObjectId
# from config.database import connect_db

# router = APIRouter()

# # MongoDB connection
# prescriptions_db = connect_db().prescriptions

# # File storage directory
# UPLOAD_DIRECTORY = r"C:\Users\DELL\Desktop\handwritting\platforem-doxaria\uploads"
# os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# # Enum for prescription status
# class PrescriptionStatus(str, Enum):
#     pending = "Pending"
#     approved = "Approved"
#     rejected = "Rejected"

# # Prescription model
# class Prescription(BaseModel):
#     id: Optional[str] = None
#     user_name: str
#     doctor_name: str
#     prescription_file: str
#     date: datetime = Field(default_factory=datetime.now)
#     status: PrescriptionStatus = PrescriptionStatus.pending
# @router.post("/add/prescription", response_model=Prescription)
# async def create_prescription(
#     user_name: str = Form(...),
#     doctor_name: str = Form(...),
#     prescription_file: UploadFile = File(...)
# ):
#     valid_types = ['image/jpeg', 'image/png', 'application/pdf']
#     if prescription_file.content_type not in valid_types:
#         raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG, and PDF are allowed.")

#     unique_filename = f"{uuid.uuid4()}{os.path.splitext(prescription_file.filename)[1]}"
#     file_location = os.path.join(UPLOAD_DIRECTORY, unique_filename)

#     with open(file_location, "wb") as file_object:
#         file_object.write(await prescription_file.read())

#     # Utiliser l'URL complète pour accéder au fichier
#     image_url = f"http://127.0.0.1:8000/uploads/{unique_filename}"

#     prescription_data = Prescription(
#         user_name=user_name,
#         doctor_name=doctor_name,
#         prescription_file=image_url
#     )

#     result = prescriptions_db.insert_one(prescription_data.dict(exclude={"id"}))
#     prescription_data.id = str(result.inserted_id)

#     return prescription_data
# @router.get("/prescriptions", response_model=List[Prescription])
# async def read_prescriptions():
#     prescriptions = list(prescriptions_db.find())
#     for p in prescriptions:
#         p["id"] = str(p["_id"])
#     return prescriptions

# @router.get("/prescriptions/{prescription_id}", response_model=Prescription)
# async def read_prescription(prescription_id: str):
#     prescription = prescriptions_db.find_one({"_id": ObjectId(prescription_id)})
#     if not prescription:
#         raise HTTPException(status_code=404, detail="Prescription not found")
#     prescription["id"] = str(prescription["_id"])
#     return prescription

# @router.put("/prescriptions/{prescription_id}", response_model=Prescription)
# async def update_prescription(prescription_id: str, status: PrescriptionStatus):
#     result = prescriptions_db.update_one(
#         {"_id": ObjectId(prescription_id)},
#         {"$set": {"status": status.value}}
#     )
#     if result.modified_count == 0:
#         raise HTTPException(status_code=404, detail="Prescription not found")
    
#     updated_prescription = prescriptions_db.find_one({"_id": ObjectId(prescription_id)})
#     updated_prescription["id"] = str(updated_prescription["_id"])
#     return updated_prescription

# @router.delete("/prescriptions/{prescription_id}")
# async def delete_prescription(prescription_id: str):
#     result = prescriptions_db.delete_one({"_id": ObjectId(prescription_id)})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Prescription not found")
#     return {"message": "Prescription deleted successfully"}

# @router.get("/prescriptions/file/{prescription_id}")
# async def get_prescription_file(prescription_id: str):
#     prescription = prescriptions_db.find_one({"_id": ObjectId(prescription_id)})
#     if not prescription:
#         raise HTTPException(status_code=404, detail="Prescription not found")
    
#     file_path = os.path.join(UPLOAD_DIRECTORY, os.path.basename(prescription["prescription_file"]))
#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail="File not found")
    
#     return FileResponse(file_path)



from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from enum import Enum
import os
import uuid
from bson import ObjectId
from config.database import connect_db

router = APIRouter()

# MongoDB connection
prescriptions_db = connect_db().prescriptions
users_db = connect_db().users  # Assurez-vous que vous avez accès à la collection des utilisateurs

# File storage directory
UPLOAD_DIRECTORY = r"C:\Users\DELL\Desktop\handwritting\platforem-doxaria\uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Enum for prescription status
class PrescriptionStatus(str, Enum):
    pending = "Pending"
    approved = "Approved"
    rejected = "Rejected"

# Prescription model
class Prescription(BaseModel):
    id: Optional[str] = None
    user_name: str
    doctor_name: str
    prescription_file: str
    date: datetime = Field(default_factory=datetime.now)
    status: PrescriptionStatus = PrescriptionStatus.pending

@router.post("/add/prescription", response_model=Prescription)
async def create_prescription(
    user_id: str = Form(...),  # Changement ici pour user_id
    doctor_id: str = Form(...),  # Changement ici pour doctor_id
    prescription_file: UploadFile = File(...)
):
    # Vérifiez que le fichier est de type valide
    valid_types = ['image/jpeg', 'image/png', 'application/pdf']
    if prescription_file.content_type not in valid_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG, and PDF are allowed.")

    # Vérifiez si l'utilisateur est un patient
    user = users_db.find_one({"_id": ObjectId(user_id), "role": "patient"})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid user ID or not a patient.")

    # Vérifiez si le médecin est valide
    doctor = users_db.find_one({"_id": ObjectId(doctor_id), "role": "doctor"})
    if not doctor:
        raise HTTPException(status_code=400, detail="Invalid doctor ID or not a doctor.")

    # Enregistrement du fichier
    unique_filename = f"{uuid.uuid4()}{os.path.splitext(prescription_file.filename)[1]}"
    file_location = os.path.join(UPLOAD_DIRECTORY, unique_filename)

    with open(file_location, "wb") as file_object:
        file_object.write(await prescription_file.read())

    # URL pour accéder au fichier
    image_url = f"http://127.0.0.1:8000/uploads/{unique_filename}"

    prescription_data = Prescription(
        user_name=user["username"],  # Utilisation du nom d'utilisateur du patient
        doctor_name=doctor["username"],  # Utilisation du nom d'utilisateur du médecin
        prescription_file=image_url
    )

    result = prescriptions_db.insert_one(prescription_data.dict(exclude={"id"}))
    prescription_data.id = str(result.inserted_id)

    return prescription_data

@router.get("/prescriptions", response_model=List[Prescription])
async def read_prescriptions():
    prescriptions = list(prescriptions_db.find())
    for p in prescriptions:
        p["id"] = str(p["_id"])
    return prescriptions

@router.get("/prescriptions/{prescription_id}", response_model=Prescription)
async def read_prescription(prescription_id: str):
    prescription = prescriptions_db.find_one({"_id": ObjectId(prescription_id)})
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    prescription["id"] = str(prescription["_id"])
    return prescription

@router.put("/prescriptions/{prescription_id}", response_model=Prescription)
async def update_prescription(prescription_id: str, status: PrescriptionStatus):
    result = prescriptions_db.update_one(
        {"_id": ObjectId(prescription_id)},
        {"$set": {"status": status.value}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    updated_prescription = prescriptions_db.find_one({"_id": ObjectId(prescription_id)})
    updated_prescription["id"] = str(updated_prescription["_id"])
    return updated_prescription

@router.delete("/prescriptions/{prescription_id}")
async def delete_prescription(prescription_id: str):
    result = prescriptions_db.delete_one({"_id": ObjectId(prescription_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return {"message": "Prescription deleted successfully"}

@router.get("/prescriptions/file/{prescription_id}")
async def get_prescription_file(prescription_id: str):
    prescription = prescriptions_db.find_one({"_id": ObjectId(prescription_id)})
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    file_path = os.path.join(UPLOAD_DIRECTORY, os.path.basename(prescription["prescription_file"]))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)