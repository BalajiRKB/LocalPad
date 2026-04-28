from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from backend.database import get_db
from backend import models

router = APIRouter()


class MemoryCardCreate(BaseModel):
    space_id: int
    title: str
    content: str
    is_active: bool = True


class MemoryCardUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_active: Optional[bool] = None


@router.get("/space/{space_id}")
def list_memory_cards(space_id: int, db: Session = Depends(get_db)):
    return db.query(models.MemoryCard).filter(models.MemoryCard.space_id == space_id).all()


@router.post("/")
def create_memory_card(card: MemoryCardCreate, db: Session = Depends(get_db)):
    db_card = models.MemoryCard(**card.dict())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


@router.patch("/{card_id}")
def update_memory_card(card_id: int, update: MemoryCardUpdate, db: Session = Depends(get_db)):
    card = db.query(models.MemoryCard).filter(models.MemoryCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Memory card not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card


@router.delete("/{card_id}")
def delete_memory_card(card_id: int, db: Session = Depends(get_db)):
    card = db.query(models.MemoryCard).filter(models.MemoryCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Memory card not found")
    db.delete(card)
    db.commit()
    return {"detail": "Memory card deleted"}
