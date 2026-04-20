export type CandidateStage =
| "applied"
| "screening"
| "technical"
| "final"
| "offer"

export type CandidateStatus =
| "active"
| "onhold"
| "rejected"
| "hired"

export type CandidateContact = {
  email: string;
  phone: string;
}

export type Candidate = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  contact: CandidateContact;
  stage: CandidateStage;
  status: CandidateStatus;
  skills?: string[];
  resume?: string;
  appliedAt: number;
  updatedAt: number | null;
}