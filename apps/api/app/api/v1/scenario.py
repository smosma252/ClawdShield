from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db.client import get_session
from app.db.models import Scenario
from app.schemas.scenario import CreateScenarioRequest

router = APIRouter(prefix='/scenarios', tags=['scenarios'])

@router.get("/")
async def get_all_scenarios(session: Session = Depends(get_session)):
    scenarios = session.exec(select(Scenario)).all()
    return scenarios

@router.get("/{id}")
async def get_scenario(id, session: Session = Depends(get_session)):
    scenarios = session.exec(select(Scenario).where(Scenario.id == id)).first()
    return scenarios

@router.post("/")
async def create_scenario(scenario: CreateScenarioRequest, session: Session = Depends(get_session)):
    try:
        session.add(Scenario(
            scenario_key=scenario.scenario_key,
            name=scenario.name,
            category=scenario.category,
            severity=scenario.severity,
            user_task=scenario.user_task,
            injected_content=scenario.injected_content,
            expected_safe_actions=scenario.expected_safe_actions
        ))
        session.commit()
    except Exception as e:
        return {"message": f"Unable to import Scenario: {str(e)}"}
        