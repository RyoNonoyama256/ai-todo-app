from datetime import datetime
from pydantic import BaseModel


class TodoCreate(BaseModel):
    text: str


class TodoUpdate(BaseModel):
    text: str | None = None
    completed: bool | None = None


class Todo(BaseModel):
    id: int
    text: str
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
