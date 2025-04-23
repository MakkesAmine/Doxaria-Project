from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from config.database import connect_db
from datetime import date
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import os 
from jose import jwt, JWTError
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict
from datetime import date, datetime
from fastapi import HTTPException, status, Depends, APIRouter
from bson import ObjectId
router = APIRouter()
db = connect_db().users
# Configuration du JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
blacklisted_tokens_db = connect_db().blacklisted_tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user



# Pydantic model for profile update
class UpdateProfileRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[datetime] = None  # Use datetime for better handling
    bio: Optional[str] = None
    allergies: Optional[List[Dict]] = None
    medical_history: Optional[List[Dict]] = None
    contraindications: Optional[List[str]] = None
    weight: Optional[float] = None  # in kg
    height: Optional[float] = None  # in cm
    current_medications: Optional[List[Dict]] = None
    lab_results: Optional[Dict] = None
    treatment_preferences: Optional[Dict] = None
    emergency_contact: Optional[Dict] = None
    blood_type: Optional[str] = None  # Updated to snake_case
    consent_for_data_processing: Optional[bool] = None


@router.put("/users/profile")
def update_profile(
    update_data: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["_id"]
    
    # Convert to dictionary and exclude unset fields
    update_dict = update_data.dict(exclude_unset=True)
    print("Update dictionary:", update_dict)

    # Convert date fields to datetime
    if "date_of_birth" in update_dict:
        update_dict["date_of_birth"] = datetime.combine(update_dict["date_of_birth"], datetime.min.time())

    # Check if user exists
    current_user_data = db.find_one({"_id": ObjectId(user_id)})
    if not current_user_data:
        raise HTTPException(status_code=404, detail="User not found")

    print("Current user data:", current_user_data)

    # Update in the database
    result = db.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_dict}
    )

    if result.modified_count == 0:
        return {"message": "Profile updated successfully, but no changes were detected.", "user": current_user_data}

    # Retrieve updated user data
    updated_user = db.find_one({"_id": ObjectId(user_id)})
    updated_user["_id"] = str(updated_user["_id"])

    return {"message": "Profile updated successfully", "user": updated_user}