import "./ViewInterviewerComponent.css"
import type { Interviewer, InterviewerDepartment, InterviewerRole } from "../../../../types/interviewer/interviewer"
import type { InterviewStatus, InterviewTs, InterviewType } from "../../../../types/interview/interview"
import { Link } from "react-router-dom"



export type InterviewerLabelDetails = {
  label: string;
  department?: InterviewerDepartment;
  role?: InterviewerRole
  value: string;
};

export function InterviewerLabel({
  label,
  value,
  department,
  role
}: InterviewerLabelDetails) {
  
  return (
    <div className="detail-item-container">
      <p
        className={`detail-label ${department ? `detail-${department}` : ""} ${role ? `detail-${role}` : ""}`}
      >
        {label}
      </p>
      <span className="detail-value"> {value} </span>
    </div>
  );
}





export type InterviewerInterviewViewProps = {
  id: InterviewTs["id"];
  title: InterviewTs["title"];
  status: InterviewStatus
  type: InterviewType;
  startTime: InterviewTs["startTime"];
  endTime: InterviewTs["endTime"];
  candidateFullName: string;
}

type ViewInterviewerProps = {
  interviewer: Interviewer;
  interviews: InterviewerInterviewViewProps[];
  pathToLinkSched: string;
  pathToLinkInterviewDetails: string;
};

export default function ViewInterviewerComponent({
  interviewer,
  interviews,
  pathToLinkSched,
  pathToLinkInterviewDetails
}: ViewInterviewerProps) {

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

 

  return (
    <div className="view-interview-wrapper">
      <section className="top-bar">
        <div className="top-title">
          <h2 className="view-title">
            {" "}
            {interviewer.fullName} details and schedule lists{" "}
          </h2>
          <InterviewerLabel
            label="Department"
            value={interviewer.department}
            department={interviewer.department}
          />
          <InterviewerLabel label="Role" value={interviewer.role} />
          <InterviewerLabel label="Email" value={interviewer.email} />
        </div>

        <div className="top-link">
          <Link
          to={pathToLinkSched}
          state={{
            interviewer,
            
          }}
          className="link-to">
            Assign Interview 
          </Link>
        </div>
      </section>

      <section className="view-interview">
        <h2 className="interview-title"> Assigned Interviews </h2>

        {interviews.length === 0 ? (
          <div className="no-interview-card">
            <span className="no-interview"> No Assigned yet </span>
            <Link
            to={pathToLinkSched}
            state={{
              interviewer,
              
            }}
            className="link-to">
              Assigned now
            </Link>
          </div>
        ) : (
          <div className="sched-card-container">
            {interviews.map((interview) => (
              <div key={interview.id} className="sched-card">

                <div className="title-info">
                  <h2 className="title-card"> {interview.title} </h2>
                  <p className="title-card-sub"> {formatTime(interview.startTime)} - {formatTime(interview.endTime)} </p>
                  <span className="title-candidate"> Candidate: {interview.candidateFullName} </span>
                </div>

                <div className="title-status">
                  <span className={`status status-${interview.status}`}> {interview.status} </span>
                </div>
              </div>
            ))}

            <Link to={pathToLinkInterviewDetails} className="path-to-details"> View Full Information </Link>
          </div>
        )}
      </section>
    </div>
  );
} 