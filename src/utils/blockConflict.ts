import type { InterviewTs } from "../types/interview/interview";

type ConflictArgs = {
  interview: InterviewTs;
  interviewerId: InterviewTs["interviewerId"];
  date: string;
  startTime: string;
  endTime: string;
  excludeInterviewId?: InterviewTs["id"];
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function hasInterviewConflict({
  interview,
  interviewerId,
  date,
  startTime,
  endTime,
  excludeInterviewId,
}: ConflictArgs): boolean {
  if (interview.interviewerId !== interviewerId) return false;
  if (interview.date !== date) return false;
  if (excludeInterviewId && interview.id === excludeInterviewId) return false;
  if (interview.status === "cancelled") return false;

  const newStart = toMinutes(startTime);
  const newEnd = toMinutes(endTime);
  const existingStart = toMinutes(interview.startTime);
  const existingEnd = toMinutes(interview.endTime);

  return newStart < existingEnd && newEnd > existingStart;
}
