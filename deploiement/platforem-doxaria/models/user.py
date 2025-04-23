from enum import Enum
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Dict, List
from datetime import date

class User(BaseModel):
    # id: Optional[str] = Field(default=None, alias="_id")  # MongoDB uses "_id" as the default primary key
    # email: EmailStr
    # password: str  # Consider hashing this for security
    # phone_number: str  # Changed to str to handle phone numbers with special characters
    # full_name: str
    # date_of_birth: Optional[date] = None  # Use date type for dates
    # bio: Optional[str] = None
    # allergies: Optional[str] = None
    # emergency_contact: Optional[str] = None
    # profile_picture: Optional[str] = None
    # Blood_Type: Optional[str] = None
    # medicaments: Optional[list[str]] = None
    id: Optional[str] = Field(default=None, alias="_id")
    email: EmailStr
    password: str  # À hasher avec bcrypt
    phone_number: str
    full_name: str
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None
    allergies: Optional[list[Dict]] = None  # Modifié
    medical_history: Optional[List[Dict]] = None  # Nouveau
    contraindications: Optional[List[str]] = None  # Nouveau
    weight: Optional[float] = None  # Nouveau
    height: Optional[float] = None  # Nouveau
    current_medications: Optional[List[Dict]] = None  # Nouveau
    lab_results: Optional[Dict] = None  # Nouveau
    treatment_preferences: Optional[Dict] = None  # Nouveau
    emergency_contact: Optional[Dict] = None  # Modifié
    Blood_Type: Optional[str] = None
    consent_for_data_processing: bool = False  # Nouveau




    @validator("password")
    def validate_password(cls, value):
        """Valide que le mot de passe respecte certaines règles."""
        if len(value) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères.")
        # Ajoutez d'autres règles de validation si nécessaire
        return value

    @validator("date_of_birth")
    def validate_date_of_birth(cls, value):
        """Valide que la date de naissance est dans le passé."""
        if value and value > date.today():
            raise ValueError("La date de naissance doit être dans le passé.")
        return value

    @validator("bio")
    def validate_bio(cls, value):
        """Valide que la bio ne dépasse pas une certaine longueur."""
        if value and len(value) > 500:
            raise ValueError("La bio ne doit pas dépasser 500 caractères.")
        return value

    class Config:
        orm_mode = True  # Useful if you're using ORMs like SQLAlchemy
        allow_population_by_field_name = True  # Allows populating fields by alias (e.g., "_id")