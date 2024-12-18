import bcrypt
from sqlalchemy.orm import Session
from models.users import User
from pydantic import BaseModel
from jose import jwt
from jose.exceptions import JWTError
from typing import Optional
from datetime import timedelta, datetime

SECRET_KEY = 'my-secret'
ALGORITHM = 'HS256'

class verifyCredentials(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class Token(BaseModel):
    accessToken: str 
    tokenType: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    role: str

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_user(db: Session, user: UserCreate):
    print("dd ", user)
    hashed_password = hash_password(user.password) 
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def login(db: Session, username: str, password: str):
    user = db.query(User).filter(
        (User.username == username) | (User.email == username)
    ).first()
    if not user:
        return False
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return False
    return user

def createToken(username: str, id: int, endDate: timedelta):
    encode = {'sub': username, 'id': id}
    expires = datetime.utcnow() + endDate
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)