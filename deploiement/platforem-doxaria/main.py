from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import auth, users, medicament  # Assurez-vous que ces imports sont corrects
import os

app = FastAPI(
    title="Mon API",
    description="Documentation de mon API FastAPI.",
    version="1.0.0"  # Ajout d'une version pour plus de clarté
)

# Configurer CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de votre client
    allow_credentials=True,
    allow_methods=["*"],  # Autoriser toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autoriser tous les en-têtes
)

# Incluez vos routeurs
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(medicament.router, prefix="/drug", tags=["drug"])
app.include_router(medicament.router, prefix="/rec", tags=["recommendation"])


# Endpoint racine
@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenue dans mon API FastAPI"}

# Définir le répertoire de téléchargement
#UPLOAD_DIRECTORY = r"C:\Users\DELL\Desktop\handwritting\platforem-doxaria\uploads"
#os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Exposer le dossier "uploads"
#app.mount("/uploads", StaticFiles(directory=UPLOAD_DIRECTORY), name="uploads")

# Démarrage de l'application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)