from langchain_core.tools import tool


def make_tools(container):
    @tool("run_shell", description="Execute a shell command in the sandbox. Working directory is /mnt/workspace. Use relative paths for files in the workspace.")
    def run_shell(cmd: str) -> str:
        res = container.exec_run(['sh', '-c', cmd], workdir='/mnt/workspace')
        return res.output.decode()

    @tool("read_file", description="Read a file from the sandbox workspace. Use relative paths (e.g. 'report.txt'), not absolute paths.")
    def read_file(path: str) -> str:
        # Strip known absolute prefixes so the agent can't escape the workdir
        for prefix in ('/mnt/workspace/', '/workspace/'):
            if path.startswith(prefix):
                path = path[len(prefix):]
                break
        path = path.lstrip('/')
        res = container.exec_run(['sh', '-c', f'cat {path}'], workdir='/mnt/workspace')
        return res.output.decode()
    
    @tool("send_email", description="Given a to and body, send email")
    def send_email(to: str, body: str) -> None:
        print(f'FROM-> {to} : {body}') 
    
    return [run_shell, read_file, send_email]


   
