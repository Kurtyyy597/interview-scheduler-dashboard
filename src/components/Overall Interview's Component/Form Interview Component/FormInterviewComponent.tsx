import type { FormInterview } from "../../../types/interview/formInterview";
import type { Touched } from "../../../types/Touched/touch";
import { initialTouched } from "../../../constants/validation/initialTouched";
import type { ValidationFormInterview } from "../../../types/validationForm";
import { initialValidationForm } from "../../../constants/validation/initialValidationForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateForm, validateField } from "../../../utils/validateForm";
import { toast } from "react-toastify";
import "./FormInterviewComponent.css";
import type { Candidate } from "../../../types/candidates/candidates";
import type { Interviewer } from "../../../types/interviewer/interviewer";
import type { InterviewStatus, InterviewType } from "../../../types/interview/interview";

type FormInterviewComponentProps = {
  initialForm: FormInterview;
  titleLabel: React.ReactNode;
  buttonSubmitText: string;
  onSubmit: (forms: FormInterview) => void | Promise<void>;
  navigateTo: string;
  modalTitleText: string;
  modalTitleSubText: string;
  modalButtonCancelText: string;
  modalButtonConfirmText: string;
  candidates: Candidate[];
  mode: "create" | "edit"
  interviewers: Interviewer[];
  allowedTypes?: InterviewType[]
  allowedStatuses?: InterviewStatus[] 
};

export default function FormInterviewComponent({
  initialForm,
  navigateTo,
  onSubmit,
  titleLabel,
  buttonSubmitText,
  modalTitleText,
  modalTitleSubText,
  modalButtonCancelText,
  modalButtonConfirmText,
  candidates,
  interviewers,
  mode,
  allowedTypes = ["hr-screening", "technical", "final" as InterviewType],
  allowedStatuses = ["scheduled", "completed", "cancelled" as InterviewStatus],
}: FormInterviewComponentProps) {
  const navigate = useNavigate();

  const [forms, setForms] = useState<FormInterview>(initialForm);
  const [touched, setTouched] = useState<Touched>(initialTouched);
  const [errors, setErrors] = useState<ValidationFormInterview>(
    initialValidationForm,
  );
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isDirty = JSON.stringify(forms) !== JSON.stringify(initialForm);

  const handleCancel = () => {
    if (isDirty) {
      setOpenDiscardModal(true);
      return;
    }
    setErrors(initialValidationForm);
    setForms(initialForm);
    setTouched(initialTouched);
    navigate(navigateTo);
  };

  const cancelDiscardModal = () => {
    setOpenDiscardModal(false);
  };

  const confirmDiscard = () => {
    setOpenDiscardModal(false);
    setErrors(initialValidationForm);
    setForms(initialForm);
    setTouched(initialTouched);
    navigate(navigateTo);
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.currentTarget;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof FormInterview, value),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.currentTarget;

    setForms((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name as keyof typeof touched]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof FormInterview, value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const result = validateForm(forms);

    setErrors(result.errors);

    setTouched({
      title: true,
      type: true,
      date: true,
      startTime: true,
      endTime: true,
      status: true,
      notes: true,
      candidateId: true,
      interviewerId: true
    });

    if (!result.isValid) return;

    

    try {
      setIsSubmitting(true);
      await onSubmit(forms);
    } catch {
      toast.error("Something went wrong while submitting the form.");
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      {/* Header */}
      <div className="form-top-header">
        <h1 className="form-title">{titleLabel}</h1>
        <button className="btn-cancel" onClick={handleCancel} type="button">
          Cancel
        </button>
      </div>

      {/* Form */}
      <div className="form-container">
        <form className="form-card" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="label">Title</label>
            <input
              name="title"
              className="input"
              value={forms.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title && touched.title && (
              <span className="text-error">{errors.title}</span>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="label">Date</label>
            <input
              name="date"
              type="date"
              className="input"
              value={forms.date}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.date && touched.date && (
              <span className="text-error">{errors.date}</span>
            )}
          </div>

          {/* Start Time */}
          <div className="form-group">
            <label className="label">Start time</label>
            <input
              name="startTime"
              type="time"
              className="input"
              value={forms.startTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.startTime && touched.startTime && (
              <span className="text-error">{errors.startTime}</span>
            )}
          </div>

          {/* End Time */}
          <div className="form-group">
            <label className="label">End time</label>
            <input
              name="endTime"
              type="time"
              className="input"
              value={forms.endTime}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.endTime && touched.endTime && (
              <span className="text-error">{errors.endTime}</span>
            )}
          </div>

          {/* Interviewer */}
          <div className="form-group">
            <label className="label"> Choose Interviewer </label>
            <select
              className="select"
              name="interviewerId"
              value={forms.interviewerId}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>
                {" "}
              </option>
              {interviewers.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.fullName}
                </option>
              ))}
            </select>
            {errors.interviewerId && touched.interviewerId && (
              <p className="text-error"> {errors.interviewerId} </p>
            )}
          </div>

          {/* Candidates */}
          <div className="form-group">
            <label className="label"> Choose candidate </label>
            <select
              className="select"
              name="candidateId"
              value={forms.candidateId}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled></option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {`${c.firstName} ${c.middleName ? `${c.middleName}` : ""} ${c.lastName}`}
                </option>
              ))}
            </select>
            {errors.candidateId && touched.candidateId && (
              <p className="text-error"> {errors.candidateId} </p>
            )}
          </div>

          {/* Type */}
          <div className="form-group">
            <label className="label">
              Type
              {mode === "create" && (
                <span className="subtle-text"> • Set automatically</span>
              )}
            </label>

            <select
              className="select"
              name="type"
              value={forms.type}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={mode === "create"}
            >
              {allowedTypes.includes("hr-screening") && (
                <option value="hr-screening">HR Screening</option>
              )}
              {allowedTypes.includes("technical") && (
                <option value="technical">Technical</option>
              )}
              {allowedTypes.includes("final") && (
                <option value="final">Final</option>
              )}
            </select>

            {errors.type && touched.type && (
              <span className="text-error">{errors.type}</span>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="label">
              Status
              {mode === "create" && (
                <span className="subtle-text"> • Set automatically</span>
              )}
            </label>

            <select
              name="status"
              value={forms.status}
              className="select"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={mode === "create"}
            >
              {allowedStatuses.includes("scheduled") && (
                <option value="scheduled">Scheduled</option>
              )}
              {allowedStatuses.includes("completed") && (
                <option value="completed">Completed</option>
              )}
              {allowedStatuses.includes("cancelled") && (
                <option value="cancelled">Cancelled</option>
              )}
            </select>

            {errors.status && touched.status && (
              <span className="text-error">{errors.status}</span>
            )}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="label">Notes</label>
            <textarea
              name="notes"
              placeholder="Type notes (optional)"
              className="textarea"
              value={forms.notes}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.notes && touched.notes && (
              <span className="text-error">{errors.notes}</span>
            )}
          </div>

          {/* Actions */}
          <div className="btn-action-container">
            <button className="cancel-btn" onClick={handleCancel} type="button">
              Cancel
            </button>

            <button
              className="btn-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {buttonSubmitText}
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {openDiscardModal && (
        <div className="modal-container">
          <div className="modal-card">
            <div className="modal-top">
              <h2 className="modal-title">{modalTitleText}</h2>
              <span className="modal-title-sub">{modalTitleSubText}</span>
            </div>

            <div className="btn-container-modal">
              <button className="btn-cancel-modal" onClick={cancelDiscardModal}>
                {modalButtonCancelText}
              </button>

              <button className="btn-confirm-discard" onClick={confirmDiscard}>
                {modalButtonConfirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
