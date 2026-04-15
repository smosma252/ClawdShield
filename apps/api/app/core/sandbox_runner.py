import shlex
import docker
from docker.models.containers import Container


class SandboxRunner():

    def __init__(self, task, injected_files: dict[str, str]):
        self.task = task
        self.injected_files = injected_files  # {filename: content}
        self.client = docker.from_env()

    def create_container(self) -> Container:
        if not self.client.ping():
            raise RuntimeError("Unable to start environment")

        container = self.client.containers.run(
            'alpine',
            'sleep infinity',
            detach=True,
            tmpfs={'/mnt/workspace': ''}
        )

        for filename, content in self.injected_files.items():
            self._write_file(container, filename, content)

        return container

    def _write_file(self, container: Container, filename: str, content: str):
        '''Injects a file into /mnt/workspace inside the container.'''
        safe_filename = shlex.quote(filename)
        safe_content = shlex.quote(content)
        res = container.exec_run(
            ['sh', '-c', f'printf %s {safe_content} > /mnt/workspace/{safe_filename}'],
            workdir='/mnt/workspace'
        )
        if res.exit_code != 0:
            raise RuntimeError(f"Failed to inject file '{filename}': {res.output.decode()}")
