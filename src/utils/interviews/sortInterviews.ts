import type {SortInterview } from "../../types/interview/sortInterview";
import type {InterviewTs } from "../../types/interview/interview";

export function sortInterviews(sortedBy: SortInterview, interviews: InterviewTs[]) {
  const sortedInterview = [...interviews];

  sortedInterview.sort((a, b) => {
    if (sortedBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortedBy === "title-desc") return b.title.localeCompare(a.title);
    if (sortedBy === "createdAt-asc") return a.createdAt - b.createdAt;
    if (sortedBy === "createdAt-desc") return b.createdAt - a.createdAt;
    if (sortedBy === "date-asc") return a.date.localeCompare(b.date);
    if (sortedBy === "date-desc") return b.date.localeCompare(a.date);
    if (sortedBy === "updatedAt-asc") return (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
    if (sortedBy === "updatedAt-desc") return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);

    return 0;
  });

  return sortedInterview;
}