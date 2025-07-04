# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app import schemas, crud
from app.auth import create_access_token, get_current_user, get_db

router = APIRouter()

@router.post("/register", response_model=schemas.UserRead)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user_data)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print("Intentando iniciar sesión con:", form_data.username)
    print("Intentando iniciar sesión con:", form_data.password  )
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    access_token = create_access_token(data={"sub": user.email})
    response = JSONResponse(content={"message": "Login exitoso"})

    # Establecer cookie segura
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=True,  # solo HTTPS en producción
        samesite="lax",  # o "strict" según necesidad
        max_age=60 * 60 * 24,
        path="/",
    )
    return response

@router.get("/me", response_model=schemas.UserRead)
def read_current_user(current_user: schemas.UserRead = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Sesión cerrada"})
    response.delete_cookie("token")
    return response
