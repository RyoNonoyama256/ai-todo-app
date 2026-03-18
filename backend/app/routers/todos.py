from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter()


@router.get("/", response_model=list[schemas.Todo])
def list_todos(db: Session = Depends(get_db)):
    return db.query(models.Todo).order_by(models.Todo.created_at).all()


@router.post("/", response_model=schemas.Todo, status_code=201)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = models.Todo(text=todo.text)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@router.patch("/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo.text is not None:
        db_todo.text = todo.text
    if todo.completed is not None:
        db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo


@router.delete("/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()


@router.delete("/", status_code=204)
def delete_completed(completed: bool = Query(False), db: Session = Depends(get_db)):
    if completed:
        db.query(models.Todo).filter(models.Todo.completed == True).delete()
        db.commit()
