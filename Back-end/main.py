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

@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.expand_dims(np.array(image), axis=0)

    prediction = model.predict(img_array)[0]
    print("Raw prediction:", prediction)  # <--- ADD THIS LINE

    confidence = float(np.max(prediction)) * 100
    label = class_names[np.argmax(prediction)]

    return {"label": label, "confidence": round(confidence, 2)}

