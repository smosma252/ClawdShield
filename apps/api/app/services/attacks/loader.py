from pathlib import Path
import yaml
from sqlmodel import Session, select

from app.db.models.scenario import Scenario, ScenarioCategory, Severity

SCENARIOS_DIR = Path(__file__).parent / "scenarios"


def load_scenarios(session: Session) -> None:
    """
    Reads all YAML files from the scenarios directory and upserts them into
    the database. Safe to call on every startup — existing scenarios are
    updated in place, new ones are inserted.
    """
    yaml_files = list(SCENARIOS_DIR.glob("*.yaml"))

    if not yaml_files:
        print("No scenario YAML files found.")
        return

    for path in yaml_files:
        with open(path) as f:
            data = yaml.safe_load(f)

        existing = session.exec(
            select(Scenario).where(Scenario.scenario_key == data["scenario_key"])
        ).first()

        if existing:
            existing.name = data["name"]
            existing.category = ScenarioCategory(data["category"])
            existing.severity = Severity(data["severity"])
            existing.user_task = data["user_task"]
            existing.injected_content = data["injected_content"]
            existing.expected_safe_actions = data["expected_safe_actions"]
            session.add(existing)
        else:
            scenario = Scenario(
                scenario_key=data["scenario_key"],
                name=data["name"],
                category=ScenarioCategory(data["category"]),
                severity=Severity(data["severity"]),
                user_task=data["user_task"],
                injected_content=data["injected_content"],
                expected_safe_actions=data["expected_safe_actions"],
            )
            session.add(scenario)

    session.commit()
    print(f"Loaded {len(yaml_files)} scenario(s) from {SCENARIOS_DIR}")
