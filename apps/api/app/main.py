from contextlib import asynccontextmanager
from fastapi import FastAPI
from .api.v1.router import router as api_v1_router
from .db.client import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="ClawdShield", version="0.1.0", lifespan=lifespan)
app.include_router(api_v1_router)
