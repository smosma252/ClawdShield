from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from sqlmodel import Session
from docker.models.containers import Container

from app.db.models import Event, EventStatus
from app.core.config import settings


def make_tools(container: Container, run_id: int, db: Session, model: str = "gpt-4o-mini"):
    llm = ChatOpenAI(api_key=settings.open_api_key, model=model, temperature=0)
    @tool("run_shell", description="Execute a shell command in the sandbox. Working directory is /mnt/workspace. Use relative paths for files in the workspace.")
    def run_shell(cmd: str) -> str:
        try:
            res = container.exec_run(['sh', '-c', cmd], workdir='/mnt/workspace')
            output = res.output.decode()
            event = Event(
                run_id=run_id,
                tool_name='run_shell',
                args= {'cmd': cmd},
                result={'output': output},
                status=EventStatus.success
            )
            db.add(event)
            db.commit()
        
        except Exception as e:
            event = Event(
                run_id=run_id,
                tool_name='run_shell',
                args= {'cmd': cmd},
                error_message=str(e),
                status=EventStatus.error
            )
            db.add(event)
            db.commit()
            raise 

        return res.output.decode()

    @tool("read_file", description="Read a file from the sandbox workspace." \
    "Use relative paths (e.g. 'report.txt'), not absolute paths.")
    def read_file(path: str) -> str:

        try:
            # Strip known absolute prefixes so the agent can't escape the workdir
            for prefix in ('/mnt/workspace/', '/workspace/'):
                if path.startswith(prefix):
                    path = path[len(prefix):]
                    break
            path = path.lstrip('/')
            res = container.exec_run(['sh', '-c', f'cat {path}'], workdir='/mnt/workspace')
            raw = res.output.decode()
            summary = llm.invoke([HumanMessage(content=f"Summarize the following file contents:\n\n{raw}")]).content
            event = Event(
                run_id=run_id,
                tool_name='read_file',
                args={'path': path},
                result={'output': summary},
                status=EventStatus.success
            )
            db.add(event)
            db.commit()
        except Exception as e:
            event = Event(
                run_id=run_id,
                tool_name='read_file',
                args={'path': path},
                error_message=str(e),
                status=EventStatus.error
            )
            db.add(event)
            db.commit()
            raise

        return summary
    
    @tool("send_email", description="Given a to and body, send email")
    def send_email(to: str, body: str) -> None:
        try: 
            print(f'FROM-> {to} : {body}')
            event = Event(
                run_id=run_id,
                tool_name='send_email',
                args= {'to': to, 'body': body},
                result={'output': 'sent email'},
                status=EventStatus.success
            )
            db.add(event)
            db.commit()

        except Exception as e:
            event = Event(
                run_id=run_id,
                tool_name='send_email',
                args= {'to': to, 'body': body},
                result={'output': 'sent email'},
                error_message=str(e),
                status=EventStatus.error
            )
            db.add(event)
            db.commit()
            raise
    return [run_shell, read_file, send_email]
