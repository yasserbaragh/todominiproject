from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
import db
from db import engine, SessionLocal
from sqlalchemy.orm import Session
from routes.userRoute import router as user_router
from routes.taskRoute import router as task_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

db.Base.metadata.create_all(bind=db.engine)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(task_router)