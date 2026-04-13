import docker


class SandboxRunner():

    def __init__(self, agent_configs, task, injected_files):
        self.agent_configs = agent_configs
        self.task = task
        self.injected_files = injected_files
        self.client = docker.from_env() 
    
     
    