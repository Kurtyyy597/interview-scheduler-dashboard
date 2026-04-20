import InterviewerComponent from "../../components/Overall Interviewer/Interviewer Component/InterviewerComponent";
import { useNavigate } from "react-router-dom"
import type { Interviewer } from "../../types/interviewer/interviewer"
import "./InterviewerPage.css"


type InterviewerPageProps = {
  interviewer: Interviewer[];
};

function InterviewerPage({interviewer}: InterviewerPageProps) {
  const navigate = useNavigate();

  const viewDetails = (id: Interviewer['id']) => {
    navigate(`/interviewer/details/${id}`);
  };

  return (
    <div className="interviewer-page-wrapper">
      <InterviewerComponent
      interviewer={interviewer}
      viewDetails={viewDetails}/>
    </div>
  )
};
export default InterviewerPage;



