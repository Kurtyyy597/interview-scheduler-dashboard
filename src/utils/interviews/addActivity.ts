import type { InterviewActivity } from "../../types/interview/interview";
import type { InterviewTs } from "../../types/interview/interview";


type AddActivityProps = {
  activities: InterviewActivity[]; 
  interviewId: InterviewTs["id"];
  type: InterviewActivity["type"];
  from: string;
  to: string;
  message?: string;
};

export function addActivity({
  activities,
  interviewId,
  type,
  from,
  to,
  message
} : AddActivityProps) : InterviewActivity[] {
  const newActivity: InterviewActivity = {
    id: crypto.randomUUID(),
    interviewId,
    type,
    from,
    to,
    message,
    createdAt: Date.now()
  };
  return [...(activities ?? []), newActivity];
};