import type { Candidate } from "../../../types/candidates/candidates";
import Highlighter from "react-highlight-words";
import "./CandidateTableComponent.css"

type CandidateTableProps = {
  candidates: Candidate[];
  viewDetails: (candidate: Candidate["id"]) => void;
  search?: string;
};

export default function CandidateTableComponent({
  candidates,
  viewDetails,
  search,
}: CandidateTableProps) {
  const getBadgeClass = (value: string, type: "stage" | "status") => {
    return `${type}-badge ${type}-${value.toLowerCase()}`;
  };

  return (
    <div className="candidate-table-section">
      <div className="candidate-table-header">
        <div>
          <h2 className="candidate-table-title">Candidates</h2>
          <p className="candidate-table-subtitle">
            View and manage all applicants in one place
          </p>
        </div>

        <div className="candidate-table-count">
          {candidates.length}{" "}
          {candidates.length === 1 ? "candidate" : "candidates"}
        </div>
      </div>

      <div className="candidate-table-container">
        <table className="candidate-table-card">
          <thead>
            <tr>
             
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Skills</th>
              <th>Resume</th>
              <th>Date Applied</th>
              <th>Date Updated</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length > 0 ? (
              candidates.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => viewDetails(c.id)}
                  className="candidate-row"
                >
                  
                  <td>
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={c.firstName}
                      highlightClassName="search-highlight"
                    />
                  </td>

                  <td>
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={c.middleName ?? "N/A"}
                      highlightClassName="search-highlight"
                    />
                  </td>

                  <td>
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={c.lastName}
                      highlightClassName="search-highlight"
                    />
                  </td>

                  <td>
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={c.contact.phone}
                      highlightClassName="search-highlight"
                    />
                  </td>

                  <td className="cell-email">
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={c.contact.email}
                      highlightClassName="search-highlight"
                    />
                  </td>

                  <td>
                    <span className={getBadgeClass(c.stage, "stage")}>
                      <Highlighter
                        searchWords={[search ?? ""]}
                        autoEscape
                        textToHighlight={c.stage}
                        highlightClassName="search-highlight-inline"
                      />
                    </span>
                  </td>

                  <td>
                    <span className={getBadgeClass(c.status, "status")}>
                      <Highlighter
                        searchWords={[search ?? ""]}
                        autoEscape
                        textToHighlight={c.status}
                        highlightClassName="search-highlight-inline"
                      />
                    </span>
                  </td>

                  <td className="cell-skills">
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={c.skills?.join(", ") ?? "N/A"}
                      highlightClassName="search-highlight"
                    />
                  </td>

                  <td className="cell-resume">
                    {c.resume ? (
                      <a
                        href={c.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="resume-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Resume
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td>
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={new Date(c.appliedAt).toLocaleString()}
                      highlightClassName="search-highlight"
                    />
                  </td>

                  <td>
                    <Highlighter
                      searchWords={[search ?? ""]}
                      autoEscape
                      textToHighlight={
                        c.updatedAt
                          ? new Date(c.updatedAt).toLocaleString()
                          : "Not updated yet"
                      }
                      highlightClassName="search-highlight"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="candidate-empty-state">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
