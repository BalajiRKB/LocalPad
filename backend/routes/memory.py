from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import MemoryCard
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class MemoryCreate(BaseModel):
    space_id: int
    title: str
    content: str
    is_active: Optional[bool] = True

class MemoryUpdate(BaseModel):
    title: Optional[str]
    content: Optional[str]
    is_active: Optional[bool]

@router.get("/space/{space_id}")
def list_memory(space_id: int, db: Session = Depends(get_db)):
    return db.query(MemoryCard).filter(MemoryCard.space_id == space_id).all()

@router.post("/")
def create_memory(data: MemoryCreate, db: Session = Depends(get_db)):
    card = MemoryCard(**data.dict())
    db.add(card)
    db.commit()
    db.refresh(card)
    return card

@router.patch("/{card_id}")
def update_memory(card_id: int, data: MemoryUpdate, db: Session = Depends(get_db)):
    card = db.query(MemoryCard).filter(MemoryCard.id == card_id).first()
    if card:
        for k, v in data.dict(exclude_unset=True).items():
            setattr(card, k, v)
        db.commit()
        db.refresh(card)
    return card

@router.delete("/{card_id}")
def delete_memory(card_id: int, db: Session = Depends(get_db)):
    card = db.query(MemoryCard).filter(MemoryCard.id == card_id).first()
    if card:
        db.delete(card)
        db.commit()
    return {"ok": True}
