from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base
from backend.routes import spaces, conversations, messages, notes, memory

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LocalPad API",
    description="Backend API for LocalPad — local-first AI notebook",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(spaces.router, prefix="/api/spaces", tags=["Spaces"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversations"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(memory.router, prefix="/api/memory", tags=["Memory"])


@app.get("/")
def root():
    return {"status": "LocalPad API running"}
