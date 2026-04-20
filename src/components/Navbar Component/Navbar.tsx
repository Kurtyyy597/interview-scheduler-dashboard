import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <aside className="navbar-wrapper">
      <div className="navbar-brand">
        <h1 className="navbar-title">Interview Scheduler</h1>
        <p className="navbar-sub-title">Manage interviews</p>
      </div>

      <nav className="navbar-container">
        <NavLink
          to="/candidates"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Candidates
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Calendar
        </NavLink>

        <NavLink
          to="/interview"
          end
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Interview
        </NavLink>

        <NavLink
          to="/interview/create"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Create Interview
        </NavLink>

        <NavLink
          to="/interviewer"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Interviewer
        </NavLink>
      </nav>
    </aside>
  );
}
