import type { InterviewTs } from "../../types/interview/interview";
import type { FormInterview } from "../../types/interview/formInterview";
import { addActivity } from "./addActivity";


type UpdatedInterviewActivitiesParams = {
  currentInterview: InterviewTs;
  newInterview: FormInterview;
};

export function buildUpdatedInterviewActivities({
  currentInterview,
  newInterview
} : UpdatedInterviewActivitiesParams) {
  const fieldToTrack = [
    {
      label: "title",
      from: currentInterview.title,
      to: newInterview.title,
    },
    {
      label: "date",
      from: currentInterview.date,
      to: newInterview.date,
    },
    {
      label: "startTime",
      from: currentInterview.startTime,
      to: newInterview.startTime
    },
    {
      label: "notes",
      from: currentInterview.notes ?? "",
      to: newInterview.notes ?? "",
    },
    {
      label: "endTime",
      from: currentInterview.endTime,
      to: newInterview.endTime
    },
    {
      label: "type",
      from: currentInterview.type,
      to: newInterview.type
    },
    {
      label: "status",
      from: currentInterview.status,
      to: newInterview.status
    },
    {
      label: "candidateId",
      from: currentInterview.candidateId,
      to: newInterview.candidateId
    },
    {
      label: "interviewerId",
      from: currentInterview.interviewerId,
      to: newInterview.interviewerId,
    },
  ];

  return fieldToTrack.reduce((acc, field) => {
    const oldValue = (field.from).trim() ?? "";
    const newValue = (field.to).trim() ?? "";

    if (oldValue === newValue) return acc;

    return addActivity({
      interviewId: currentInterview.interviewerId,
      activities: currentInterview.activities ?? [],
      type: "updated",
      from: oldValue,
      to: newValue,
      message: `(${field.label}) changed from (${oldValue}) to (${newValue})`,
    })
  }, currentInterview.activities ?? []);
}