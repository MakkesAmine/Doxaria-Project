from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel
from config.database import connect_db

router = APIRouter()

# Modèle pour la création (inclut tous les champs)
class Medicament(BaseModel):
    id: Optional[str]
    Nom: str
    Dosage: str
    Forme: str
    Classe: str
    Laboratoire: str
    Duree_de_conservation: int
    Conditionnement_primaire: str
    contre_indication: Optional[str] = None
    side_effect: Optional[List[str]] = None
    Indications: Optional[List[str]] = None

# Modèle pour la réponse (exclut Side_effect et Indications)
class MedicamentResponse(BaseModel):
    id: Optional[str]
    Nom: str
    Dosage: str
    Forme: str
    Classe: str
    Laboratoire: str
    Duree_de_conservation: int
    Conditionnement_primaire: str
    contre_indication: Optional[str] = None
    side_effect: Optional[List[str]] = None
    Indications: Optional[List[str]] = None

db = connect_db().medications

@router.post("/medicaments/", response_model=MedicamentResponse, status_code=201)
def create_medicament(medicament: Medicament):
    medicament_dict = medicament.dict(exclude_unset=True)
    result = db.insert_one(medicament_dict)
    medicament.id = str(result.inserted_id)
    return medicament.dict(exclude={"Side_effect", "Indications"})

@router.get("/medicaments/", response_model=List[MedicamentResponse])
def get_medicaments():
    medicaments = list(db.find())
    return [
        {
            "id": str(med["_id"]),
            "Nom": med.get("Nom"),
            "Dosage": med.get("Dosage"),
            "Forme": med.get("Forme"),
            "Classe": med.get("Classe"),
            "Laboratoire": med.get("Laboratoire"),
            "Duree_de_conservation": med.get("Duree_de_conservation"),
            "Conditionnement_primaire": med.get("Conditionnement_primaire"),
            "contre_indication": med.get("contre_indication"),
            "side_effect": med.get("side_effect"),
            "Indications": med.get("Indications")
        }
        for med in medicaments
    ]