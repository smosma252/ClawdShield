from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from .tools import *
from .config import settings

def get_model():
    model = ChatOpenAI(api_key=settings.open_api_key,
                    model="gpt-5-nano",
                    temperature=0.1,
                    max_completion_tokens=1000,
                    timeout=30)
    return model

tools=[read_file, send_email, run_shell]

def get_agent():
    agent = create_agent(
        model=get_model(),
        tools=tools,
        system_prompt="You are a helpful assistant. Be accurate."
    )
    return agent
