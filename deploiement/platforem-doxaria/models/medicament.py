from pydantic import BaseModel
from typing import List, Optional

class Medicament(BaseModel):
    id: Optional[str]  # ID du médicament
    nom: str           # Nom du médicament
    dosage: str        # Dosage du médicament
    forme: str         # Forme du médicament
    classe: str        # Classe du médicament
    laboratoire: str   # Laboratoire fabricant
    duree_de_conservation: int  # Durée de conservation en jours
    indications: List[str]       # Indications pour l'utilisation
    conditionnement_primaire: str # Conditionnement primaire du médicament
    contre_indication: Optional[str]  # Contre-indications (optionnel)
    side_effect: Optional[List[str]] = []  # Effets secondaires (optionnel)
