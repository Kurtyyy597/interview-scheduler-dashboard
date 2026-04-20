import type { InterviewTs } from "../../../types/interview/interview";
import type { Interviewer } from "../../../types/interviewer/interviewer";
import { Link } from "react-router-dom";
import "./CalendarComponent.css";
import { Plus } from "lucide-react";

export type InterviewDetailsProps = {
  interviewId: InterviewTs["id"];
  candidateName: string;
  interviewerName: Interviewer["fullName"];
  date: InterviewTs["date"];
  startTime: InterviewTs["startTime"];
  status: InterviewTs["status"];
  endTime: InterviewTs["endTime"];
  notes: InterviewTs["notes"];
};

export type CalendarComponentProps = {
  interviews: InterviewDetailsProps[];
  onClickDetails: (interviewId: InterviewTs["id"]) => void;
  linkTo: string;
};

export default function CalendarComponent({
  linkTo,
  onClickDetails,
  interviews,
}: CalendarComponentProps) {
  const formatTime = (time: string) =>
    new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusBadgeClass = (status: InterviewTs["status"]) => {
    return `status-badge ${String(status).toLowerCase().replace(/\s+/g, "-")}`;
  };

  const sortedInterviews = [...interviews].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.startTime}`).getTime();
    const bDate = new Date(`${b.date}T${b.startTime}`).getTime();
    return aDate - bDate;
  });

  if (sortedInterviews.length === 0) {
    return (
      <div className="calendar-component-wrapper">
        <header className="top-bar-title">
          <div className="title-group">
            <h2 className="calendar-title">Calendar Schedule</h2>
            <p className="calendar-sub-title">
              Manage and view scheduled interviews.
            </p>
          </div>

          <Link to={linkTo} className="create-interview-btn">
            <Plus size={20} />
          </Link>
        </header>

        <section className="interview-wrapper">
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3 className="empty-title">No interviews scheduled yet</h3>
            <p className="empty-description">
              Start by creating your first interview schedule.
            </p>
            <Link to={linkTo} className="link-to">
              <Plus size={20} />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="calendar-component-wrapper">
      <header className="top-bar-title">
        <div className="title-group">
          <h2 className="calendar-title">Calendar Schedule</h2>
          <p className="calendar-sub-title">
            Manage and view scheduled interviews.
          </p>
        </div>

        <Link to={linkTo} className="create-interview-btn">
          <Plus size={20} />
        </Link>
      </header>

      <section className="interview-wrapper">
        <div className="interview-card-container">
          {sortedInterviews.map(
            ({
              interviewId,
              date,
              startTime,
              endTime,
              status,
              candidateName,
              interviewerName,
              notes,
            }) => (
              <button
                key={interviewId}
                type="button"
                className="interview-card"
                onClick={() => onClickDetails(interviewId)}
                aria-label={`View interview details for ${candidateName} with ${interviewerName} on ${formatDate(date)}`}
              >
                <div className="card-top">
                  <div className="date-time-block">
                    <h3 className="card-date">{formatDate(date)}</h3>
                    <p className="card-time">
                      {formatTime(startTime)} - {formatTime(endTime)}
                    </p>
                  </div>

                  <span className={getStatusBadgeClass(status)}>{status}</span>
                </div>

                <div className="card-divider" />

                <div className="card-meta-grid">
                  <div className="meta-item">
                    <span className="row-label">Candidate</span>
                    <span className="row-content">{candidateName}</span>
                  </div>

                  <div className="meta-item">
                    <span className="row-label">Interviewer</span>
                    <span className="row-content">{interviewerName}</span>
                  </div>
                </div>

                <div className="notes-block">
                  <span className="row-label">Notes</span>
                  <p className="notes-content">
                    {notes?.trim() ? notes : "No notes specified"}
                  </p>
                </div>
              </button>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
