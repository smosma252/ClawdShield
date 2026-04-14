import io
import tarfile
import docker


class SandboxRunner():

    def __init__(self, task, injected_files: dict[str, str]):
        self.task = task
        self.injected_files = injected_files  # {filename: content}
        self.client = docker.from_env()

    def create_container(self):
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

    def _write_file(self, container, filename: str, content: str):
        '''Injects a file into /mnt/workspace inside the container.'''
        encoded = content.encode('utf-8')
        buf = io.BytesIO()
        with tarfile.open(fileobj=buf, mode='w') as tar:
            info = tarfile.TarInfo(name=filename)
            info.size = len(encoded)
            tar.addfile(info, io.BytesIO(encoded))
        buf.seek(0)
        ok = container.put_archive('/mnt/workspace', buf)
        if not ok:
            raise RuntimeError(f"Failed to inject file '{filename}' into container")
