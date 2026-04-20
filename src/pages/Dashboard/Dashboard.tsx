import type { InterviewTs } from "../../types/interview/interview";
import DashboardComponent from "../../components/Dashboard/DashboardComponent";

type DashboardPageProps = {
  interviews: InterviewTs[]
}
function Dashboard({interviews}: DashboardPageProps) {
  return (
   <DashboardComponent
   interviews={interviews}/>
  )
};
export default Dashboard;