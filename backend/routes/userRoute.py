from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from services.userServ import create_user, get_user_by_username, UserCreate, login, createToken
from db import get_db, db_dependency
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from typing import Annotated
from datetime import timedelta
from services.userServ import ALGORITHM, SECRET_KEY
from jose import jwt
from jose.exceptions import JWTError

router = APIRouter()

oathBearer = OAuth2PasswordBearer(tokenUrl = '/')

@router.post("/users/create", status_code=status.HTTP_201_CREATED)
async def create_new_user(user: UserCreate, db: db_dependency):
    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return create_user(db=db, user=user, roleUsr="admin")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def registerUser(user: UserCreate, db: db_dependency):
    user = create_user(db=db, user=user)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = createToken(username=user.username, id=user.id, endDate=timedelta(days=20))

    return {'username': user.username, 'id': user.id, "firstName": user.first_name,
            "lastName": user.last_name, "role": user.role, "email": user.email,
            "token": token}

@router.post("/login", status_code=status.HTTP_201_CREATED)
async def loginUser(formData: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency):
    print("in")
    user = login(username=formData.username, password=formData.password, db=db)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = createToken(username=user.username, id=user.id, endDate=timedelta(days=20))

    playload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = playload.get('sub')
    userId: int = playload.get('id')
    user = get_user_by_username(db=db, username=username)

    return {'username': username, 'id': userId, "firstName": user.first_name,
            "lastName": user.last_name, "role": user.role, "email": user.email,
            "token": token}

async def getLoggedUser(token: Annotated[str, Depends(oathBearer)]):
    try: 
        playload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = playload.get('sub')
        userId: int = playload.get('id')
        if username is None or userId is None:
            raise HTTPException(status_code=400, detail="token required")
        return {'username': username, 'id': userId}
    except JWTError:
        raise HTTPException(status_code=400, detail="token required")

@router.get("/currentUser", status_code=status.HTTP_201_CREATED)
async def getLoggedUserr(token: Annotated[str, Depends(oathBearer)], db: db_dependency):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        username: str = payload.get('sub')
        userId: int = payload.get('id')
        
        if username is None or userId is None:
            raise HTTPException(status_code=400, detail="Token payload is missing required information")

        user = get_user_by_username(db=db, username=username)
        
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            'username': username,
            'id': userId,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'role': user.role,
            'email': user.email
        }
    except JWTError:
        # Handle any other JWT error
        raise HTTPException(status_code=400, detail="Invalid token")
    except Exception as e:
        # Catch any unexpected errors
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
user_dependency = Annotated[dict, Depends(getLoggedUser)]