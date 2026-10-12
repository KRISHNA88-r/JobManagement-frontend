import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api.js";
import Monogram from "../components/Monogram.jsx";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs/mine")
      .then((res) => setJobs(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this job and all its applications?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>My job postings</h2>
        <Link className="btn" to="/recruiter/jobs/new">Post a new job</Link>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading your postings...</p>}

      {!loading && !error && jobs.length === 0 && (
        <div className="empty">
          You have not posted any jobs yet. <Link to="/recruiter/jobs/new">Post your first job</Link> and
          applicants will appear here.
        </div>
      )}

      <div className="list">
        {jobs.map((j) => (
          <div className="job-row" key={j.id}>
            <Monogram name={j.company} />
            <div className="job-main">
              <h3><Link to={`/jobs/${j.id}`}>{j.title}</Link></h3>
              <p className="job-company">{j.company}</p>
              <div className="chips">
                {j.location && <span className="chip">{j.location}</span>}
                {j.jobType && <span className="chip">{j.jobType}</span>}
                {j.salary && <span className="chip chip-salary">{j.salary}</span>}
              </div>
            </div>
            <div className="job-side">
              <div className="job-actions">
                <Link className="btn btn-small" to={`/recruiter/jobs/${j.id}/applicants`}>Applicants</Link>
                <Link className="btn btn-small btn-outline" to={`/recruiter/jobs/${j.id}/edit`}>Edit</Link>
                <button className="btn btn-small btn-outline" onClick={() => remove(j.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}