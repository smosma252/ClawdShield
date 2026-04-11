from fastapi import APIRouter

router = APIRouter(prefix='/scenarios', tags=['scenarios'])


@router.get("/")
async def list_scenarios():
    pass

