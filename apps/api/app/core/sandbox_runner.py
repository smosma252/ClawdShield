import docker

class SandboxRunner():

    def __init__(self, task, injected_files):
        self.task = task
        self.injected_files = injected_files
        self.client = docker.from_env() 

    
    def create_container(self):
        if not self.client.ping():
            raise RuntimeError("Unable to start environment")
        
        # placeholder
        container = self.client.containers.run(
            'alpine', 
            'sleep infinity', 
            detach=True, 
            tmpfs={
                 '/mnt/workspace': ''
            })
        return container
    
     
    def start(self):
        '''
            Starts of docker container with specific initilizations.
            and runs the scenario.
        '''
        return