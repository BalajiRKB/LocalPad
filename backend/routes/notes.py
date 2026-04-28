from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from backend.database import get_db
from backend import models

router = APIRouter()


class NoteCreate(BaseModel):
    space_id: int
    title: str
    content: str = ""


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


@router.get("/space/{space_id}")
def list_notes(space_id: int, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Note).filter(models.Note.space_id == space_id)
    if search:
        query = query.filter(
            models.Note.title.ilike(f"%{search}%") | models.Note.content.ilike(f"%{search}%")
        )
    return query.order_by(models.Note.updated_at.desc()).all()


@router.post("/")
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Note(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@router.patch("/{note_id}")
def update_note(note_id: int, update: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if update.title is not None:
        note.title = update.title
    if update.content is not None:
        note.content = update.content
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"detail": "Note deleted"}
