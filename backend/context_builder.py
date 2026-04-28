from sqlalchemy.orm import Session
from models import MemoryCard

def build_context(db: Session, space_id: int) -> str:
    """Fetch all active memory cards for a space and return as system prompt."""
    cards = db.query(MemoryCard).filter(
        MemoryCard.space_id == space_id,
        MemoryCard.is_active == True
    ).all()

    if not cards:
        return ""

    lines = ["You have the following context about this workspace:\n"]
    for card in cards:
        lines.append(f"### {card.title}\n{card.content}\n")

    return "\n".join(lines)
