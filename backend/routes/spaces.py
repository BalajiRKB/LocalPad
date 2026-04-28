from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Space
from pydantic import BaseModel

router = APIRouter()

class SpaceCreate(BaseModel):
    name: str

@router.get("/")
def list_spaces(db: Session = Depends(get_db)):
    return db.query(Space).order_by(Space.created_at).all()

@router.post("/")
def create_space(data: SpaceCreate, db: Session = Depends(get_db)):
    space = Space(name=data.name)
    db.add(space)
    db.commit()
    db.refresh(space)
    return space

@router.delete("/{space_id}")
def delete_space(space_id: int, db: Session = Depends(get_db)):
    space = db.query(Space).filter(Space.id == space_id).first()
    if space:
        db.delete(space)
        db.commit()
    return {"ok": True}
