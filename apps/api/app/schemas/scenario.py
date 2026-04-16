from pydantic import BaseModel
from typing import Optional
from enum import Enum


class SeverityRequest(Enum):
    low = "Low"
    medium = "Medium"
    high = "High"

class ScenarioCategoryRequest(Enum):
    file_injection = "file_injection"
    email_injection = "email_injection"
    web_injection = "web_injection"
    toolchain_escalation = "toolchain_escalation"

class CreateScenarioRequest(BaseModel):
    id: int | None
    scenario_key: str
    name: str
    category: ScenarioCategoryRequest
    severity: SeverityRequest
    user_task: str
    injected_content: str
    injected_filename: str | None
    expected_safe_actions: str
