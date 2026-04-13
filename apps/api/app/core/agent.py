from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from .tools import *
from .config import settings

def get_model(model:str):
    model = ChatOpenAI(api_key=settings.open_api_key,
                    model=model,
                    temperature=0.1,
                    max_completion_tokens=1000,
                    timeout=30)
    return model

tools=[read_file, send_email, run_shell]

def get_agent(model:str):
    return create_agent(
        model=get_model(model),
        tools=tools,
        system_prompt="You are a helpful assistant. Be accurate."
    )
