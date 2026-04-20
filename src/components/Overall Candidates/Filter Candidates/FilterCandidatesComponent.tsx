import type { Filter } from "../../../types/candidates/filter";
import type { Sort } from "../../../types/candidates/sort";
import "./FilterCandidateComponent.css"

type FilterProps = {
  filters: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
  sortedBy: Sort;
  setSortedBy: React.Dispatch<React.SetStateAction<Sort>>;
};

export default function FilterCandidates({
  filters,
  setFilters,
  sortedBy,
  setSortedBy,
}: FilterProps) {
  const filterHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sortedOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortedBy(e.target.value as Sort);
  };

  return (
    <div className="filter-container">
      <div className="filter-card">
        <div className="filter-group">
          <label className="label" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            name="search"
            className="input"
            value={filters.search}
            placeholder="Search name, email, phone, skill..."
            onChange={filterHandleChange}
          />
        </div>

        <div className="filter-group">
          <label className="label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="select"
            value={filters.status}
            onChange={filterHandleChange}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="onhold">On Hold</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="label" htmlFor="stage">
            Stage
          </label>
          <select
            id="stage"
            name="stage"
            className="select"
            value={filters.stage}
            onChange={filterHandleChange}
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied</option>
            <option value="screening">Screening</option>
            <option value="technical">Technical</option>
            <option value="final">Final</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="label" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            className="select"
            value={sortedBy}
            onChange={sortedOnChange}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="appliedAt-asc">Newest Applied</option>
            <option value="appliedAt-desc">Oldest Applied</option>
            <option value="updatedAt-asc">Newest Updated</option>
            <option value="updatedAt-desc">Oldest Updated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
