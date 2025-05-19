# Doxaria Project

## Overview

**Doxaria** is an AI-powered medical support tool designed to enhance the management of medical data by integrating cutting-edge technologies in computer vision, natural language processing (NLP), and recommendation systems. The platform extracts drug names and dosages from medical documents, generates contextual treatment recommendations, and suggests therapeutic alternatives. Delivered through a user-friendly web application, Doxaria empowers healthcare professionals and caregivers with intelligent, real-time insights.

---

## Purpose

The core mission of Doxaria is to **streamline the digitalization of medical processes** through:

- **Accurate drug information extraction** from medication packaging images.
- **Contextual treatment recommendations** generated via a fine-tuned GPT-2 model.
- **Alternative drug suggestions** based on semantic similarity using Sentence-BERT embeddings.
- A **scalable, web-based application** built with React and FastAPI, underpinned by MongoDB for data persistence.

---

## Key Features

- **🧠 Object Detection**: Locates medication boxes and dosage indicators from uploaded images using a PyTorch-based model.
- **🔍 OCR Pipeline**: Extracts and corrects text from identified image regions using transformer-based models.
- **🤖 Recommendation System**:
  - Contextual insights via GPT-2.
  - Semantic drug alternatives via Sentence-BERT (`all-MiniLM-L6-v2`).
- **🌐 Web Interface**: React frontend for uploading images, displaying results, receiving recommendations, and managing prescriptions.
- **🚀 Backend Infrastructure**: FastAPI server with RESTful API endpoints for AI inference and data operations.
- **🗃️ Database**: MongoDB for managing users, medications, and prescriptions.

---

## Technologies Used

| Component        | Technology                          |
|------------------|--------------------------------------|
| **Frontend**     | React                                |
| **Backend**      | FastAPI, Uvicorn                     |
| **Object Detection** | PyTorch                            |
| **OCR**          | Transformer-based models             |
| **NLP**          | GPT-2, Sentence-BERT (`all-MiniLM-L6-v2`) |
| **Database**     | MongoDB                              |
| **Tools**        | HuggingFace Transformers, Roboflow   |

---

## Project Structure

1. **Chapter 1: General Project Context**  
   - Introduction to host organization, project background, and problem definition.

2. **Chapter 2: Business Understanding**  
   - Stakeholder analysis, business and data science objectives, SDG alignment.

3. **Chapter 3: Data Acquisition & Understanding**  
   - Data sourcing, image preprocessing, annotation (Roboflow), and conversion.

4. **Chapter 4: Modeling**  
   - Object detection model (mAP@50: **0.694**), OCR pipeline, GPT-2 integration, and a custom `DrugRecommender` using Sentence-BERT.

5. **Chapter 5: Deployment**  
   - Architecture overview including:
     - Frontend (React)
     - Backend (FastAPI)
     - AI model endpoints
     - MongoDB integration

---

## API Endpoints

### Core AI Functionality

| Endpoint           | Functionality                                 |
|--------------------|-----------------------------------------------|
| `POST /detect`     | Detects medication boxes in images            |
| `POST /ocr`        | Extracts dosage text from detected areas      |
| `POST /recommend`  | Generates contextual treatment recommendations |
| `POST /alternatives` | Suggests semantically similar drug options |
| `POST /chat`       | Chatbot for general medical queries           |

### Medical Data Management

| Endpoint                      | Functionality                        |
|-------------------------------|--------------------------------------|
| `POST /medicaments/`          | Add new medication data              |
| `GET /medicaments/`           | Retrieve all medications             |
| `POST /add/prescription`      | Add a prescription record            |
| `GET /prescriptions`          | Retrieve all prescription records    |

### User Management

| Endpoint                        | Functionality                     |
|---------------------------------|-----------------------------------|
| `POST /users/`                  | Create a new user account         |
| `GET /users/{user_id}`          | Get user details                  |
| `PUT /users/{user_id}`          | Update user information           |

---

## Performance

- **Object Detection**: Achieves a mean Average Precision (mAP@50) of **0.694**.
- **Recommendation System**: Accurately identifies similar drugs using **cosine similarity** on normalized Sentence-BERT embeddings.
- **Stability**: Robust under test conditions; can benefit from expanded training data and further inference optimization.

---

## Future Directions

- Integrate models into a fully interactive, production-ready application.
- Conduct field testing with medical professionals to validate real-world effectiveness.
- Expand and diversify training datasets to improve generalization and accuracy.

---

## Keywords

`Medical Support Tool` · `AI in Healthcare` · `Object Detection` · `OCR` · `NLP` · `Recommendation System` · `Sentence-BERT` · `GPT-2` · `FastAPI` · `React` · `MongoDB` · `Drug Extraction` · `Cosine Similarity` · `HuggingFace` · `PyTorch` · `Roboflow` · `Digital Health` · `Prescription Management`

---

## Conclusion

**Doxaria** represents a significant step toward smarter, AI-driven healthcare solutions. By combining robust deep learning models with an accessible web platform, this tool empowers healthcare professionals with enhanced data processing, precision, and efficiency in prescription management.
