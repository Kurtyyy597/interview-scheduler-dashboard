import type { Candidate } from "../candidates/candidates";
import type { Interviewer } from "../interviewer/interviewer";

export type InterviewType = 
| "hr-screening"
| "technical"
| "final"

export type InterviewStatus =
| "scheduled"
| "completed"
| "cancelled"

export type InterviewActivity = {
  id: string;
  interviewId: string;
  type: "updated"
  createdAt: number;
  from: string;
  to: string;
  message?: string;
}

export type InterviewTs = {
  id: string;
  candidateId: Candidate["id"];
  interviewerId: Interviewer["id"];
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: InterviewType;
  status: InterviewStatus;
  notes?: string;
  activities?: InterviewActivity[];
  createdAt: number;
  updatedAt: number | null;
};