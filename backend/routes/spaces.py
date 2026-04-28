from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.database import get_db
from backend import models

router = APIRouter()


class SpaceCreate(BaseModel):
    name: str


@router.get("/")
def list_spaces(db: Session = Depends(get_db)):
    return db.query(models.Space).all()


@router.post("/")
def create_space(space: SpaceCreate, db: Session = Depends(get_db)):
    db_space = models.Space(name=space.name)
    db.add(db_space)
    db.commit()
    db.refresh(db_space)
    return db_space


@router.delete("/{space_id}")
def delete_space(space_id: int, db: Session = Depends(get_db)):
    space = db.query(models.Space).filter(models.Space.id == space_id).first()
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")
    db.delete(space)
    db.commit()
    return {"detail": "Space deleted"}
