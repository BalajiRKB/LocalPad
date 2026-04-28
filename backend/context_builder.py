from sqlalchemy.orm import Session
from backend.models import MemoryCard


def build_context(space_id: int, db: Session) -> str:
    """
    Assembles active memory cards for a given space into
    a context string to prepend before the user's prompt.
    """
    cards = (
        db.query(MemoryCard)
        .filter(
            MemoryCard.space_id == space_id,
            MemoryCard.is_active == True,
        )
        .all()
    )

    if not cards:
        return ""

    lines = ["--- Context from Memory Cards ---"]
    for card in cards:
        lines.append(f"[{card.title}]: {card.content}")
    lines.append("--- End of Context ---")

    return "\n".join(lines)
