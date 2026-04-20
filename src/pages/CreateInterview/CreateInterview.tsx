import "./CreateInterview.css";
import FormInterviewComponent from "../../components/Overall Interview's Component/Form Interview Component/FormInterviewComponent";
import { toast } from "react-toastify";
import type { FormInterview } from "../../types/interview/formInterview";
import { useState } from "react";
import type { InterviewTs } from "../../types/interview/interview";
import { UseDelay } from "../../utils/fakeDelay";
import { useNavigate } from "react-router-dom";
import { initialFormInterview } from "../../constants/Form/initialFormInterview";
import { hasInterviewConflict } from "../../utils/blockConflict";
import type { Candidate } from "../../types/candidates/candidates";
import type { Interviewer } from "../../types/interviewer/interviewer";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getCandidateStagefromForm } from "../../utils/candidate/getCandidateStagefromForm";
import { getCandidateStatusFromForm } from "../../utils/candidate/getCandidateStatusformForm";
import { canScheduleInterview } from "../../utils/candidate/canScheduleInterview";

type CreateInterviewProps = {
  interviews: InterviewTs[];
  setInterview: React.Dispatch<React.SetStateAction<InterviewTs[]>>;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  interviewers: Interviewer[];
};

function CreateInterview({ interviews, setInterview, setCandidates, candidates, interviewers }: CreateInterviewProps) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const navigate = useNavigate();

  const location = useLocation();
  
  const selectedCandidate = location.state?.candidate as Candidate | undefined
  const selectedInterviewer = location.state?.interviewer as Interviewer | undefined;

  const prefilledForm: FormInterview = {
    ...initialFormInterview,
    candidateId: selectedCandidate?.id || "",
    interviewerId: selectedInterviewer?.id || ""
    
  }

  const handleCreate = async (form: FormInterview) => {
   
  const hasConflict = interviews.some((interview) =>
      hasInterviewConflict({
        interview,
        interviewerId: form.interviewerId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
     }),
    );

    if (hasConflict) {
      toast.error(
        <div className="error-conflict-container">
          <p className="conflict-error-text"> Conflict Schedule detected within the same day </p>
          <Link to="/interview" className="go-to-interviews"> View existing interviews </Link>
        </div>
      )
      return;
    };

    if (!form.candidateId) {
      toast.error("Candidate ID Not found");
      return;
    }
    
    if (!form.interviewerId) {
      toast.error("Interviewer ID Not found");
      return;
    };

    const candidateToSchedule = candidates.find((c) => c.id === form.candidateId);

    if (!candidateToSchedule) {
      toast.error("Candidate not found");
      return;
    }
    
    const cannotSchedule = (!canScheduleInterview(candidateToSchedule));

    if (cannotSchedule) {
      toast.error(`This candidate is already ${candidateToSchedule.status}`);
      return;
    };

    const newStage = getCandidateStagefromForm(form.type);
    setCandidates((prev) =>
    prev.map((candidate) =>
    candidate.id === form.candidateId ? {
      ...candidate,
      stage: newStage,
      status: getCandidateStatusFromForm(form.status),
      updatedAt: Date.now()
    } : candidate));

    const newInterview: InterviewTs = {
      ...form,
      id: crypto.randomUUID(),
      type: "hr-screening",
      status: "scheduled",
      createdAt: Date.now(),
      updatedAt: null,
    };
    
    try {
      setIsAdding(true);

  

      await UseDelay(700);

      setInterview((prev) => [...prev, newInterview]);


      toast.success(
        <>
          <p className="success">
            Success <span className="highlight">({newInterview.title})</span>{" "}
            added
          </p>
        </>,
      );
      navigate(`/interview/view/${newInterview.id}`);
    } catch {
      toast.error("Failed to create interview");
    } finally {
      setIsAdding(false);

    }
  };

  return (
    <div className="create-interview-wrapper">
      <FormInterviewComponent
        initialForm={prefilledForm}
        titleLabel="Add Interview"
        buttonSubmitText={isAdding ? "Adding..." : "Confirm"}
        onSubmit={handleCreate}
        navigateTo="/interview"
        modalTitleText="Cancel adding?"
        modalTitleSubText="This will clear all your inputs."
        modalButtonCancelText="Continue"
        modalButtonConfirmText="Confirm"
        candidates={candidates}
        interviewers={interviewers}
        mode="create"
      />
    </div>
  );
}

export default CreateInterview;
