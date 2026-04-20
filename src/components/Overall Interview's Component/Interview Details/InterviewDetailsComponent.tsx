import "./InterviewDetailsComponent.css";
import type { InterviewTs } from "../../../types/interview/interview";
import { Link } from "react-router-dom";
import type { Candidate } from "../../../types/candidates/candidates";
import type { Interviewer } from "../../../types/interviewer/interviewer";


type InterviewDetailsComponentProps = {
  interview: InterviewTs;
  candidate: Candidate;
  interviewer: Interviewer;
  onDelete: (id: InterviewTs["id"]) => void;
};

type DetailItemProps = {
  label: string;
  value: React.ReactNode;
  full?: boolean;
};

function DetailItem({ label, value, full = false }: DetailItemProps) {
  return (
    <div className={`detail-item ${full ? "detail-item-full" : ""}`}>
      <p className="detail-label">{label}</p>
      <div className="detail-value">{value}</div>
    </div>
  );
}

export default function InterviewDetailsComponent({
  interview,
  candidate,
  interviewer,
  onDelete,
}: InterviewDetailsComponentProps) {
  const candidateFullName = [
    candidate.firstName,
    candidate.middleName,
    candidate.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="interview-details-wrapper">
      <div className="interview-details-shell">
        {/* HERO HEADER */}
        <header className="details-hero">
          <div className="details-hero-top">
            <Link to="/interview" className="back-link">
              ← Back to interviews
            </Link>
          </div>

          <div className="details-hero-main">
            <div className="details-heading-block">
              <span className="details-eyebrow">Interview Details</span>

              <h1 className="details-title">
                <span className="highlight-title">{interview.title}</span>
              </h1>

              <p className="details-subtitle">
                Review schedule, participants, and timeline information.
              </p>

              <div className="details-badge-row">
                <span className={`badge badge-${interview.type}`}>
                  {interview.type}
                </span>

                <span className={`badge badge-${interview.status}`}>
                  {interview.status}
                </span>
              </div>
            </div>

            <div className="top-btn-container">
              <Link to={`/interview/edit/${interview.id}`} className="btn-edit">
                Edit
              </Link>

              <button
                type="button"
                className="btn-delete"
                onClick={() => onDelete(interview.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </header>

        {/* GRID */}
        <div className="details-grid">
          {/* INTERVIEW INFO */}
          <article className="details-card">
            <div className="card-header">
              <h2 className="card-title">Interview Info</h2>
              <p className="card-subtitle">Schedule and metadata</p>
            </div>

            <div className="details-list">
              <DetailItem label="Interview ID" value={interview.id} />
              <DetailItem label="Title" value={interview.title} />

              <DetailItem
                label="Date"
                value={new Date(
                  `${interview.date}T00:00:00`,
                ).toLocaleDateString()}
              />

              <DetailItem label="Start Time" value={interview.startTime} />
              <DetailItem label="End Time" value={interview.endTime} />

              <DetailItem
                label="Type"
                value={
                  <span className={`badge badge-${interview.type}`}>
                    {interview.type}
                  </span>
                }
              />

              <DetailItem
                label="Status"
                value={
                  <span className={`badge badge-${interview.status}`}>
                    {interview.status}
                  </span>
                }
              />

              <DetailItem
                label="Notes"
                value={interview.notes ?? "No notes provided"}
                full
              />
            </div>
          </article>

          {/* PEOPLE */}
          <article className="details-card">
            <div className="card-header">
              <h2 className="card-title">People</h2>
              <p className="card-subtitle">Candidate & interviewer</p>
            </div>

            <div className="details-list">
              {/* Candidate */}
              <DetailItem label="Candidate ID" value={candidate.id} />
              <DetailItem label="Name" value={candidateFullName} />
              <DetailItem label="Email" value={candidate.contact.email} />
              <DetailItem label="Phone" value={candidate.contact.phone} />
              <DetailItem label="Stage" value={candidate.stage} />
              <DetailItem label="Status" value={candidate.status} />

              <div className="divider" />
              {/* Interviewer */}
              <DetailItem label="Interviewer ID" value={interviewer.id} />
              <DetailItem label="Name" value={interviewer.fullName} />
              <DetailItem label="Email" value={interviewer.email} />
              <DetailItem label="Department" value={interviewer.department} />
              <DetailItem label="Role" value={interviewer.role} />
            </div>
          </article>

          {/* TIMELINE */}
          <article className="details-card details-card-wide">
            <div className="card-header">
              <h2 className="card-title">Timeline</h2>
              <p className="card-subtitle">Audit information</p>
            </div>

            <div className="details-list">
              <DetailItem
                label="Created"
                value={new Date(interview.createdAt).toLocaleDateString()}
              />

              <DetailItem
                label="Updated"
                value={
                  interview.updatedAt
                    ? new Date(interview.updatedAt).toLocaleDateString()
                    : "Not updated yet"
                }
              />
            </div>
          </article>
        </div>

        <section className="activity-wrapper">
          <h2 className="activity-title">Recorded Activities</h2>

          {interview.activities && interview.activities.length > 0 ? (
            <div className="activity-card-container">
              {interview.activities.map((act) => (
                <div key={act.id} className="activity-card">
                  <div className="activity-row">
                    <span className="row-label">Type:</span>
                    <span className="row-value">
                      {act.type.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="activity-row">
                    <span className="row-label"> From:</span>
                    <span className="row-value">{act.from}</span>
                  </div>

                  <div className="activity-row">
                    <span className="row-label">New:</span>
                    <span className="row-value">{act.to}</span>
                  </div>

                  <div className="activity-row">
                    <span className="row-label">Message:</span>
                    <span className="row-value">
                      {act.message ? act.message : "No message specified"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity-container">
              <span className="no-activity-text">No activities yet</span>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
