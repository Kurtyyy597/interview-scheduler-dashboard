import type { InterviewTs } from "../../types/interview/interview";
import "./DeleteModalComponent.css";

type CancelModalComponentProps = {
  interview: InterviewTs;
  title: string;
  subtitle: string;
  buttonTextCancel: string;
  buttonTextConfirm: string;
  cancelDiscard: () => void;
  confirmDiscard: () => void;
};

export default function CancelModalComponent({
  interview,
  title,
  subtitle,
  buttonTextCancel,
  buttonTextConfirm,
  cancelDiscard,
  confirmDiscard,
}: CancelModalComponentProps) {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-wrapper">
        <div className="top-bar-title">
          <h2 className="top-title">{title}</h2>
          <p className="top-title-sub">{subtitle}</p>
        </div>

        <div className="display-container">
          <div className="display-card">
            <div className="label-container">
              <p className="text-label">Title</p>
              <span className="text-content">{interview.title}</span>
            </div>

            <div className="label-container">
              <p className="text-label">Status</p>
              <span
                className={`status status-${String(interview.status).toLowerCase()}`}
              >
                {interview.status}
              </span>
            </div>

            <div className="label-container">
              <p className="text-label">Type</p>
              <span className="text-content">{interview.type}</span>
            </div>
          </div>
        </div>

        <div className="btn-container">
          <button className="btn-cancel-modal" onClick={cancelDiscard}>
            {buttonTextCancel}
          </button>
          <button className="btn-confirm-discard" onClick={confirmDiscard}>
            {buttonTextConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
