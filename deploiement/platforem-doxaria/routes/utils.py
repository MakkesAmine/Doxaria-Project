# utils.py
from bson import ObjectId

def is_valid_id(user_id: str) -> bool:
    try:
        ObjectId(user_id)
        return True
    except Exception:
        return False
    








# @router.put("/profile")
# def update_profile(
#     update_data: UpdateProfileRequest,
#     current_user: dict = Depends(get_current_user)
# ):
#     user_id = current_user["_id"]
    
#     # Convert to dictionary and exclude unset fields
#     update_dict = update_data.dict(exclude_unset=True, exclude_none=True)
#     print("Update dictionary:", update_dict)  # Log the updates

#     # Handle date conversion
#     if "date_of_birth" in update_dict:
#         update_dict["date_of_birth"] = datetime.combine(
#             update_dict["date_of_birth"], 
#             datetime.min.time()
#         )

#     # Calculate BMI if weight and height are provided
#     if "weight" in update_dict and "height" in update_dict and update_dict["height"] > 0:
#         update_dict["bmi"] = update_dict["weight"] / ((update_dict["height"] / 100) ** 2)

#     # Check if user exists
#     if not db.find_one({"_id": ObjectId(user_id)}):
#         raise HTTPException(status_code=404, detail="User not found")

#     # Update the user profile
#     try:
#         result = db.update_one(
#             {"_id": ObjectId(user_id)},
#             {"$set": update_dict}
#         )
#         print("Update result:", result)  # Log the result

#         if result.modified_count == 0:
#             raise HTTPException(status_code=304, detail="No changes were made")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

#     # Retrieve updated user data
#     updated_user = db.find_one({"_id": ObjectId(user_id)}, projection={"password": 0})
#     updated_user["_id"] = str(updated_user["_id"])

#     # Ensure medical fields are formatted correctly
#     medical_fields = [
#         'allergies', 'medical_history', 'contraindications',
#         'current_medications', 'lab_results'
#     ]
#     for field in medical_fields:
#         if field in updated_user and updated_user[field] is None:
#             updated_user[field] = []

#     return {
#         "message": "Profile updated successfully",
#         "user": updated_user
#     }






# # Modèle Pydantic pour la mise à jour
# class UpdateProfileRequest(BaseModel):
#     email: Optional[EmailStr] = None
#     phone_number: Optional[str] = None
#     full_name: Optional[str] = None
#     date_of_birth: Optional[date] = None
#     bio: Optional[str] = None
#     allergies: Optional[str] = None
#     emergency_contact: Optional[str] = None
#     profile_picture: Optional[str] = None
#     Blood_Type: Optional[str] = None
#     medicaments: Optional[List[str]] = None
