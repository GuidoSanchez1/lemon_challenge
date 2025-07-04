# app/crud.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone
from app import models, schemas, auth

# ---------------------
# Usuarios
# ---------------------

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user_data: schemas.UserCreate) -> models.User:
    if get_user_by_email(db, user_data.email):
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    
    hashed_password = auth.get_password_hash(user_data.password)
    db_user = models.User(email=user_data.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not auth.verify_password(password, user.hashed_password):
        return None
    return user

# ---------------------
# Tareas
# ---------------------

def create_task(db: Session, task_data: schemas.TaskCreate, user: models.User):
    task = models.Task(**task_data.model_dump(), owner_id=user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get_tasks(db: Session, user: models.User):
    return (
        db.query(models.Task)
        .filter(models.Task.owner_id == user.id)
        .filter(models.Task.is_deleted == False)
        .all()
    )


def get_task(db: Session, task_id: int, user: models.User):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == user.id).filter(models.Task.is_deleted == False).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada.")
    return task

def update_task(db: Session, task_id: int, task_data: schemas.TaskUpdate, user: models.User):
    task = get_task(db, task_id, user)
    
    for field, value in task_data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)

    if task_data.completed is True and task.completed_at is None:
        task.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, task_id: int, user: models.User):
    task = get_task(db, task_id, user)
    task.is_deleted = True
    task.deleted_at = datetime.now(timezone.utc)
    db.commit()
    return {"ok": True}