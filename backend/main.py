# main.py
# FastAPI app setup: CORS, rate limiting, analytics middleware, and routers.

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from backend.limiter import limiter
from backend.analytics import RequestLoggingMiddleware
from backend.api.search import router as search_router
from backend.api.ask import router as ask_router
from backend.api.orgs import router as orgs_router

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# Parse comma-separated origins from env, with a local-dev fallback.
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",") if o.strip()
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm the embedding model + Chroma at startup so the first request is fast.
    try:
        from backend.services.retriever import warmup
        warmup()
    except Exception as e:
        print(f"[startup] retriever warmup skipped: {e}")  # don't block startup
    yield


app = FastAPI(title="Rights Within Reach API", version="0.1.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Added last so it wraps everything and times the full request.
app.add_middleware(RequestLoggingMiddleware)


@app.get("/health")
def health():
    return {"status": "ok", "version": "0.1.0"}


app.include_router(search_router, prefix="/api")
app.include_router(ask_router, prefix="/api")
app.include_router(orgs_router, prefix="/api")