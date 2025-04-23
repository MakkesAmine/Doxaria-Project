# @router.get("/me", response_model=User)
# def read_users_me(token: str = Depends(oauth2_scheme)):
#     payload = decode_token(token)
#     user_email = payload.get("sub")  # Supposons que l'email est stocké dans 'sub'

#     user = db.find_one({"email": user_email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Convertir l'_id de MongoDB en chaîne
#     user["_id"] = str(user["_id"])
    
#     # Créer une instance de User avec les données récupérées
#     user_instance = User(**user)
    
#     return user_instance  # Renvoie l'instance User
