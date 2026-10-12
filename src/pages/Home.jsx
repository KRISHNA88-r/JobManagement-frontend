import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import JobRow from "../components/JobRow.jsx";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    api.get("/jobs")
      .then((res) => setLatest(res.data.slice(0, 4)))
      .catch(() => setLatest([]));
  }, []);

  const search = (e) => {
    e.preventDefault();
    const kw = keyword.trim();
    navigate(kw ? `/jobs?keyword=${encodeURIComponent(kw)}` : "/jobs");
  };

  return (
    <div>
      <section className="hero-band">
        <h1>Find a job you actually want.</h1>
        <p>
          Search open roles, apply with a short cover letter, and see exactly where
          each application stands.
        </p>

        <form className="search" onSubmit={search}>
          <input
            placeholder="Job title, company or city"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-label="Search jobs"
          />
          <button className="btn btn-accent">Search jobs</button>
        </form>

        <p className="hero-links">
          {!user && <>Hiring? <Link to="/register">Create a recruiter account</Link> and post your first job.</>}
          {user?.role === "RECRUITER" && <Link to="/recruiter/jobs/new">Post a new job</Link>}
          {user?.role === "JOB_SEEKER" && <Link to="/my-applications">Check your applications</Link>}
        </p>
      </section>

      <div className="page-head">
        <h2>Latest openings</h2>
        <Link to="/jobs">See all jobs</Link>
      </div>

      {latest.length === 0 ? (
        <div className="empty">No jobs are posted yet. Recruiters can add the first one from their dashboard.</div>
      ) : (
        <div className="list">
          {latest.map((j) => <JobRow key={j.id} job={j} />)}
        </div>
      )}
    </div>
  );
}