from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional
from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class EventStatus(str, Enum):
    success = "success"
    blocked = "blocked"   # stopped by policy middleware
    error = "error"       # tool raised an exception


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    run_id: int = Field(foreign_key="run.id", index=True)
    tool_name: str
    args: Optional[dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    result: Optional[dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    status: EventStatus
    error_message: Optional[str] = None
    policy_rule: Optional[str] = None   # which OPA rule triggered a block, if any
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
