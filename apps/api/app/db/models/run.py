from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel


class RunStatus(str, Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class Run(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    scenario_id: str = Field(index=True)
    model: str
    status: RunStatus = Field(default=RunStatus.queued)
    score: Optional[float] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
