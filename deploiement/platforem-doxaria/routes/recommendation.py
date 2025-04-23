from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

router = APIRouter()

# Charger les données et le modèle
df = pd.read_csv('liste_amm.csv')
df['Caractéristiques'] = df['DCI'] + ' ' + df['Dosage'] + ' ' + df['Forme'] + ' ' + df['Classe']
model_bert = SentenceTransformer("distilbert-base-nli-mean-tokens")
df["bert_embedding"] = list(model_bert.encode(df["Caractéristiques"].tolist(), convert_to_tensor=False))
vectors = np.stack(df["bert_embedding"].values)
similarity_matrix = cosine_similarity(vectors)

class MedicationRequest(BaseModel):
    name: str

@router.post("/recommendations/")
def recommend_medications(request: MedicationRequest):
    return get_recommendations(request.name)

def get_recommendations(nom_medicament):
    try:
        index = df[df["Nom"] == nom_medicament].index[0]
    except IndexError:
        return {"error": "Médicament introuvable"}

    scores = list(enumerate(similarity_matrix[index]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:6]  # Top 5
    indices_medicaments = [i[0] for i in scores]
    return df.iloc[indices_medicaments][["Nom", "DCI", "Dosage", "Classe", "Indications"]].to_dict(orient='records')