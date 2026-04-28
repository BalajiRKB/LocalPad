from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Message, Conversation
from context_builder import build_context
from ollama_client import chat
from pydantic import BaseModel

router = APIRouter()

class MessageSend(BaseModel):
    conversation_id: int
    content: str

@router.get("/conversation/{conv_id}")
def get_messages(conv_id: int, db: Session = Depends(get_db)):
    return db.query(Message).filter(
        Message.conversation_id == conv_id
    ).order_by(Message.created_at).all()

@router.post("/send")
async def send_message(data: MessageSend, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == data.conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Save user message
    user_msg = Message(conversation_id=conv.id, role="user", content=data.content)
    db.add(user_msg)
    db.commit()

    # Build context from memory cards
    context = build_context(db, conv.space_id)

    # Build messages list for Ollama
    history = db.query(Message).filter(
        Message.conversation_id == conv.id
    ).order_by(Message.created_at).all()

    ollama_messages = []
    if context:
        ollama_messages.append({"role": "system", "content": context})
    for msg in history:
        ollama_messages.append({"role": msg.role, "content": msg.content})

    # Call Ollama
    try:
        reply = await chat(conv.model, ollama_messages)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Ollama error: {str(e)}")

    # Save assistant reply
    assistant_msg = Message(conversation_id=conv.id, role="assistant", content=reply)
    db.add(assistant_msg)

    # Auto-title conversation from first message
    if conv.title == "New Conversation":
        conv.title = data.content[:40] + ("..." if len(data.content) > 40 else "")

    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg
