import CandidateTableComponent from "../../components/Overall Candidates/Candidates/CandidateTableComponent";
import "./Candidate.css"
import type { Candidate } from "../../types/candidates/candidates";
import { useNavigate } from "react-router-dom";
import FilterCandidates from "../../components/Overall Candidates/Filter Candidates/FilterCandidatesComponent";
import type { Filter } from "../../types/candidates/filter";
import { initialFilter } from "../../constants/candidates/initialFilterCandidates";
import type { Sort } from "../../types/candidates/sort";
import { useState, useMemo } from "react";
import { filterCandidates } from "../../utils/candidate/filterCandidates";
import { sortCandidates } from "../../utils/candidate/sortCandidates";
import { useDebounce } from "../../utils/useDebounce";


type CandidateProps = {
  candidates: Candidate[];
}

function Candidates({candidates}: CandidateProps) {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filter>(initialFilter);
  const [sortedBy, setSortedBy] = useState<Sort>("name-asc");

  const debounceSearch = useDebounce(filters.search, 500);

  const viewDetails = (candidateId: Candidate["id"]) => {
    navigate(`/view/candidates/${candidateId}`);
  };
  
  const visibleCandidates = useMemo(() => {
    return filterCandidates(candidates, {
      ...filters,
      search: debounceSearch
    });
  }, [candidates, filters, debounceSearch]);

  const sortedCandidates = useMemo(() => {
    return sortCandidates(visibleCandidates, sortedBy);
  }, [visibleCandidates, sortedBy]);

  return (
    <div className="candidate-wrapper">
      <FilterCandidates
      filters={filters}
      setFilters={setFilters}
      sortedBy={sortedBy}
      setSortedBy={setSortedBy}
      />

      <CandidateTableComponent
      candidates={sortedCandidates}
      search={filters.search}
      viewDetails={viewDetails}
      />
    </div>
  )
};
export default Candidates;