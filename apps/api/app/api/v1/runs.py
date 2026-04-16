from fastapi import APIRouter, Depends
import json
from sqlmodel import select

from app.schemas.run import CreateRunRequest
from app.core.tools import *
from app.core.agent import get_agent
from app.core.sandbox_runner import SandboxRunner
from app.db.models.run import Run, RunStatus
from app.db.models.scenario import Scenario
from app.db.models.event import Event, EventStatus 
from app.db.client import get_session, Session


router = APIRouter(prefix='/runs', tags=['runs'])


@router.get("/")
async def get_runs():
    ''' 
    Get all run possibly Success/Failed/Running Status.
    list all runs (for the dashboard run history table) 

    '''
    pass

@router.get("/{id}")
async def get_run(id: int):
    '''Get Run obj based on id, get a single run's result + status'''
    pass


@router.post("/")
async def create_run(body: CreateRunRequest, session = Depends(get_session)) -> str:
    '''
        Create new run with details of task, model, etc.
        This creates an entry and return run_id to post to user.
    '''
    run = Run(
        scenario_id=body.scenario_id,
        model=body.model,
        status=RunStatus.queued
    )
    session.add(run)
    session.commit()
    session.refresh(run)
    return json.dump(run)


@router.post("/{id}/stream")
async def get_run_stream(id, session: Session = Depends(get_session)):
    run = session.get(Run, id) # return agent, model, task info
    try:
        scenario = session.exec(select(Scenario).where(
            Scenario.scenario_key == run.scenario_id)).first()
        
        files = {scenario.injected_filename: scenario.injected_content} if scenario.injected_filename else {}
        sandbox = SandboxRunner(task=scenario.user_task, injected_files=files)
        
        container = sandbox.create_container()
        tools = make_tools(container, run.id, session, run.model)
        agent = get_agent(run.model, tools)

        for chunk in agent.stream({
            "messages": [{"role": "user", "content": scenario.user_task }]
            }, stream_mode="updates"):

            if 'tools' in chunk:
                msg = chunk["tools"]["messages"][-1]
                event = Event(
                    run_id=run.id,
                    tool_name=msg.name,
                    result={"content": msg.content},
                    status=EventStatus.success,
                )
                session.add(event)
                session.commit()
                yield f"data: {json.dumps({'type': 'tool', 'content': msg.content})}\n"

            elif 'model' in chunk:
                msg = chunk['model']['messages'][-1]
                yield f"data: {json.dumps({'type': 'agent', 'content': msg.content})}\n"
        run.status = RunStatus.completed

    except Exception as err:
        run.status = RunStatus.failed
        run.error_message = str(err)
        yield f"data: {json.dumps({'type': RunStatus.failed, 'content': str(err)})}\n"
    finally:
        container.stop()
        container.remove()
        session.add(run)
        session.commit()

