import type { Candidate } from "../../types/candidates/candidates";
import type { Filter } from "../../types/candidates/filter";

function normalizeText(text: string) {
  return text
  .trim()
  .toLowerCase()
  .replace(/\s+/g, " ");
};

function getSearchableCandidateText(candidate: Candidate) {
  const fullName = [
    candidate.firstName,
    candidate.middleName ?? "",
    candidate.lastName
  ].join(" ");

  return normalizeText([
    fullName,
    candidate.contact.email,
    candidate.contact.phone,
    candidate.stage,
    candidate.status,
    ...(candidate.skills?.join(" ") ?? []),
  ].join(" "));
};

export function filterCandidates(candidates: Candidate[], filters: Filter) {
  const searchInput = normalizeText(filters.search)
  const searchTerms = searchInput ? searchInput.split(" ") : [];

 return candidates.filter((c) => {
  if (filters.stage !== "all" && c.stage !== filters.stage) return false;

  if (filters.status !== "all" && c.status !== filters.status) return false;

  if (!searchTerms.length) {
    return true;
  };

  const searchableTerms = getSearchableCandidateText(c);

  return searchTerms.every((term) => searchableTerms.includes(term));

  
 })
}
