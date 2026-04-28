from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.database import get_db
from backend import models
from backend.ollama_client import chat
from backend.context_builder import build_context

router = APIRouter()


class MessageSend(BaseModel):
    conversation_id: int
    content: str


@router.get("/{conversation_id}")
def get_messages(conversation_id: int, db: Session = Depends(get_db)):
    conv = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return db.query(models.Message).filter(models.Message.conversation_id == conversation_id).all()


@router.post("/send")
async def send_message(payload: MessageSend, db: Session = Depends(get_db)):
    conv = db.query(models.Conversation).filter(models.Conversation.id == payload.conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Build memory context
    context = build_context(space_id=conv.space_id, db=db)

    # Save user message
    user_msg = models.Message(conversation_id=conv.id, role="user", content=payload.content)
    db.add(user_msg)
    db.commit()

    # Assemble messages for Ollama
    history = db.query(models.Message).filter(models.Message.conversation_id == conv.id).all()
    ollama_messages = []
    if context:
        ollama_messages.append({"role": "system", "content": context})
    for msg in history:
        ollama_messages.append({"role": msg.role, "content": msg.content})

    # Get AI response
    reply = await chat(model=conv.model, messages=ollama_messages)

    # Auto-title conversation from first message
    if len(history) == 1:
        conv.title = payload.content[:60]
        db.commit()

    # Save assistant message
    ai_msg = models.Message(conversation_id=conv.id, role="assistant", content=reply)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg
