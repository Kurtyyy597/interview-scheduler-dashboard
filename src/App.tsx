import { Navigate, Route, Routes } from "react-router-dom";
import CalendarPage from "./pages/Calendar/Calendar";
import Candidates from "./pages/Candidates/Candidate";
import CreateInterview from "./pages/CreateInterview/CreateInterview";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditInterview from "./pages/EditInterview/EditInterview";
import ViewCandidates from "./pages/View Candidate/ViewCandidate";
import ViewInterview from "./pages/ViewInterview/ViewInterView";
import InterviewerPage from "./pages/Interviewer/InterviewerPage";
import ViewInterviewerPage from "./pages/View Interviewer/ViewInterviewer";
import { initialInterviews } from "./constants/interview/initialInterview";
import InterviewPage from "./pages/Interviews/Interview";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar Component/Navbar";
import "./App.css"
import { initialCandidates } from "./constants/candidates/initialCandidates";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { initialInterviewers } from "./constants/interviewer/initialInterviewer";

function App() {
  const [candidates, setCandidates] = useLocalStorage(
    "candidates",
    initialCandidates,
  );
  const [interviewers] = useLocalStorage("interviewers", initialInterviewers);
  const [interviews, setInterviews] = useLocalStorage(
    "interviews",
    initialInterviews,
  );
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        theme="dark"
        closeOnClick
        pauseOnHover
      />

      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard interviews={interviews}/>} />
          <Route path="/candidates" element={<Candidates candidates={candidates}/>} />
          <Route path="/view/candidates/:id" element={<ViewCandidates candidates={candidates} setCandidates={setCandidates} interviews={interviews} setInterviews={setInterviews} interviewers={interviewers}/>} />
          <Route path="/calendar" element={<CalendarPage interviewers={interviewers} interviews={interviews} candidates={candidates}/>} />
          <Route path="/interview" element={<InterviewPage interviews={interviews} setInterview={setInterviews} setCandidates={setCandidates}/>} />
          <Route path="/interview/view/:id" element={<ViewInterview interviews={interviews} setInterview={setInterviews} candidates={candidates} interviewers={interviewers}/>} />
          <Route path="/interview/create" element={<CreateInterview setInterview={setInterviews} interviews={interviews} candidates={candidates} setCandidates={setCandidates}  interviewers={interviewers}/>} />
          <Route path="/interview/edit/:id" element={<EditInterview interviews={interviews} setInterviews={setInterviews} candidates={candidates} setCandidates={setCandidates} interviewers={interviewers}/>} />
          <Route path="/interviewer" element={<InterviewerPage interviewer={interviewers}/>}/>
          <Route path="/interviewer/details/:id" element={<ViewInterviewerPage candidates={candidates} interviewers={interviewers} interviews={interviews}/>}/>
        </Routes>
      </main>
    </>
  );
}

export default App;
