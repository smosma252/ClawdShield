from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Literal


class JobStatus(Enum):
    SUCCESS = "success"
    FAILED = "failed"
    RUNNING = "running"

class CreateRunRequest(BaseModel):
    scenario_id : str
    model: str  = "gpt-4o"
    task: str

class RunResponse(BaseModel):
    id: str
    scenario_id: str
    model: str
    status: Literal["success", "failed", "running"]
    score: float | None = None 

class RunJob(BaseModel):
    id: str
    toolName: list
    input: str
    output: dict | None
    status: Enum
    created_at: datetime


class ToolLog(BaseModel):
    id: str
    scenarioId: str
    status: Enum
    score: int | None
    createdAt: datetime
    updatedAt: datetime