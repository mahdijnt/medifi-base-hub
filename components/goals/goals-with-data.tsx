"use client";

import { useGoalProgress } from "@/hooks/useGoalProgress";
import { CurrentGoals } from "./current-goals";

export function GoalsWithData() {
  const { goals, loading } = useGoalProgress();

  return <CurrentGoals goals={goals} loading={loading} />;
}
