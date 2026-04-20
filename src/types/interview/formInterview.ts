import type { InterviewType, InterviewStatus } from "./interview";
import type { Interviewer } from "../interviewer/interviewer";
import type { Candidate } from "../candidates/candidates";

export type FormInterview = {
  title: string;
  date: string;
  startTime: string;
  notes?: string;
  endTime: string;
  type: InterviewType;
  status: InterviewStatus;
  candidateId: Candidate["id"];
  interviewerId: Interviewer["id"];
};