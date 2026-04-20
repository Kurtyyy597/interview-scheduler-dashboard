import type { Candidate } from "../../types/candidates/candidates";
import type { Sort } from "../../types/candidates/sort";

export function sortCandidates(candidates: Candidate[], sort: Sort) {
  const candidate = [...candidates];
  
  candidates.sort((a, b) => {
    const afullName = `${a.lastName} ${a.firstName} ${a.middleName ?? ""}`
    const bFullName = `${b.lastName} ${b.firstName} ${b.middleName ?? ""}`

    if (sort === "name-asc") return afullName.localeCompare(bFullName);
    if (sort === "name-desc") return bFullName.localeCompare(afullName);
    
    if (sort === "appliedAt-asc") return a.appliedAt - b.appliedAt;
    if (sort === "appliedAt-desc") return b.appliedAt - a.appliedAt;

    if (sort === "updatedAt-asc") return (a.updatedAt ?? 0) - (b.updatedAt ?? 0);
    if (sort === "updatedAt-desc") return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);

    return 0
  });

  return candidate;
}