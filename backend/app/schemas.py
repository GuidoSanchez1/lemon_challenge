# app/schemas.py
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


# -------------------------
# User Schemas
# -------------------------

class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class UserRead(UserBase):

    model_config = ConfigDict(from_attributes=True)

    id: int




# -------------------------
# Task Schemas
# -------------------------


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    completed: Optional[bool]


class TaskRead(TaskBase):

    model_config = ConfigDict(from_attributes=True)

    id: int
    completed: bool
    created_at: datetime
    completed_at: Optional[datetime] = None
    is_deleted: bool
    deleted_at: Optional[datetime] = None
    owner_id: int

