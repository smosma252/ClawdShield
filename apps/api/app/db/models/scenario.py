from enum import Enum
from typing import Optional
from sqlmodel import Field, SQLModel


class Severity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class ScenarioCategory(str, Enum):
    file_injection = "file_injection"
    email_injection = "email_injection"
    web_injection = "web_injection"
    toolchain_escalation = "toolchain_escalation"


class Scenario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    scenario_key: str = Field(unique=True, index=True)  # e.g. "file-inject-001"
    name: str
    category: ScenarioCategory
    severity: Severity
    user_task: str                    # the task given to the agent
    injected_content: str             # the malicious payload
    injected_filename: Optional[str] = Field(default=None)  # file to create in sandbox, if any
    expected_safe_actions: str        # comma-separated list e.g. "read_file,send_email"
