from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import Session
from fastapi.middleware.cors import CORSMiddleware


from .api.v1.router import router as api_v1_router
from .db.client import create_db_and_tables, engine
from .services.attacks.loader import load_scenarios


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        load_scenarios(session)
    yield

orgins = [
    "http://localhost",
    "http://localhost:5173"
]

app = FastAPI(title="ClawdShield", version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, 
                   orgins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])
app.include_router(api_v1_router)