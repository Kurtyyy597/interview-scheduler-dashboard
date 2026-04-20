import ViewCandidate from "../../components/Overall Candidates/View Candidates/ViewCandidatesComponent";
import type { Candidate } from "../../types/candidates/candidates";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { InterviewTs } from "../../types/interview/interview";
import type { CandidateInterviewView } from "../../components/Overall Candidates/View Candidates/ViewCandidatesComponent";
import type { Interviewer } from "../../types/interviewer/interviewer";
import { addActivity } from "../../utils/interviews/addActivity";

type ViewCandidateProps = {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  interviews: InterviewTs[];
  setInterviews: React.Dispatch<React.SetStateAction<InterviewTs[]>>;
  interviewers: Interviewer[];
};

function ViewCandidates({
  candidates,
  setCandidates,
  interviews,
  setInterviews,
  interviewers,
}: ViewCandidateProps) {
  const { id } = useParams();

  const candidate = candidates.find((c) => c.id === id);

  const interview = interviews.find(
    (interview) => interview.candidateId === candidate?.id,
  );

  if (!interview) {
    toast.error("Interview ID not found"); // ❌ removed toastId
    return;
  }

  if (!candidate) {
    toast.error("Candidate ID not Found"); // ❌ removed toastId
    return null;
  }

  const viewCandidateInterview: CandidateInterviewView[] = interviews
    .filter((interview) => interview.candidateId === candidate.id)
    .map((interview) => {
      const interviewer = interviewers.find(
        (person) => person.id === interview.interviewerId,
      );

      return {
        id: interview.id,
        title: interview.title,
        status: interview.status,
        startTime: interview.startTime,
        endTime: interview.endTime,
        interviewerName: interviewer?.fullName ?? "",
      };
    });

  const moveCandidateToOffer = (candidateId: Candidate["id"]) => {
    const targetCandidate = candidates.find((c) => c.id === candidateId);

    if (!targetCandidate) {
      toast.error("Candidate not found"); // ❌ removed toastId
      return;
    }

    if (
      targetCandidate.status !== "active" ||
      targetCandidate.stage !== "final"
    ) {
      toast.error("Only active candidates in final stage can move to offer"); // ❌ removed toastId
      return;
    }

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              stage: "offer",
              updatedAt: Date.now(),
            }
          : candidate,
      ),
    );

    toast.success(`Success! ${candidate.firstName} moved to offer`);
  };

  const markCandidateAsHired = (candidateId: Candidate["id"]) => {
    const targetCandidate = candidates.find((c) => c.id === candidateId);

    if (!targetCandidate) {
      toast.error("Candidate not found!");
      return;
    }

    if (
      targetCandidate.status !== "active" ||
      targetCandidate.stage !== "offer"
    ) {
      toast.error(
        "Only active candidates in offer stage can be marked as hired",
      );
      return;
    }

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: "hired",
              updatedAt: Date.now(),
            }
          : candidate,
      ),
    );

    toast.success(`Success! ${candidate.firstName} marked as hired`);
  };

  const rejectCandidate = (candidateId: Candidate["id"]) => {
    const targetCandidate = candidates.find((c) => c.id === candidateId);

    if (!targetCandidate) {
      toast.error("Candidate not found");
      return;
    }

    if (targetCandidate.status !== "active") {
      toast.error("Only active candidates can be rejected");
      return;
    }

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: "rejected",
              updatedAt: Date.now(),
            }
          : candidate,
      ),
    );

    setInterviews((prev) =>
      prev.map((interview) => {
        if (interview.candidateId !== candidate.id) return interview;

        const newActivity = addActivity({
          activities: interview.activities ?? [],
          interviewId: interview.id,
          type: "updated",
          from: "scheduled",
          to: "cancelled",
          message: `Meeting got auto cancelled because the candidate was rejected`,
        });

        return {
          ...interview,
          status: "cancelled",
          updatedAt: Date.now(),
          activities: newActivity,
        };
      }),
    );

    toast.success(`${candidate.firstName} marked as rejected`);
  };

  const putCandidateOnHold = (candidateId: Candidate["id"]) => {
    const targetCandidate = candidates.find((c) => c.id === candidateId);

    if (!targetCandidate) {
      toast.error("Candidate not found");
      return;
    }

    if (targetCandidate.status === "onhold") {
      toast.error("Candidate is already onhold");
      return;
    }

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: "onhold",
              updatedAt: Date.now(),
            }
          : candidate,
      ),
    );

    setInterviews((prev) =>
      prev.map((interview) => {
        if (interview.candidateId !== candidate.id) return interview;

        const newActivity = addActivity({
          activities: interview.activities ?? [],
          interviewId: interview.id,
          type: "updated",
          from: "scheduled",
          to: "cancelled",
          message:
            "Meeting changed from scheduled to cancelled because the candidate was put on-hold",
        });

        return {
          ...interview,
          status: "cancelled",
          updatedAt: Date.now(),
          activities: newActivity,
        };
      }),
    );
    toast.success("Success! candidate marked as hold");
  };

  const resumeCandidate = (candidateId: Candidate["id"]) => {
    const targetCandidate = candidates.find((c) => c.id === candidateId);

    if (!targetCandidate) {
      toast.error("Candidate not found");
      return;
    }

    if (targetCandidate.status !== "onhold") {
      toast.error("Only on-hold candidates can be resumed");
      return;
    }

    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: "active",
              updatedAt: Date.now(),
            }
          : candidate,
      ),
    );

    toast.success(`${candidate.firstName} marked as resumed`);
  };

  return (
    <div className="view-candidate-wrapper">
      <ViewCandidate
        candidate={candidate}
        interviews={viewCandidateInterview}
        goBack="/candidates"
        moveCandidateToOffer={moveCandidateToOffer}
        markCandidateAsHired={markCandidateAsHired}
        rejectCandidate={rejectCandidate}
        putCandidateOnHold={putCandidateOnHold}
        resumeCandidate={resumeCandidate}
        pathLink={`/interview/view/${interview.id}`}
      />
    </div>
  );
}

export default ViewCandidates;
