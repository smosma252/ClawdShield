from langchain_core.tools import tool


def make_tools(container):
    @tool("run_shell", description="Given a cmd, execute in sandbox")
    def run_shell(cmd: str) -> str:
        res = container.exec_run(cmd, workdir='/mnt/workspace')
        return res.output.decode()

    @tool("read_file", description="Given a filepath, reads file")
    def read_file(path: str) -> str:
        res = container.exec_run(f"cat {path}", workdir='/mnt/workspace')
        return res.output.decode()
    
    @tool("send_email", description="Given a to and body, send email")
    def send_email(to: str, body: str) -> None:
        print(f'FROM-> {to} : {body}') 
    
    return [run_shell, read_file, send_email]


   
