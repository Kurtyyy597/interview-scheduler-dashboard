import type { InterviewStatus } from "../../types/interview/interview";

const Status_Transitions: Record<InterviewStatus, InterviewStatus[]> = {
  "scheduled": ["completed", "cancelled"],
  "completed": [],
  "cancelled": []
};

export function getAllowedInterviewStatuses(
  currentStatus: InterviewStatus,
) : InterviewStatus[] {
  return Status_Transitions[currentStatus] ?? [];
};