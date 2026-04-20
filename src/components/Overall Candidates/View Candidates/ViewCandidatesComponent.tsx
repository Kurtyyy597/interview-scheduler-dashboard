import type { Candidate } from "../../../types/candidates/candidates";
import { Link } from "react-router-dom";
import "./ViewCandidateComponent.css"
import { isTerminalCandidateStatus } from "../../../utils/candidate/isTerminalCandidateStatus";
import type { InterviewStatus } from "../../../types/interview/interview";
import { useState } from "react";

export type CandidateInterviewView = {
  id: string;
  title: string;
  status: InterviewStatus;
  startTime: string;
  endTime: string;
  interviewerName?: string;
};

type ViewCandidateProps = {
  goBack: string;
  candidate: Candidate;
  interviews: CandidateInterviewView[];
  pathLink: string;

  moveCandidateToOffer: (candidate: Candidate["id"]) => void;
  markCandidateAsHired: (candidate: Candidate["id"]) => void;
  rejectCandidate: (candidate: Candidate["id"]) => void;
  putCandidateOnHold: (candidate: Candidate["id"]) => void;
  resumeCandidate: (candidate: Candidate["id"]) => void;
};

export default function ViewCandidate({
  goBack,
  candidate,
  interviews,
  pathLink,

  moveCandidateToOffer,
  markCandidateAsHired,
  rejectCandidate,
  putCandidateOnHold,
  resumeCandidate,

}: ViewCandidateProps) {
  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fullName = [
    candidate.firstName,
    candidate.middleName,
    candidate.lastName,
  ]
    .filter(Boolean)
    .join(" ");


  const isClosed = isTerminalCandidateStatus(candidate.status);

  const [isOpenVisible, setIsOpenVisible] = useState<boolean>(false);


  const canMoveToOffer = candidate.status === "active" && candidate.stage === "final";
  const canMarkAsHired = candidate.status === "active" && candidate.stage === "offer";
  const canReject = candidate.status !== "rejected" && candidate.status ==="active";
  const canPutOnHold = candidate.status === "active";
  const canResume = candidate.status === "onhold";


  const closeDropDown = () => setIsOpenVisible(false); 
  const toggleDropDown = () => setIsOpenVisible((prev) => !prev);


  
  return (
    <div className="candidate-details-wrapper">
      <div className="candidate-details-topbar">
        <Link to={goBack} className="back-link">
          Back to candidates
        </Link>
      </div>

      <section className="candidate-hero-card">
        <div className="candidate-hero-main">
          <p className="candidate-overline"> {fullName} Details</p>
          <h1 className="candidate-details-title">{fullName}</h1>
          <p className="candidate-details-subtitle">
            Review applicant information and progress
          </p>

          <div className="candidate-badges">
            <span className={`badge stage-badge stage-${candidate.stage}`}>
              {candidate.stage}
            </span>
            <span className={`badge status-badge status-${candidate.status}`}>
              {candidate.status}
            </span>
          </div>
        </div>

        <div className="candidate-hero-side">
          {canMoveToOffer ? (
            <button
              className="action-button primary-button"
              onClick={() => moveCandidateToOffer(candidate.id)}
            >
              Move to Offer
            </button>
          ) : canMarkAsHired ? (
            <button
              className="action-button primary-button"
              onClick={() => markCandidateAsHired(candidate.id)}
            >
              Mark as Hired
            </button>
          ) : canResume ? (
            <button
              className="action-button primary-button"
              disabled={candidate.status === "active"}
              onClick={() => resumeCandidate(candidate.id)} // ✅ FIXED
            >
              Resume Candidate
            </button>
          ) : isClosed ? (
            <button className="action-button disabled-button" disabled>
              <span className="sched-error"> Schedule not available. </span>
              <strong> Candidate already {candidate.status} </strong>
            </button>
          ) : (
            <Link
              to="/interview/create"
              state={{ candidate }}
              className="action-button primary-button" // fixed typo
            >
              Schedule Interview
            </Link>
          )}

          <div className="dropdown-container">
            <button
              className="action-button secondary-button"
              onClick={toggleDropDown}
            >
              More Actions
            </button>

            {isOpenVisible && (
              <div className="dropdown-menu">
                {canMoveToOffer && (
                  <button
                    className="action-button primary-button"
                    disabled={!canMoveToOffer}
                    onClick={() => {
                      moveCandidateToOffer(candidate.id);
                      closeDropDown();
                    }}
                  >
                    Move to Offer
                  </button>
                )}

                {canMarkAsHired && (
                  <button
                    className="action-button primary-button"
                    disabled={!canMarkAsHired}
                    onClick={() => {
                      markCandidateAsHired(candidate.id);
                      closeDropDown();
                    }}
                  >
                    Mark as Hired
                  </button>
                )}

                {canPutOnHold && (
                  <button
                    className="action-button primary-button"
                    disabled={!canPutOnHold}
                    onClick={() => {
                      putCandidateOnHold(candidate.id);
                      closeDropDown();
                    }}
                  >
                    Put On Hold
                  </button>
                )}

                {canResume && (
                  <button
                    className="action-button primary-button"
                    disabled={!canResume}
                    onClick={() => {
                      resumeCandidate(candidate.id);
                      closeDropDown();
                    }}
                  >
                    Resume Candidate
                  </button>
                )}

                {canReject && (
                  <button
                    className="action-button primary-button"
                    disabled={!canReject}
                    onClick={() => {
                      rejectCandidate(candidate.id);
                      closeDropDown();
                    }}
                  >
                    Reject Candidate
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="candidate-details-grid">
        <section className="candidate-info-card">
          <h2 className="section-title">Contact Information</h2>
          <div className="detail-list">
            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">{candidate.contact.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{candidate.contact.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Candidate ID</span>
              <span className="detail-value detail-mono">{candidate.id}</span>
            </div>
          </div>
        </section>

        <section className="candidate-info-card">
          <h2 className="section-title">Application Status</h2>
          <div className="detail-list">
            <div className="detail-row">
              <span className="detail-label">Stage</span>
              <span className="detail-value">{candidate.stage}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value">{candidate.status}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Applied At</span>
              <span className="detail-value">
                {new Date(candidate.appliedAt).toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Updated At</span>
              <span className="detail-value">
                {candidate.updatedAt
                  ? new Date(candidate.updatedAt).toLocaleString()
                  : "Not updated yet"}
              </span>
            </div>
          </div>
        </section>

        <section className="candidate-info-card full-width">
          <h2 className="section-title">Skills</h2>
          <div className="skills-list">
            {candidate.skills?.length ? (
              candidate.skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))
            ) : (
              <p className="empty-text">No skills added.</p>
            )}
          </div>
        </section>

        <section className="candidate-info-card full-width">
          <h2 className="section-title">Resume</h2>
          {candidate.resume ? (
            <a
              href={candidate.resume}
              target="_blank"
              rel="noreferrer"
              className="resume-link"
            >
              Open candidate resume
            </a>
          ) : (
            <p className="empty-text">No resume uploaded.</p>
          )}
        </section>

        <section className="candidate-info-card full-width">
          <h2 className="section-title">Interviews</h2>

          {interviews.length === 0 ? (
            <span className="text-error"> No interviews scheduled</span>
          ) : (
            <div className="interview-list">
              {interviews.map((i) => (
                <div key={i.id} className="interview-card">
                  <div className="interview-header">
                    <span className="header-title">
                      {" "}
                      <strong> {i.title} </strong>{" "}
                    </span>
                    <span className={`badge-interview status${i.status}`}>
                      {i.status}
                    </span>
                  </div>

                  <div className="interview-time">
                    <span className="time">
                      {" "}
                      {formatTime(i.startTime)} - {formatTime(i.endTime)}{" "}
                    </span>
                  </div>

                  {i.interviewerName ? (
                    <div className="interviewer">
                      <span className="interviewer-text">
                        {" "}
                        Interviewer:{" "}
                        <strong>
                          {" "}
                          {i.interviewerName ?? "Name not specified"}{" "}
                        </strong>{" "}
                      </span>
                    </div>
                  ) : (
                    <span className="no-interviewer">
                      {" "}
                      No Interviewer specified{" "}
                    </span>
                  )}
                </div>
              ))}

              <Link to={pathLink}> View Information </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
