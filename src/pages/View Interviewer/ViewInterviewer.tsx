import ViewInterviewerComponent from "../../components/Overall Interviewer/Interviewer Component/View Interviewer/ViewInterviewerComponent";
import type { InterviewTs } from "../../types/interview/interview";
import type { Interviewer } from "../../types/interviewer/interviewer";
import type { Candidate } from "../../types/candidates/candidates";
import { useParams } from "react-router-dom";
import {toast} from 'react-toastify'
import type { InterviewerInterviewViewProps } from "../../components/Overall Interviewer/Interviewer Component/View Interviewer/ViewInterviewerComponent";

type ViewInterviewerPageProps = {
  interviewers: Interviewer[];
  interviews: InterviewTs[];
  candidates: Candidate[];
};

function ViewInterviewerPage({
  interviewers,
  interviews,
  candidates
} : ViewInterviewerPageProps) {
  const {id} = useParams();

  

  const interviewer = interviewers.find((interviewer) => interviewer.id === id);
  if (!interviewer) {
    toast.error("Interviewer not found", {
      toastId: "interviewer-not-found"
    });
    
    return;
  };

   const interviewsId = interviews.find((interview) => interview.interviewerId === interviewer.id);
   if (!interviewsId) {
    toast.error("Interviews not found", {
      toastId: "interview-not-found"
    });
    return;
   } ;

  const interviewToDisplay: InterviewerInterviewViewProps[] = interviews.filter((interview) =>
  interview.interviewerId === interviewer.id).map((interview) => {
    
    const findCandidate = candidates.find((can) => can.id === interview.candidateId);

    const fullName = findCandidate ? `${findCandidate.firstName} ${findCandidate.middleName ?? ""} ${findCandidate.lastName}` .replace(/\s+/g, " ") .trim() : "Unknown Candidate";
      
    return {
      id: interview.id,
      title: interview.title,
      status: interview.status,
      type: interview.type,
      startTime: interview.startTime,
      endTime: interview.endTime,
      candidateFullName: fullName
    }
  });

  
  const candidate = candidates.find((candidate) => candidate.id === interviewsId.candidateId);
  if (!candidate) {
    toast.error("Candidate not found!");
    return;
  };

  return (
    <div className="interviewer-page-wrapper">
      <ViewInterviewerComponent
      interviewer={interviewer}
      interviews={interviewToDisplay}
      pathToLinkSched={`/interview/create`}
      pathToLinkInterviewDetails={`/interview/view/${interviewsId.id}`}/>

    </div>
  )
};
export default ViewInterviewerPage;