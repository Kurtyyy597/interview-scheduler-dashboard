import type { CandidateStage } from "../../types/candidates/candidates";
import type { InterviewType } from "../../types/interview/interview";


type InterviewStage = Extract<
CandidateStage,
"screening" | "technical" | "final"
>;

const interviewTypetoStageMap: Record<InterviewType, InterviewStage> = {
  "hr-screening": "screening",
  "technical" : "technical",
  "final" : "final"
};

export function getCandidateStagefromForm(
  type: InterviewType
): InterviewStage {
  return interviewTypetoStageMap[type];
}
