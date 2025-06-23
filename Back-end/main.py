from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from PIL import Image
import tensorflow as tf
import io

# Define custom_objects for all the augmentation layers used
custom_objects = {
    'RandomFlip': tf.keras.layers.RandomFlip,
    'RandomRotation': tf.keras.layers.RandomRotation,
    'RandomZoom': tf.keras.layers.RandomZoom,
    'RandomHeight': tf.keras.layers.RandomHeight,
    'RandomWidth': tf.keras.layers.RandomWidth,
    'Rescaling': tf.keras.layers.Rescaling,
}

model = tf.keras.models.load_model("Models/potato_pretrain_model.h5", custom_objects=custom_objects, compile=False)

class_names = ["Early Blight", "Late Blight", "Healthy"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # for dev, replace with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionResult(BaseModel):
    label: str
    confidence: float
    description: str
    recommendations: list[str]


descriptions = {
    "Early Blight": {
        "description": "Early Blight causes dark spots with concentric rings on older leaves and can lead to defoliation.",
        "recommendations": [
            "Remove affected leaves.",
            "Use crop rotation to reduce soil-borne spores.",
            "Apply fungicide if necessary.",
            "Avoid overhead irrigation."
        ]
    },
    "Late Blight": {
        "description": "Late Blight results in large brown lesions with pale green halos. It spreads rapidly under moist conditions.",
        "recommendations": [
            "Remove and destroy infected plants.",
            "Use resistant potato varieties.",
            "Apply copper-based fungicides.",
            "Avoid working with wet plants."
        ]
    },
    "Healthy": {
        "description": "This plant appears healthy with no signs of disease or stress.",
        "recommendations": [
            "Continue regular watering and sunlight.",
            "Monitor for pests weekly.",
            "Keep leaves dry to prevent fungal infections.",
            "Maintain healthy soil with compost."
        ]
    }
}


@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.expand_dims(np.array(image), axis=0)

    prediction = model.predict(img_array)[0]
    confidence = float(np.max(prediction)) * 100
    label = class_names[np.argmax(prediction)]

    metadata = descriptions[label]

    return {
        "label": label,
        "confidence": round(confidence, 2),
        "description": metadata["description"],
        "recommendations": metadata["recommendations"]
    }



