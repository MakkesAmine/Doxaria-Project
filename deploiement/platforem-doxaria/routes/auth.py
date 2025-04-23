

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from config.database import connect_db
from models.user import User
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
import os
from typing import Optional, List
from bson import ObjectId 
from datetime import date

import logging

# Set up logging
logging.basicConfig(level=logging.INFO)


router = APIRouter()
db = connect_db().users  # Connexion à la collection "users"
blacklisted_tokens_db = connect_db().blacklisted_tokens  # Connexion à la collection "blacklisted_tokens"

# Configuration du JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180

# Gestion des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Modèle pour l'authentification en JSON
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Fonction pour créer un token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Vérification du mot de passe hashé
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Hashage du mot de passe
def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register")
def register(user: User):
    # Vérifier si l'email est déjà enregistré
    if db.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hasher le mot de passe avant de l'insérer dans la base de données
    user.password = get_password_hash(user.password)

    # Convertir l'objet User en dictionnaire
    user_dict = user.dict()

    # Définir explicitement les champs optionnels comme null s'ils ne sont pas fournis
    optional_fields = ["bio", "allergies", "emergency_contact", "profile_picture"]
    for field in optional_fields:
        if field not in user_dict or user_dict[field] is None:
            user_dict[field] = None  # Définir explicitement le champ comme null

    # Insérer l'utilisateur dans la base de données
    db.insert_one(user_dict)

    return {"message": "User registered successfully"}

# Route de connexion en JSON
@router.post("/login/json")
def login_json(login_data: LoginRequest):
    user = db.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={
            "sub": user["email"],  # Email de l'utilisateur
            "role": user.get("role", "user"),  # Rôle de l'utilisateur
            "id": str(user["_id"]),  # Ajout de l'ID utilisateur
            "full_name": str(user["full_name"])  # Full name de l'utilisateur
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}

# Route de connexion avec FormData (OAuth2PasswordRequestForm)
@router.post("/login")
def login_form(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.find_one({"email": form_data.username})

    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={
            "sub": user["email"],  # Email de l'utilisateur
            "role": user.get("role", "user"),  # Rôle de l'utilisateur
            "id": str(user["_id"]),  # Ajout de l'ID utilisateur
            "full_name": str(user["full_name"])  # Full name de l'utilisateur
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": access_token, "token_type": "bearer"}

# Route de déconnexion (logout)
@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    try:
        # Décoder le token pour vérifier sa validité
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Ajouter le token à la liste noire
        blacklisted_tokens_db.insert_one({
            "token": token,
            "expires_at": datetime.utcfromtimestamp(payload["exp"])  # Utiliser l'expiration du token
        })

        return {"message": "Successfully logged out"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Fonction pour vérifier si un token est valide
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
    
    # Check if the token is blacklisted
    if blacklisted_tokens_db.find_one({"token": token}):
        raise HTTPException(status_code=401, detail="Token has been blacklisted")
    
    user = db.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return {"user": user, "full_name": user.get("full_name")}  # Return the user object and full name
# Exemple de route protégée
@router.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hello {current_user['user']['email']}, your full name is {current_user['full_name']}."}

class UpdateProfileRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact: Optional[str] = None
    profile_picture: Optional[str] = None
    Blood_Type: Optional[str] = None
    medicaments: Optional[List[str]] = None

@router.put("/profile")
def update_profile(
    update_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Met à jour le profil de l'utilisateur authentifié.
    :param update_data: Dictionnaire contenant les champs à mettre à jour.
    :param current_user: Utilisateur actuellement authentifié (injecté via Depends).
    """
    user_id = current_user["user"]["_id"]
    if not db.find_one({"_id": ObjectId(user_id)}):
        raise HTTPException(status_code=404, detail="User not found")

    # Validation spécifique pour le champ "medicaments"
    if "medicaments" in update_data and not isinstance(update_data["medicaments"], list):
        raise HTTPException(status_code=400, detail="Le champ 'medicaments' doit être une liste.")

    # Mise à jour des champs dans la base de données
    db.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

    # Récupérer les données mises à jour
    updated_user = db.find_one({"_id": ObjectId(user_id)})

    return {"message": "Profile updated successfully", "user": updated_user}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"full_name": current_user['full_name']}