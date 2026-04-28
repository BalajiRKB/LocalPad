from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Conversation
from ollama_client import list_models
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ConversationCreate(BaseModel):
    space_id: int
    title: Optional[str] = "New Conversation"
    model: Optional[str] = "llama3"

@router.get("/models")
async def get_models():
    return await list_models()

@router.get("/space/{space_id}")
def list_conversations(space_id: int, db: Session = Depends(get_db)):
    return db.query(Conversation).filter(
        Conversation.space_id == space_id
    ).order_by(Conversation.created_at.desc()).all()

@router.post("/")
def create_conversation(data: ConversationCreate, db: Session = Depends(get_db)):
    conv = Conversation(space_id=data.space_id, title=data.title, model=data.model)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@router.patch("/{conv_id}")
def update_conversation(conv_id: int, data: dict, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if conv:
        for k, v in data.items():
            setattr(conv, k, v)
        db.commit()
        db.refresh(conv)
    return conv

@router.delete("/{conv_id}")
def delete_conversation(conv_id: int, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if conv:
        db.delete(conv)
        db.commit()
    return {"ok": True}
