from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.database import get_db
from backend import models
from backend.ollama_client import list_models, chat
from backend.context_builder import build_context

router = APIRouter()


class ConversationCreate(BaseModel):
    space_id: int
    model: str = "llama3"
    title: str = "New Conversation"


@router.get("/space/{space_id}")
def list_conversations(space_id: int, db: Session = Depends(get_db)):
    return (
        db.query(models.Conversation)
        .filter(models.Conversation.space_id == space_id)
        .order_by(models.Conversation.created_at.desc())
        .all()
    )


@router.post("/")
def create_conversation(conv: ConversationCreate, db: Session = Depends(get_db)):
    db_conv = models.Conversation(
        space_id=conv.space_id,
        model=conv.model,
        title=conv.title,
    )
    db.add(db_conv)
    db.commit()
    db.refresh(db_conv)
    return db_conv


@router.delete("/{conv_id}")
def delete_conversation(conv_id: int, db: Session = Depends(get_db)):
    conv = db.query(models.Conversation).filter(models.Conversation.id == conv_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(conv)
    db.commit()
    return {"detail": "Conversation deleted"}


@router.get("/models")
async def get_models():
    return await list_models()
