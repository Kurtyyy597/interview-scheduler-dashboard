import { useParams, useNavigate } from "react-router-dom";
import type { FormInterview } from "../../types/interview/formInterview";
import type { InterviewStatus, InterviewTs, InterviewType} from "../../types/interview/interview";
import {useState} from 'react';
import {toast} from 'react-toastify'
import { UseDelay } from "../../utils/fakeDelay";
import FormInterviewComponent from "../../components/Overall Interview's Component/Form Interview Component/FormInterviewComponent";
import "./EditInterview.css"
import { hasInterviewConflict } from "../../utils/blockConflict";
import type { Candidate } from "../../types/candidates/candidates";
import type { Interviewer } from "../../types/interviewer/interviewer";
import { getCandidateStatusFromForm } from "../../utils/candidate/getCandidateStatusformForm";
import { getCandidateStagefromForm } from "../../utils/candidate/getCandidateStagefromForm";
import { getAllowedInterviewType } from "../../utils/interviews/getAllowedInterviewOptions";
import { getAllowedInterviewStatuses } from "../../utils/interviews/getAllowedInterviewStatusOptions";
import { buildUpdatedInterviewActivities } from "../../utils/interviews/buildUpdatedInterviewActivities";



type EditInterviewProps = {
  interviews: InterviewTs[];
  setInterviews: React.Dispatch<React.SetStateAction<InterviewTs[]>>;
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  interviewers: Interviewer[];

}

function EditInterview({interviews, setInterviews, candidates, setCandidates,  interviewers }: EditInterviewProps) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  

  const navigate = useNavigate();
  const {id} = useParams();

  const interview = interviews.find((i) => i.id === id);



  if (!interview) {
    toast.error("Interview ID is not found!");
    return null;
  };

   const allowedTypes = [
     interview.type,
     ...getAllowedInterviewType(interview.type).filter((t) => t !== interview.type) ?? [],
   ];

   const allowedStatuses = [
     interview.status,
     ...getAllowedInterviewStatuses(interview.status),
   ];


  const handleUpdate = async (updateForm: FormInterview) => {
    if (isUpdating) return;

    const isUnchanged =
      interview.title.trim() === updateForm.title.trim() &&
      interview.date === updateForm.date &&
      interview.startTime === updateForm.startTime &&
      interview.endTime === updateForm.endTime &&
      (interview.notes ?? "").trim() === (updateForm.notes ?? "").trim() &&
      interview.type === updateForm.type &&
      interview.status === updateForm.status &&
      interview.interviewerId === updateForm.interviewerId &&
      interview.candidateId === updateForm.candidateId;

    if (isUnchanged) {
      toast.warning("No changes detected.");
      return;
    }

   

    const validStatuses = [
      interview.status,
      ...getAllowedInterviewStatuses(interview.status),
    ];

    if (!validStatuses.includes(updateForm.status)) {
      toast.error("Invalid status transition.");
      return;
    }

    if (!allowedStatuses.includes(updateForm.status)) {
      toast.error("Invalid status transition.");
      return;
    }

    const hasConflict = interviews.some((item) =>
      hasInterviewConflict({
        interview: item,
        interviewerId: updateForm.interviewerId,
        date: updateForm.date,
        startTime: updateForm.startTime,
        endTime: updateForm.endTime,
        excludeInterviewId: interview.id,
      }),
    );

    if (hasConflict) {
      toast.error("Schedule conflict detected. Try again");
      return;
    }

    const candidate = candidates.find(
      (candidate) => candidate.id === updateForm.candidateId,
    );

    if (!candidate) {
      toast.error("Candidate not found");
      return;
    }

    try {
      setIsUpdating(true);

      await UseDelay(700);

      const newStage = getCandidateStagefromForm(updateForm.type);
      const newStatus = getCandidateStatusFromForm(updateForm.status);
      

      const updatedActivities = buildUpdatedInterviewActivities({
        currentInterview: interview,
        newInterview: updateForm,
      })

      setInterviews((prev) =>
        prev.map((i) =>
          i.id === interview.id
            ? {
                ...i,
                ...updateForm,
                notes: updateForm.notes ?? "",
                activities: updatedActivities,
                updatedAt: Date.now(),
              }
            : i,
        ),
      );

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === updateForm.candidateId
            ? {
                ...candidate,
                stage: newStage,
                status: newStatus,
                updatedAt: Date.now(),
              }
            : candidate,
        ),
      );

      toast.success(
        <p className="success">
          Success <span className="highlight">({interview.title})</span> updated
        </p>,
      );

      navigate(`/interview/view/${interview.id}`);
    } catch (error) {
      console.error("Edit interview error:", error);
      toast.error("There is something wrong. Try again");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="edit-interview-wrapper">
      <FormInterviewComponent
        key={`${interview.id}-${interview.updatedAt ?? "new"}`}
        initialForm={{
          title: interview.title,
          date: interview.date,
          startTime: interview.startTime,
          endTime: interview.endTime,
          type: interview.type,
          status: interview.status,
          notes: interview.notes ?? "",
          interviewerId: interview.interviewerId,
          candidateId: interview.candidateId,
          
        }}
        titleLabel={
          <>
            <p className="title-label">
              {" "}
              Update{" "}
              <span className="highlight-title">
                {" "}
                ({`${interview.title}`}){" "}
              </span>
            </p>
          </>
        }
        buttonSubmitText={`${isUpdating ? "Saving changes..." : "Save changes"} `}
        onSubmit={handleUpdate}
        navigateTo={`/interview/view/${interview.id}`}
        modalTitleText="Discard?"
        modalTitleSubText="This will unsaved all your changes"
        modalButtonCancelText="Cancel"
        modalButtonConfirmText="Confirm Discard"
        candidates={candidates}
        interviewers={interviewers}
        mode="edit"
        allowedTypes={allowedTypes as InterviewType[]}
        allowedStatuses={allowedStatuses as InterviewStatus[]}
      />
    </div>
  );
};
export default EditInterview;