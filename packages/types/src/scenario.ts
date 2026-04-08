export interface Scenario {
  id: string;
  name: string;
  category: string;
  userTask: string;
  severity: "low" | "medium" | "high";
}