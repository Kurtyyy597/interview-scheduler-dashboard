import type { FilterInterview } from "../../types/interview/filterInterview";
import type { InterviewTs } from "../../types/interview/interview";

function normalizeText(text: string): string {
  return text
  .trim()
  .toLowerCase()
  .replace(/\s+/g, " ");
};

function getSearchableInterviews(interviews: InterviewTs) {
  return normalizeText([
    interviews.id,
    interviews.candidateId,
    interviews.interviewerId,
    interviews.title,
    interviews.notes,
  ].join(" "));
};




export function filterInterview(filters: FilterInterview, interviews: InterviewTs[]) {
  const searchInput = normalizeText(filters.search);
  const searchTerms = searchInput ? searchInput.split(" ") : [];

  return interviews.filter((i) => {
    if (filters.filterStatus !== "all" && i.status !== filters.filterStatus) return false;

    if (filters.filterType !== "all" && i.type !== filters.filterType) return false;

    const searchableInputs = getSearchableInterviews(i);

    return searchTerms.every((term) => searchableInputs.includes(term));
  });
};