from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from models.user import User, UserRole
from config.database import connect_db
from passlib.context import CryptContext
from bson import ObjectId  # Pour gérer les IDs MongoDB

router = APIRouter()
db = connect_db().users  # Connexion à la collection "users"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Fonction pour vérifier si un ID est valide
def is_valid_id(user_id: str) -> bool:
    try:
        ObjectId(user_id)
        return True
    except Exception:
        return False

# ✅ Route pour obtenir tous les utilisateurs avec pagination
@router.get("/users", response_model=List[User])
def get_users(skip: int = 0, limit: int = 10):
    users = list(db.find().skip(skip).limit(limit))
    return users

# ✅ Route pour obtenir un utilisateur par ID
@router.get("/users/{user_id}", response_model=User)
def get_user(user_id: str):
    if not is_valid_id(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    user = db.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user)

# ✅ Route pour créer un nouvel utilisateur
@router.post("/users", response_model=User)
def create_user(user: User):
    if db.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user.password = pwd_context.hash(user.password)  # Hashage du mot de passe
    result = db.insert_one(user.dict(exclude={"password"}))  # Exclure le mot de passe lors de l'insertion
    user.id = str(result.inserted_id)  # Ajout de l'ID généré
    return user

# ✅ Route pour mettre à jour un utilisateur
@router.put("/users/{user_id}", response_model=User)
def update_user(user_id: str, user: User):
    if not is_valid_id(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    updated_user = db.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": user.dict(exclude={"password"})},  # Exclure le mot de passe
        return_document=True
    )
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**updated_user)

# ✅ Route pour supprimer un utilisateur
@router.delete("/users/{user_id}")
def delete_user(user_id: str):
    if not is_valid_id(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    result = db.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"detail": "User deleted successfully"}


# @router.get("/profile/{user_id}", response_model=User)
# def get_user_profile(user_id: str):
#     """
#     Retrieve the profile information of a user based on their ID.

#     Parameters:
#     user_id (str): The unique identifier of the user whose profile is to be retrieved.

#     Returns:
#     dict: A dictionary containing the user's profile information formatted according to their role.
#           If the user is a doctor, includes specialty. If the user is insurance, includes insurance symbol.
#           Otherwise, includes basic profile information.
    
#     Raises:
#     HTTPException: If the user is not found, raises a 404 error.
#     """
#     user = db.find_one({"_id": user_id})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     user_instance = User(**user)

#     if user_instance.role == UserRole.doctor:
#         profile_info = {
#             "username": user_instance.username,
#             "full_name": user_instance.full_name,
#             "bio": user_instance.bio,
#             "specialty": user_instance.specialty,
#             "profile_image": user_instance.profile_image,
#         }
#     elif user_instance.role == UserRole.insurance:
#         profile_info = {
#             "username": user_instance.username,
#             "full_name": user_instance.full_name,
#             "bio": user_instance.bio,
#             "insurance_symbol": user_instance.insurance_symbol,
#             "profile_image": user_instance.profile_image,
#         }
#     else:
#         profile_info = {
#             "username": user_instance.username,
#             "full_name": user_instance.full_name,
#             "bio": user_instance.bio,
#             "profile_image": user_instance.profile_image,
#         }

#     return profile_info
@router.get("/profile/{user_id}", response_model=User)
def get_user_profile(user_id: str):
    user = db.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Conversion de l'utilisateur en instance de User
    user_instance = User(**user)

    # Formater la réponse en fonction du rôle
    if user_instance.role == UserRole.doctor:
        profile_info = {
            "username": user_instance.username,
            "full_name": user_instance.full_name,
            "bio": user_instance.bio,
            "specialty": user_instance.specialty,
            "profile_image": user_instance.profile_image,
        }
    elif user_instance.role == UserRole.insurance:
        profile_info = {
            "username": user_instance.username,
            "full_name": user_instance.full_name,
            "bio": user_instance.bio,
            "insurance_symbol": user_instance.insurance_symbol,
            "profile_image": user_instance.profile_image,
        }
    else:
        profile_info = {
            "username": user_instance.username,
            "full_name": user_instance.full_name,
            "bio": user_instance.bio,
            "profile_image": user_instance.profile_image,
        }

    return profile_info