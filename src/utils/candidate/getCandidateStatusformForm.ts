import type { CandidateStatus } from "../../types/candidates/candidates";
import type { InterviewStatus } from "../../types/interview/interview";

export function getCandidateStatusFromForm(
  currentStatus: InterviewStatus
) : CandidateStatus {
  switch (currentStatus) {
    case "scheduled":
    case "completed":
      return "active";
    case "cancelled":
      return "onhold"
    default:
      throw new Error(`Unsupported Interview status: ${currentStatus}`);
  };
};