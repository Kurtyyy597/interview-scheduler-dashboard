import type { CandidateStage, CandidateStatus } from "./candidates";


export type Filter = {
  search: string;
  stage: CandidateStage | "all"
  status: CandidateStatus | "all"
};