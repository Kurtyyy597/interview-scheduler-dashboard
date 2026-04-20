import type { FilterInterview } from "../../../types/interview/filterInterview";
import type { SortInterview } from "../../../types/interview/sortInterview";
import "./FilterInterviewComponent.css"


type FilterInterviewComponentProps = {
  filterInterviews: FilterInterview;
  setFilterInterviews: React.Dispatch<React.SetStateAction<FilterInterview>>;
  sortedBy: SortInterview;
  setSortedBy: React.Dispatch<React.SetStateAction<SortInterview>>;
};

const defaultFilters: FilterInterview = {
  search: "",
  filterType: "all",
  filterStatus: "all",
};

export default function FilterInterviewComponent({
  filterInterviews,
  setFilterInterviews,
  sortedBy,
  setSortedBy,
}: FilterInterviewComponentProps) {
  const filterHandleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFilterInterviews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sortHandleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortedBy(e.target.value as SortInterview);
  };

  const clearFilters = () => {
    setFilterInterviews(defaultFilters);
    setSortedBy("date-asc");
  };

  const hasActiveFilters =
    filterInterviews.search.trim() !== "" ||
    filterInterviews.filterType !== "all" ||
    filterInterviews.filterStatus !== "all";

  return (
    <section className="filter-toolbar">
      <div className="filter-toolbar-header">
        <div>
          <p className="filter-eyebrow">Interview Management</p>
          <h2 className="filter-title">Filter & Sort Interviews</h2>
          <p className="filter-subtitle">
            Search and organize interviews faster.
          </p>
        </div>

        {hasActiveFilters && (
          <button type="button" className="clear-btn" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="filter-toolbar-card">
        <div className="filter-toolbar-grid">
          <div className="filter-search-group">
            <label htmlFor="search" className="filter-label">
              Search
            </label>
            <input
              id="search"
              name="search"
              type="text"
              className="filter-input"
              placeholder="Search interview title..."
              value={filterInterviews.search}
              onChange={filterHandleChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="filterType" className="filter-label">
              Type
            </label>
            <select
              id="filterType"
              name="filterType"
              className="filter-select"
              value={filterInterviews.filterType}
              onChange={filterHandleChange}
            >
              <option value="all">All types</option>
              <option value="hr-screening">HR Screening</option>
              <option value="technical">Technical</option>
              <option value="final">Final</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filterStatus" className="filter-label">
              Status
            </label>
            <select
              id="filterStatus"
              name="filterStatus"
              className="filter-select"
              value={filterInterviews.filterStatus}
              onChange={filterHandleChange}
            >
              <option value="all">All statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortBy" className="filter-label">
              Sort by
            </label>
            <select
              id="sortBy"
              className="filter-select"
              value={sortedBy}
              onChange={sortHandleChange}
            >
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="createdAt-asc">Newest Created</option>
              <option value="createdAt-desc">Oldest Created</option>
              <option value="updatedAt-asc">Newest Updated</option>
              <option value="updatedAt-desc">Oldest Updated</option>
              <option value="date-asc">Nearest Date</option>
              <option value="date-desc">Farthest Date</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
