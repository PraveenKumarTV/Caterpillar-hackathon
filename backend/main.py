from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = joblib.load("/home/praveen/Desktop/Caterpillar hackathon/Time estimation/time-app/backend/construction_time_predictor.pkl")

class TaskInput(BaseModel):
    task_type: str
    crew_size: int
    area_of_work: float
    equipment_type: str
    labour_working_hours: int
    soil_type: str
    temperature: float
    sea_level: float

@app.post("/predict")
def predict_duration(data: TaskInput):
    input_df = pd.DataFrame([data.dict()])
    prediction = model.predict(input_df)[0]
    return {"predicted_duration": round(prediction, 2)}
