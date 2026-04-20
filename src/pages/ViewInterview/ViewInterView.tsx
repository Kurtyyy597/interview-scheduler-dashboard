import { useParams, useNavigate } from "react-router-dom";
import type { Candidate } from "../../types/candidates/candidates";
import type { InterviewTs } from "../../types/interview/interview";
import type { Interviewer } from "../../types/interviewer/interviewer";
import "./ViewInterview.css"
import InterviewDetailsComponent from "../../components/Overall Interview's Component/Interview Details/InterviewDetailsComponent";
import { toast } from "react-toastify";
import { useState } from "react";
import DeleteModalComponent from "../../components/Delete Modal Component/DeleteModalComponent";

type ViewInterviewProps = {
  candidates: Candidate[];
  interviewers: Interviewer[];
  interviews: InterviewTs[];
  setInterview: React.Dispatch<React.SetStateAction<InterviewTs[]>>;
};

function ViewInterview({
  candidates,
  interviewers,
  setInterview,
  interviews,
}: ViewInterviewProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(
    null,
  );
  const [openModalVisible, setOpenModalVisible] = useState<boolean>(false);

  const interview = interviews.find((i) => i.id === id);

  if (!interview) {
    return <div className="view-interview-wrapper">Interview not found.</div>;
  }

  const candidate = candidates.find((c) => c.id === interview.candidateId);
  const interviewer = interviewers.find(
    (i) => i.id === interview.interviewerId,
  );

  if (!candidate || !interviewer) {
    return (
      <div className="view-interview-wrapper">
        Candidate or interviewer record not found.
      </div>
    );
  }

  const handleDeleteModal = (id: InterviewTs["id"]) => {
    setInterviewToDelete(id);
    setOpenModalVisible(true);
  };

  const cancelDeleteModal = () => {
    setInterviewToDelete(null);
    setOpenModalVisible(false);
  };

  const confirmDelete = () => {
    if (!interviewToDelete) return;

    setInterview((prev) => prev.filter((i) => i.id !== interviewToDelete));
    setInterviewToDelete(null);
    setOpenModalVisible(false);
    toast.success("Interview deleted successfully.");
    navigate("/interview");
  };

  return (
    <div className="view-interview-wrapper">
      <InterviewDetailsComponent
        interview={interview}
        candidate={candidate}
        interviewer={interviewer}
        onDelete={handleDeleteModal}
      />

      {openModalVisible && (
        <DeleteModalComponent
          interview={interview}
          title="Delete interview?"
          subtitle="This will permanently delete the interview."
          buttonTextCancel="Cancel"
          buttonTextConfirm="Confirm"
          cancelDiscard={cancelDeleteModal}
          confirmDiscard={confirmDelete}
        />
      )}
    </div>
  );
}

export default ViewInterview;
