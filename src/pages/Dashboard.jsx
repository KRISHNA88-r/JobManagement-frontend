import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const isSeeker = user.role === "JOB_SEEKER";
  const [items, setItems] = useState([]);

  useEffect(() => {
    const url = isSeeker ? "/applications/mine" : "/jobs/mine";
    api.get(url).then((res) => setItems(res.data)).catch(() => setItems([]));
  }, [isSeeker]);

  const count = (status) => items.filter((a) => a.status === status).length;

  return (
    <div>
      <h2>Welcome, {user.fullName}</h2>
      <p className="muted">
        Signed in as {user.email} ({isSeeker ? "Job seeker" : "Recruiter"})
      </p>

      {isSeeker ? (
        <>
          <div className="stats">
            <div className="card stat"><b>{items.length}</b><span>Applications</span></div>
            <div className="card stat"><b>{count("UNDER_REVIEW")}</b><span>Under review</span></div>
            <div className="card stat"><b>{count("SHORTLISTED")}</b><span>Shortlisted</span></div>
            <div className="card stat"><b>{count("HIRED")}</b><span>Hired</span></div>
          </div>
          <div className="row">
            <Link className="btn" to="/jobs">Search jobs</Link>
            <Link className="btn btn-outline" to="/my-applications">View my applications</Link>
          </div>
        </>
      ) : (
        <>
          <div className="stats">
            <div className="card stat"><b>{items.length}</b><span>Active job postings</span></div>
          </div>
          <div className="row">
            <Link className="btn" to="/recruiter/jobs/new">Post a new job</Link>
            <Link className="btn btn-outline" to="/recruiter/jobs">Manage my postings</Link>
          </div>
        </>
      )}
    </div>
  );
}