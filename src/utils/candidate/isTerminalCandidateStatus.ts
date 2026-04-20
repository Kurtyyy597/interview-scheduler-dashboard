import type { CandidateStatus } from "../../types/candidates/candidates";

export function isTerminalCandidateStatus(
  status: CandidateStatus
) : boolean {
  return status === "rejected" || status === "hired"
};