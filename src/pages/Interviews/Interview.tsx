import type { InterviewTs } from "../../types/interview/interview";
import InterviewComponent from "../../components/Overall Interview's Component/Interview Component/InterviewComponent";
import { useNavigate, Link } from "react-router-dom";
import { useState, useMemo} from "react";
import { toast } from "react-toastify";
import CancelModalComponent from "../../components/Delete Modal Component/DeleteModalComponent";
import type { SortInterview } from "../../types/interview/sortInterview";
import type { FilterInterview } from "../../types/interview/filterInterview";
import { initialFilterInterview } from "../../constants/interview/initialFilterInterview";
import { filterInterview } from "../../utils/interviews/filterInterviews";
import { sortInterviews } from "../../utils/interviews/sortInterviews";
import FilterInterviewComponent from "../../components/Overall Interview's Component/Filter Interview Component/FilterInterviewComponent";
import { useDebounce } from "../../utils/useDebounce";
import "./Interview.css";
import type { Candidate } from "../../types/candidates/candidates";
import { getCandidateStagefromForm } from "../../utils/candidate/getCandidateStagefromForm";
import { addActivity } from "../../utils/interviews/addActivity";
import { CalendarCheck } from "lucide-react";
import PaginationComponent from "../../components/Pagination/Pagination";


type InterviewProps = {
  interviews: InterviewTs[];
  setInterview: React.Dispatch<React.SetStateAction<InterviewTs[]>>;
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
};

function InterviewPage({
  interviews,
  setInterview,
  setCandidates,
}: InterviewProps) {
  const navigate = useNavigate();

  const [interviewsToCancel, setInterviewsToCancel] = useState<
    InterviewTs["id"] | null
  >(null);
  const [openCancelModalVisible, setOpenCancelModalVisible] = useState(false);

  const [sortedBy, setSortedBy] = useState<SortInterview>("date-asc");
  const [filters, setFilters] = useState<FilterInterview>(
    initialFilterInterview,
  );
  const [selectedInterviewIds, setSelectedInterviewIds] = useState<string[]>(
    [],
  );

  

  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;



  const debounceSearch = useDebounce(filters.search, 500);

  const visibleInterviews = useMemo(() => {
    return filterInterview(
      {
        ...filters,
        search: debounceSearch,
      },
      interviews,
    );
  }, [filters, interviews, debounceSearch]);

  const sortedInterviews = useMemo(() => {
    return sortInterviews(sortedBy, [...visibleInterviews]);
  }, [sortedBy, visibleInterviews]);

  const selectedInterview =
    interviewsToCancel !== null
      ? interviews.find((i) => i.id === interviewsToCancel)
      : null;

  const viewInterview = (id: InterviewTs["id"]) => {
    navigate(`/interview/view/${id}`);
  };

  const editInterview = (id: InterviewTs["id"]) => {
    navigate(`/interview/edit/${id}`);
  };

  const openCancelModal = (id: InterviewTs["id"]) => {
    setInterviewsToCancel(id);
    setOpenCancelModalVisible(true);
  };

  const cancelModal = () => {
    setInterviewsToCancel(null);
    setOpenCancelModalVisible(false);
  };

  const hasFilters =
    filters.search.trim() !== "" ||
    filters.filterType !== "all" ||
    filters.filterStatus !== "all";

  

  const cancelInterview = (interviewId: InterviewTs["id"]) => {
    const targetInterview = interviews.find(
      (interview) => interview.id === interviewId,
    );

    if (!targetInterview) return;
    if (targetInterview.status !== "scheduled") return;

    const now = Date.now();

    setInterview((prev) =>
      prev.map((interview) => {
        if (interview.id !== interviewId) return interview;

        const newActivity = addActivity({
          activities: interview.activities ?? [],
          interviewId: interview.id,
          type: "updated",
          from: interview.status,
          to: "cancelled",
          message: `from ${interview.status} to cancelled`,
        });

        return {
          ...interview,
          status: "cancelled",
          activities: newActivity,
          updatedAt: now,
        };
      }),
    );

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === targetInterview.candidateId
          ? {
              ...candidate,
              status: "onhold",
              stage: getCandidateStagefromForm(targetInterview.type),
              updatedAt: now,
            }
          : candidate,
      ),
    );

    toast.success("Interview marked as cancelled");
  };

  const markComplete = (interviewId: InterviewTs["id"]) => {
    const targetInterview = interviews.find(
      (interview) => interview.id === interviewId,
    );

    if (!targetInterview) return;
    if (targetInterview.status !== "scheduled") return;

    const now = Date.now();

    setInterview((prev) =>
      prev.map((interview) => {
        if (interview.id !== interviewId) return interview;

        const newActivity = addActivity({
          activities: interview.activities ?? [],
          interviewId: interview.id,
          type: "updated",
          from: interview.status,
          to: "completed",
          message: `from ${interview.status} to completed`,
        });

        return {
          ...interview,
          status: "completed",
          activities: newActivity,
          updatedAt: now,
        };
      }),
    );

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === targetInterview.candidateId
          ? {
              ...candidate,
              status: "active",
              stage: getCandidateStagefromForm(targetInterview.type),
              updatedAt: now,
            }
          : candidate,
      ),
    );

    toast.success("Interview marked as completed");
  };

  const confirmCancel = () => {
    if (interviewsToCancel === null) return;

    cancelInterview(interviewsToCancel);
    setInterviewsToCancel(null);
    setOpenCancelModalVisible(false);
  };

  const toggleSelectInterview = (interviewId: InterviewTs["id"]) => {
    setSelectedInterviewIds((prev) =>
      prev.includes(interviewId)
        ? prev.filter((id) => id !== interviewId)
        : [...prev, interviewId],
    );
  };

  const selectAllInterview = (visibleInterviewIds: InterviewTs["id"][]) => {
    const areAllSelected = visibleInterviewIds.every((interviewId) =>
      selectedInterviewIds.includes(interviewId),
    );

    if (areAllSelected) {
      setSelectedInterviewIds((prev) =>
        prev.filter((selectedId) => !visibleInterviewIds.includes(selectedId)),
      );
    } else {
      setSelectedInterviewIds((prev) => [
        ...new Set([...prev, ...visibleInterviewIds]),
      ]);
    }
  };

  const markSelectedComplete = () => {
    if (selectedInterviewIds.length === 0) return;

    const selectedScheduled = interviews.filter(
      (interview) =>
        selectedInterviewIds.includes(interview.id) &&
        interview.status === "scheduled",
    );

    if (selectedScheduled.length === 0) {
      toast.error("Only scheduled interviews can be marked as completed");
      return;
    }

    const now = Date.now();

    setInterview((prev) =>
      prev.map((interview) => {
        if (
          !selectedInterviewIds.includes(interview.id) ||
          interview.status !== "scheduled"
        ) {
          return interview;
        }

        const newActivity = addActivity({
          activities: interview.activities ?? [],
          interviewId: interview.id,
          type: "updated",
          from: interview.status,
          to: "completed",
          message: `from ${interview.status} to completed`,
        });

        return {
          ...interview,
          activities: newActivity,
          status: "completed",
          updatedAt: now,
        };
      }),
    );

    setCandidates((prev) =>
      prev.map((candidate) => {
        const matchedInterview = selectedScheduled.find(
          (interview) => interview.candidateId === candidate.id,
        );

        return matchedInterview
          ? {
              ...candidate,
              status: "active",
              stage: getCandidateStagefromForm(matchedInterview.type),
              updatedAt: now,
            }
          : candidate;
      }),
    );

    setSelectedInterviewIds([]);
    toast.success("Selected interviews marked as completed");
  };

  const markSelectedCancelled = () => {
    if (selectedInterviewIds.length === 0) return;

    const selectedScheduled = interviews.filter(
      (interview) =>
        selectedInterviewIds.includes(interview.id) &&
        interview.status === "scheduled",
    );

    if (selectedScheduled.length === 0) {
      toast.error("Only scheduled interviews can be marked as cancelled");
      return;
    }

    const now = Date.now();

    setInterview((prev) =>
      prev.map((interview) => {
        if (
          !selectedInterviewIds.includes(interview.id) ||
          interview.status !== "scheduled"
        ) {
          return interview;
        }

        const newActivity = addActivity({
          activities: interview.activities ?? [],
          interviewId: interview.id,
          type: "updated",
          from: interview.status,
          to: "cancelled",
          message: `from ${interview.status} to cancelled`,
        });

        return {
          ...interview,
          status: "cancelled",
          activities: newActivity,
          updatedAt: now,
        };
      }),
    );

    setCandidates((prev) =>
      prev.map((candidate) => {
        const matchedInterview = selectedScheduled.find(
          (interview) => interview.candidateId === candidate.id,
        );

        return matchedInterview
          ? {
              ...candidate,
              status: "onhold",
              stage: getCandidateStagefromForm(matchedInterview.type),
              updatedAt: now,
            }
          : candidate;
      }),
    );

    setSelectedInterviewIds([]);
    toast.success("Selected interviews marked as cancelled");
  };

  const markSelectedScheduled = () => {
    if (selectedInterviewIds.length === 0) return;

    const selectedCancelled = interviews.filter(
      (interview) =>
        selectedInterviewIds.includes(interview.id) &&
        interview.status === "cancelled",
    );

    if (selectedCancelled.length === 0) {
      toast.error("Only cancelled interviews can be marked as scheduled");
      return;
    }

    const now = Date.now();

    setInterview((prev) =>
      prev.map((interview) => {
        if (
          !selectedInterviewIds.includes(interview.id) ||
          interview.status !== "cancelled"
        ) {
          return interview;
        }

        const newActivity = addActivity({
          activities: interview.activities ?? [],
          interviewId: interview.id,
          type: "updated",
          from: interview.status,
          to: "scheduled",
          message: `from ${interview.status} to scheduled`,
        });

        return {
          ...interview,
          activities: newActivity,
          status: "scheduled",
          updatedAt: now,
        };
      }),
    );

    setCandidates((prev) =>
      prev.map((candidate) => {
        const matchedInterview = selectedCancelled.find(
          (interview) => interview.candidateId === candidate.id,
        );

        return matchedInterview
          ? {
              ...candidate,
              status: "active",
              stage: getCandidateStagefromForm(matchedInterview.type),
              updatedAt: now,
            }
          : candidate;
      }),
    );

    setSelectedInterviewIds([]);
    toast.success("Selected interviews marked as scheduled");
  };

  const totalPages = Math.ceil(sortedInterviews.length / itemsPerPage);
  const safeTotalPages = (Math.max(1, totalPages));
  const activePage = Math.min(currentPage, safeTotalPages);

  const paginatedInterviews = useMemo(() => {
    const startIndex = (activePage - 1) * itemsPerPage;
    return sortedInterviews.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedInterviews, activePage]);

  const handleSetSortedBy: React.Dispatch<
  React.SetStateAction<SortInterview>> = (value) => {
    setSortedBy(value);
    setCurrentPage(1);
  }

  const handleResetFilters: React.Dispatch<
  React.SetStateAction<FilterInterview>> = (value) => {
    setFilters(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilterInterview);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > safeTotalPages) return;
    setCurrentPage(page);
  };

  const allVisibleSelected =
    paginatedInterviews.length > 0 &&
    paginatedInterviews.every((interview) =>
      selectedInterviewIds.includes(interview.id),
    );

  

  return (
    <div className="interview-wrapper">
      {selectedInterviewIds.length > 0 && (
        <div className="bulk-actions-container">
          <div className="bulk-actions-card">
            <div className="bulk-actions-info">
              <span className="bulk-actions-count">
                {selectedInterviewIds.length} selected
              </span>
              <span className="bulk-actions-text">
                Apply action to selected interviews
              </span>
            </div>

            <div className="bulk-actions-buttons">
              <button
                type="button"
                className="mark-bulk-cancelled"
                onClick={markSelectedCancelled}
              >
                Mark as Cancelled
              </button>

              <button
                type="button"
                className="mark-bulk-complete"
                onClick={markSelectedComplete}
              >
                Mark as Complete
              </button>

              <button
                type="button"
                className="mark-bulk-scheduled"
                onClick={markSelectedScheduled}
              >
                <CalendarCheck size={16} />
                Mark as Scheduled
              </button>
            </div>
          </div>
        </div>
      )}

      <FilterInterviewComponent
        filterInterviews={filters}
        setFilterInterviews={handleResetFilters}
        sortedBy={sortedBy}
        setSortedBy={handleSetSortedBy}
      />

      {interviews.length === 0 ? (
        <div className="empty-state">
          <span className="error-text">
            No interviews yet. Start by adding one.
          </span>
          <Link to="/interview/create" className="create">
            Create Interview
          </Link>
        </div>
      ) : sortedInterviews.length === 0 ? (
        <div className="empty-state">
          <span className="error-text">
            No interviews matched your current filters.
          </span>

          {hasFilters && (
            <button
              type="button"
              className="create"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <InterviewComponent
          interview={paginatedInterviews}
          viewInterview={viewInterview}
          editInterview={editInterview}
          requestCancelInterview={openCancelModal}
          search={filters.search}
          goToCreateLink="/interview/create"
          allVisibleSelected={allVisibleSelected}
          toggleSelectInterview={toggleSelectInterview}
          selectAllInterview={selectAllInterview}
          cancelInterview={cancelInterview}
          markComplete={markComplete}
          selectedInterviewIds={selectedInterviewIds}
        />
      )}

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <span className="length">
        Showing page {activePage} of {totalPages}
      </span>

      {openCancelModalVisible &&
        selectedInterview &&
        interviewsToCancel !== null && (
          <CancelModalComponent
            interview={selectedInterview}
            title="Cancel Interview"
            subtitle="This interview will remain in history"
            buttonTextCancel="Cancel"
            buttonTextConfirm="Confirm"
            cancelDiscard={cancelModal}
            confirmDiscard={confirmCancel}
          />
        )}
    </div>
  );
}

export default InterviewPage;
