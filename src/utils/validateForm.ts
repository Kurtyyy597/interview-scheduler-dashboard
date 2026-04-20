import type { ValidationFormInterview } from "../types/validationForm";
import type { FormInterview } from "../types/interview/formInterview";

export function validateField(
  name: keyof FormInterview,
  value: FormInterview[keyof FormInterview],
): string {
  const text = String(value).trim();

  switch (name) {
    case "title": {
      if (!text) return "Title is required!";
      if (text.length < 5) return "Title is too short!";
      if (text.length > 100) return "Title is too long!";
      return "";
    }

    case "date": {
      if (!text) return "Date is required!";
      if (isNaN(Date.parse(text))) return "Date is invalid!";
      return "";
    }

    case "startTime": {
      if (!text) return "Start time is required!";
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(text)) {
        return "Start time must be in HH:mm format.";
      }
      return "";
    }

    case "endTime": {
      if (!text) return "End time is required!";
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(text)) {
        return "End time must be in HH:mm format.";
      }
      return "";
    }

    case "status": {
      if (!text) return "Status is required!";
      return "";
    }

    case "type": {
      if (!text) return "Type is required!";
      return "";
    }

    case "notes": {
      if (!text) return ""
      if (text.length < 5) return "Notes is too short";
      if (text.length > 100) return "Notes is too long";
      return "";
    };

    case "candidateId": {
      if (!text) return "Candidate is required";
      return ""
    };
    
     case "interviewerId": {
      if (!text) return "Interviewer is required";
      return ""
     }
    


    default:
      return "";
  }
}

export function validateForm(form: FormInterview) {
  const errors: ValidationFormInterview = {
    title: validateField("title", form.title),
    date: validateField("date", form.date),
    startTime: validateField("startTime", form.startTime),
    endTime: validateField("endTime", form.endTime),
    type: validateField("type", form.type),
    status: validateField("status", form.status),
    notes: validateField("notes", form.notes),
    candidateId: validateField("candidateId", form.candidateId),
    interviewerId: validateField("interviewerId", form.interviewerId)
    
  };

  if (!errors.startTime && !errors.endTime && form.startTime >= form.endTime) {
    errors.endTime = "End time must be later than start time.";
  }

  const isValid = Object.values(errors).every((error) => error === "");

  return {
    errors,
    isValid,
  };
}
