from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Note
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class NoteCreate(BaseModel):
    space_id: int
    title: Optional[str] = "Untitled"
    content: Optional[str] = ""

class NoteUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]

@router.get("/space/{space_id}")
def list_notes(space_id: int, db: Session = Depends(get_db)):
    return db.query(Note).filter(Note.space_id == space_id).order_by(Note.updated_at.desc()).all()

@router.post("/")
def create_note(data: NoteCreate, db: Session = Depends(get_db)):
    note = Note(space_id=data.space_id, title=data.title, content=data.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.put("/{note_id}")
def update_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note:
        if data.title is not None: note.title = data.title
        if data.content is not None: note.content = data.content
        db.commit()
        db.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if note:
        db.delete(note)
        db.commit()
    return {"ok": True}
