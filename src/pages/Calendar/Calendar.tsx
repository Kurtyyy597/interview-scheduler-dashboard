import {useMemo, useState } from "react";
import FilterInterviewComponent from "../../components/Overall Interview's Component/Filter Interview Component/FilterInterviewComponent";
import type { FilterInterview } from "../../types/interview/filterInterview";
import { initialFilterInterview } from "../../constants/interview/initialFilterInterview";
import type { SortInterview } from "../../types/interview/sortInterview";
import type { InterviewTs } from "../../types/interview/interview";
import type { Interviewer } from "../../types/interviewer/interviewer";
import type { Candidate } from "../../types/candidates/candidates";
import CalendarComponent from "../../components/Overall Calendar Components/Calendar Page/CalendarComponent";
import type { InterviewDetailsProps } from "../../components/Overall Calendar Components/Calendar Page/CalendarComponent";
import { filterInterview } from "../../utils/interviews/filterInterviews";


import {useNavigate } from "react-router-dom";
import { sortInterviews } from "../../utils/interviews/sortInterviews";

type CalendarProps = {
  interviews: InterviewTs[];
  interviewers: Interviewer[];
  candidates: Candidate[]; 
};

export function CalendarPage({
  interviews,
  interviewers,
  candidates
} : CalendarProps) {
  const [filters, setFilters] = useState<FilterInterview>(initialFilterInterview);
  const [sortedBy, setSortedBy] = useState<SortInterview>("date-asc");


  const navigate = useNavigate();

  const clickDetails = (interviewId: InterviewTs["id"]) => {
    navigate(`/interview/view/${interviewId}`);
  };

  const visibleInterviews = useMemo(() => {
    return filterInterview(filters, interviews);
  }, [filters, interviews]);

  const sortedInterviews = useMemo(() => {
    return sortInterviews(sortedBy, visibleInterviews);
  }, [sortedBy, visibleInterviews]);

  const interviewToDisplay: InterviewDetailsProps[] = useMemo(() => {
    return sortedInterviews.map((interview) => {
      const interviewer = interviewers.find((interviewer) => interviewer.id === interview.interviewerId);
      const candidate = candidates.find((candidate) => candidate.id === interview.candidateId);

      const candidateName = [candidate?.firstName, (candidate?.middleName ?? ""), candidate?.lastName]
      .filter(Boolean).join(" ");

      return {
        interviewId: interview.id,
        candidateName: candidateName,
        interviewerName: interviewer?.fullName ?? "",
        date: interview.date,
        startTime: interview.startTime,
        endTime: interview.endTime,
        notes: interview.notes ?? "",
        status: interview.status
      }
    })
  }, [sortedInterviews, candidates, interviewers]);

  
  
  return (
    <div className="calendar-wrapper">
      <FilterInterviewComponent
      filterInterviews={filters}
      setFilterInterviews={setFilters}
      sortedBy={sortedBy}
      setSortedBy={setSortedBy}/>

      <CalendarComponent
      linkTo="/interview/create"
      interviews={interviewToDisplay}
      onClickDetails={clickDetails}/>

    </div>
  )
};
export default CalendarPage;