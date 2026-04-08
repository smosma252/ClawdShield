export type RunStatus = "queued" | "running" | "completed" | "failed";

export interface ToolLog {
  id: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  status: "success" | "error" | "blocked";
  createdAt: string;
}

export interface Run {
  id: string;
  scenarioId: string;
  status: RunStatus;
  score: number | null;
  createdAt: string;
  updatedAt: string;
}