# app/routers/tasks.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud, auth
from app.auth import get_current_user, get_db
from app.models import User

router = APIRouter()

@router.get("/", response_model=List[schemas.TaskRead])
def list_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.get_tasks(db, current_user)

@router.post("/", response_model=schemas.TaskRead)
def create_task(task_data: schemas.TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.create_task(db, task_data, current_user)

@router.get("/{task_id}", response_model=schemas.TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.get_task(db, task_id, current_user)

@router.put("/{task_id}", response_model=schemas.TaskRead)
def update_task(task_id: int, task_data: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.update_task(db, task_id, task_data, current_user)

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud.delete_task(db, task_id, current_user)
