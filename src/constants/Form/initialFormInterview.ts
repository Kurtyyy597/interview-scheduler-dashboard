import type { FormInterview } from "../../types/interview/formInterview"

export const initialFormInterview: FormInterview = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  type: "hr-screening",
  status: "scheduled",
  notes: "",
  candidateId: "",
  interviewerId: ""
}