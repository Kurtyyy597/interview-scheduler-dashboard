import type { InterviewType } from "./interview";
import type { InterviewStatus } from "./interview";

export type FilterInterview = {
  search: string;
  filterType: InterviewType | "all"
  filterStatus: InterviewStatus | "all"
};