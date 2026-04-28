import httpx
from typing import AsyncGenerator

OLLAMA_BASE_URL = "http://localhost:11434"


async def list_models() -> list[str]:
    """Fetch all locally available Ollama models."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
        response.raise_for_status()
        data = response.json()
        return [model["name"] for model in data.get("models", [])]


async def chat(model: str, messages: list[dict]) -> str:
    """Send a chat completion request to Ollama."""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={"model": model, "messages": messages, "stream": False},
        )
        response.raise_for_status()
        return response.json()["message"]["content"]
