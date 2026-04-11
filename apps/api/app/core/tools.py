from langchain_core.tools import tool
import subprocess
import os

@tool("read_file", description="Given a filepath, reads file")
def read_file(path: str):
    path = os.getcwd() + "\\" + path
    with open(path) as f:
        return f.read()

@tool("run_shell", description="Given a cmd, execute cmd")
def run_shell(cmd: str):
    return subprocess.check_output(cmd, shell=True, text=True)

@tool("send_email", description="Given a to and body, send email")
def send_email(to: str, body: str):
    print(f'FROM-> {to} : {body}')
    return 
