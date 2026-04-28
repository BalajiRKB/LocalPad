from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import spaces, conversations, messages, notes, memory

Base.metadata.create_all(bind=engine)

app = FastAPI(title="LocalPad API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spaces.router, prefix="/api/spaces", tags=["spaces"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])
app.include_router(memory.router, prefix="/api/memory", tags=["memory"])

@app.get("/")
def root():
    return {"status": "LocalPad API running"}
