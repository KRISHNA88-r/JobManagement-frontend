import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">JobPortal</Link>

        <div className="nav-links">
          <NavLink to="/jobs">Jobs</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user?.role === "JOB_SEEKER" && <NavLink to="/my-applications">My applications</NavLink>}
          {user?.role === "RECRUITER" && <NavLink to="/recruiter/jobs">My postings</NavLink>}
          {user && <NavLink to="/profile">Profile</NavLink>}

          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <Link className="btn btn-small" to="/register">Create account</Link>}

          {user && (
            <div className="user-chip">
              <span className="avatar" title={user.fullName}>
                {user.fullName.charAt(0).toUpperCase()}
              </span>
              <button className="btn btn-small btn-outline" onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}