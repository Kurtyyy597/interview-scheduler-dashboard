import type { InterviewType } from "../../types/interview/interview";

const TYPE_TRANSITIONS: Record<InterviewType, InterviewType[]> = {
  "hr-screening": ["technical"],
  "technical": ["final"],
  "final": ["final"]
};

export function getAllowedInterviewType(
  currentType: InterviewType,
): InterviewType[] {
  return TYPE_TRANSITIONS[currentType] ?? [];
}