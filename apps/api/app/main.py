from fastapi import FastAPI
from .api.v1.router import router as api_v1_router
from dotenv import load_dotenv

load_dotenv(".env")

app = FastAPI(title = 'ClawdSheild', version='0.1.0')
app.include_router(api_v1_router)
