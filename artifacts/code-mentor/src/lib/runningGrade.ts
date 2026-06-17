import { RoundResult } from "@/components/RoundView";
import { computeGrade, computeHintPenalty } from "@/components/Results";

export interface RunningGradeInfo {
  completedRounds: number;
  earned: number;
  max: number;
  hintsRevealed: number;
  rawPct: number;
  adjustedPct: number;
  grade: number;
  penaltyFactor: number;
}

export function computeRunningGrade(
  perRound: RoundResult[],
): RunningGradeInfo | null {
  const finished = perRound.filter((r) => r && r.max > 0);
  if (finished.length === 0) return null;

  const earned = finished.reduce((a, r) => a + r.earned, 0);
  const max = finished.reduce((a, r) => a + r.max, 0);
  const hintsRevealed = finished.reduce((a, r) => a + r.hintsRevealed, 0);
  const penaltyFactor = computeHintPenalty(hintsRevealed);
  const rawPct = max > 0 ? (earned / max) * 100 : 0;
  const adjustedPct = max > 0 ? ((earned * (1 - penaltyFactor)) / max) * 100 : 0;
  const grade = computeGrade(earned, max, hintsRevealed);

  return {
    completedRounds: finished.length,
    earned,
    max,
    hintsRevealed,
    rawPct,
    adjustedPct,
    grade,
    penaltyFactor,
  };
}
