import "./InterviewComponent.css"
import type { InterviewTs } from "../../../types/interview/interview"
import { Link } from "react-router-dom"
import Highlighter from "react-highlight-words";
import "./InterviewComponent.css"
import { Pencil, Ellipsis, Ban, CheckCheck, XCircle } from "lucide-react";

type InterviewComponentProps = {
  interview: InterviewTs[];
  viewInterview: (interview: InterviewTs["id"]) => void;
  editInterview: (interview: InterviewTs["id"]) => void;
  requestCancelInterview: (interview: InterviewTs["id"]) => void;
 

  toggleSelectInterview: (interview: InterviewTs["id"]) => void;
  selectAllInterview: (interview: InterviewTs["id"][]) => void;
  selectedInterviewIds: string[];
  allVisibleSelected: boolean;
  cancelInterview: (interview: InterviewTs["id"]) => void;
  markComplete: (interview: InterviewTs["id"]) => void;



  search?: string;
  goToCreateLink: string;
};

export default function InterviewComponent({
  interview,
  viewInterview,
  editInterview,
  requestCancelInterview,
  toggleSelectInterview,
  selectedInterviewIds,
  selectAllInterview,
  allVisibleSelected,
  cancelInterview,
  markComplete,
  search,
  goToCreateLink
}: InterviewComponentProps) {

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  return (
    <div className="interview-wrapper">
      <Link to={goToCreateLink} className="link-create">
        {" "}
        Create new Schedule{" "}
      </Link>
      <div className="interview-top-bar">
        <h1 className="top-bar-title"> Interview schedules </h1>
        <p className="top-bar-title-sub"> Manage interviews </p>
      </div>

      <section className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={(e) => e.stopPropagation()}>
                <input 
                className="input"
                type="checkbox"
                checked={allVisibleSelected}
                onChange={() => selectAllInterview(interview.map((i) => String(i.id)))}/>
              </th>
              <th>Title</th>
              <th>Date</th>
              <th>Time start</th>
              <th>Time End </th>
              <th> Type </th>
              <th> status </th>
              <th> Notes </th>
              <th> Date Created </th>
              <th> Date Updated </th>
              <th> Actions </th>
            </tr>
          </thead>

          <tbody>
            {interview.map((i) => (
              <tr key={i.id} onClick={() => viewInterview(i.id)}>

                <td onClick={(e) => e.stopPropagation()}>
                  <input
                  className="input"
                  type="checkbox"
                  checked={selectedInterviewIds.includes(i.id)}
                  onChange={() => toggleSelectInterview(i.id)}/>
                </td>

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={i.title}
                  />
                </td>

              

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={new Date(
                      `${i.date}T00:00:00`,
                    ).toLocaleDateString()}
                  />
                </td>

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={formatTime(i.startTime)}
                  />
                </td>

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={formatTime(i.endTime)}
                  />
                </td>

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={i.type}
                  />
                </td>

                <td>
                  <span className={`status-badge status${i.status}`}>
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={i.status}
                    />
                  </span>
                </td>

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={i.notes ?? "No notes"}
                  />
                </td>

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={new Date(i.createdAt).toLocaleDateString()}
                  />
                </td>

                <td>
                  <Highlighter
                    searchWords={[search ?? ""]}
                    autoEscape
                    textToHighlight={
                      i.updatedAt
                        ? `${new Date(i.updatedAt).toLocaleDateString()}`
                        : "Not Updated Yet"
                    }
                  />
                </td>

                <td className="action-cell" onClick={(e) => e.stopPropagation()}>
                  <div className="actions-menu">
                    <button
                    className="btn-edit"
                    onClick={(e) => {
                      e.stopPropagation()
                      editInterview(i.id)
                    }}
                    title="Edit interview"
                    aria-label="Edit interview"
                    >
                      <Pencil size={16}/>
                    </button>

                    <details className="dropdown">
                      <summary
                      className="more-actions"
                      onClick={(e) => e.stopPropagation()}
                      title="More actions"
                      aria-label="More actions">
                        <Ellipsis size={16}/>
                      </summary>
                      
                      <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        <button
                        type="button"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelInterview(i.id)
                        }}
                        disabled={i.status !== "scheduled"}
                        >
                          <Ban size={16}/>
                          <span> Cancel </span>
                        </button>

                        <button
                        type="button"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          markComplete(i.id)
                        }}
                        disabled={i.status === "completed" || i.status === "cancelled"}
                        >
                         <CheckCheck size={16}/>
                         <span> Mark complete </span>
                        </button>

                        <div className="dropdown-divier"/>

                        <button
                        className="btn-cancel"
                        disabled={i.status !== "scheduled"}
                        onClick={(e) => {
                          e.stopPropagation();
                         requestCancelInterview(i.id)
                        }}>
                          <XCircle size={16}/>
                        </button>
                        
                      </div>
                    </details>
                  </div>
                </td>

              
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}