from fastapi import APIRouter
from openai import OpenAI
from app.core.config import settings
from ...core.tools import *
from ...core.agent import get_agent
from langchain.messages import AIMessage, HumanMessage, ToolMessage

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


@router.post("/{id}/stream")
async def get_run_stream(id):
    task = get_job_info(id) # return agent, model, task info

    agent = get_agent()

    for chunk in agent.stream({
        "messages": [{"role": "user", "content": task }]
        }, stream_mode="updates"):

        if 'tools' in chunk:
            latest_message = chunk['tools']['messages'][-1]
            print(f"TOOL CALL: {latest_message.content}")
        elif 'model' in chunk:
            latest_message = chunk['model']['messages'][-1]
            print(f"AGENT/HUMAN CALL: {latest_message.content}")
        
    return
