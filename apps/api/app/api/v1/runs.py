from fastapi import APIRouter
from openai import OpenAI
from app.core.config import settings
from ...core.tools import *
from ...core.agent import get_agent
from langchain.messages import AIMessage, HumanMessage, ToolMessage

router = APIRouter(prefix='/runs', tags=['runs'])

def get_client() -> OpenAI:
    return OpenAI(api_key=settings.open_api_key)


@router.post("/execute")
async def execute(task):
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
