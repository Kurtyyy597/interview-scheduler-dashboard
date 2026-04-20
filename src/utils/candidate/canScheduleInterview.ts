import type { Candidate } from "../../types/candidates/candidates";

export function canScheduleInterview(
  candidate: Candidate
) : boolean {
  return candidate.status !== "hired" && candidate.status !== "rejected"
};

