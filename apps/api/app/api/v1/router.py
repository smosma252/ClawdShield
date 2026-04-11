from .runs import router as run_router
from .scenario import router as scenario_router

from fastapi import APIRouter

router = APIRouter(prefix='/api/v1')

router.include_router(run_router)
router.include_router(scenario_router)