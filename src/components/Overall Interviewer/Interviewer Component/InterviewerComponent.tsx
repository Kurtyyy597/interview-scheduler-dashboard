import type { Interviewer } from "../../../types/interviewer/interviewer";
import "./InterviewerComponent.css"

type InterviewerComponentProps = {
  interviewer: Interviewer[];
  viewDetails: (interviewer: Interviewer["id"]) => void
};

export default function InterviewerComponent({interviewer, viewDetails}: InterviewerComponentProps) {
  return (
    <div className="interviewer-wrapper">
      <h1 className="interviewer-title"> Interviewer Lists </h1>

      <section className="interviewer-card-container">
        {interviewer.map(({ id, fullName, email, department, role }) => (
          <button
            key={id}
            className="interviewer-card"
            onClick={() => viewDetails(id)}
          >
            <div className="label-container">
              <p className="text-label"> Full Name: </p>
              <span className="text-content"> {fullName} </span>
            </div>
            <div className="label-container">
              <p className="text-label"> Email: </p>
              <span className="text-content"> {email} </span>
            </div>
            <div className="label-container">
              <p className="text-label"> Department: </p>
              <span className="text-content"> {department} </span>
            </div>
            <div className="label-container">
              <p className="text-label"> Role: </p>
              <span className="text-content"> {role} </span>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}