from fastapi import APIRouter

router = APIRouter(prefix='/scenarios', tags=['scenarios'])


@router.get("/")
async def get_all_scenarios():
    '''
    Get all scenarios for attacks
    '''
    pass


@router.get("/{id}")
async def get_scenario(id):
    '''
    Get Scenario based on ID
    '''
    pass

