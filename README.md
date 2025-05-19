# 💊 Doxaria Project

## 🧬 Overview

**Doxaria** is an AI-powered medical support system designed to automate the extraction of handwritten and printed medical data, recommend personalized treatments, and suggest therapeutic alternatives. Built using state-of-the-art deep learning technologies, the platform aims to streamline prescription management and improve healthcare data quality.

This project was developed as part of the Data Science program at **Esprit University** in collaboration with **Doxaria**, a company specializing in AI for handwritten document processing.

---

## 🎯 Objectives

### Business Objectives (BO)
- **BO1**: Extract drug names and dosages from medical prescriptions using fine-tuned OCR (TrOCR).
- **BO2**: Recommend personalized treatments using GPT-2.
- **BO3**: Suggest alternative drugs based on semantic similarity with Sentence-BERT.

---

## 🚀 Key Features

### 📦 BO1: Drug and Dosage Extraction
- **YOLOv8** detects bounding boxes for `medicament` and `dosage`.
- **Fine-tuned TrOCR** extracts printed/handwritten text from cropped regions.
- **Fuzzy matching** corrects OCR output using a predefined medical drug dictionary.

### 🧠 BO2: Personalized Medical Recommendations
- Fine-tuned **GPT-2** model trained on curated datasets (symptoms, drugs, diets, precautions).
- Contextual treatment suggestions generated via API.

### 🔁 BO3: Alternative Drug Recommendation
- Drug metadata embedded using **Sentence-BERT (`all-MiniLM-L6-v2`)**.
- Cosine similarity used to find therapeutically similar drugs with explanation.

---

## 🧪 Technologies Used

| Category        | Technology                        |
|----------------|------------------------------------|
| Frontend        | React                              |
| Backend         | FastAPI, Uvicorn                   |
| Object Detection| YOLOv8 (PyTorch)                   |
| OCR             | TrOCR (Fine-tuned)                 |
| NLP             | GPT-2 (Fine-tuned), Sentence-BERT  |
| Database        | MongoDB                            |
| Annotation      | Roboflow                           |
| Hosting         | HuggingFace Hub, Google Colab      |
| Deployment      | Docker                             |

---

## 🗂 Project Modules

1. **Data Acquisition & Annotation**  
   - Roboflow used to label "medicament" and "dosage" boxes.
   - Medical databases and prescription images sourced from clinics, pharmacies, and open datasets.

2. **Model Training**  
   - YOLOv8 trained for object detection.  
   - TrOCR fine-tuned on cropped image-text pairs.  
   - GPT-2 fine-tuned on input-output symptom/treatment pairs.  
   - Sentence-BERT used for embedding medical metadata.

3. **Deployment Stack**  
   - RESTful backend via FastAPI + Uvicorn.  
   - React frontend with file upload, dashboards, and chatbot.  
   - MongoDB for storing users, prescriptions, and medications.

---

## 📈 Performance Summary

| Component        | Metric                    | Value / Trend           |
|------------------|----------------------------|--------------------------|
| **YOLOv8**       | mAP@50                     | 0.694                    |
| **TrOCR**        | Eval Loss                  | ↓ from 1.2 to < 0.3      |
|                  | Eval Steps/Sec             | ~0.42 – 0.46             |
|                  | Eval Samples/Sec           | ~3.3 – 3.6               |
|                  | Eval Runtime               | ~300 – 325 ms            |
| **GPT-2**        | Recommendation Quality     | High (domain-tuned)     |
| **Sentence-BERT**| Similarity Accuracy        | Top-5 ≈ 0.85 cosine sim  |

### 🧪 TrOCR Training Graphs (W&B)

![TrOCR Loss Curve](./assets/trocr_loss.png)

---

## 🌍 Sustainable Development Goals (SDGs)

- **SDG 3**: Improve patient outcomes through digital health innovation.
- **SDG 9**: Build scalable and intelligent infrastructure using AI.
- **SDG 16**: Ensure secure and regulation-compliant health data handling (GDPR/HIPAA).

---

## 🛠 Setup Instructions

### 📦 Backend
```bash
cd backend/
pip install -r requirements.txt
uvicorn main:app --reload
