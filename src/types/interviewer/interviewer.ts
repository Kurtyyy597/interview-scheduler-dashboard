export type InterviewerDepartment =
| "engineering"
| "human-resources"
| "design"
| "product"
| "quality-assurance"

export type InterviewerRole =
  | "hr-recruiter"
  | "frontend-lead"
  | "backend-lead"
  | "qa-lead"
  | "engineering-manager";

export type Interviewer = {
  id: string;
  fullName: string;
  email: string;
  department: InterviewerDepartment;
  role: InterviewerRole;
}