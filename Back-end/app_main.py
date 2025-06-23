from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import tensorflow as tf
import io

# Load model
model = tf.keras.models.load_model("Models/confirmed-potato_disease_model.h5")
class_names = ["Early Blight", "Late Blight", "Healthy"]  # Adjust as per your model

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionResult(BaseModel):
    label: str
    confidence: float

@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.expand_dims(np.array(image) / 255.0, axis=0)

    prediction = model.predict(img_array)[0]
    confidence = float(np.max(prediction)) * 100
    label = class_names[np.argmax(prediction)]

    return {"label": label, "confidence": round(confidence, 2)}
