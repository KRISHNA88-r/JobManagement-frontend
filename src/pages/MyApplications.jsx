import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api.js";
import Monogram from "../components/Monogram.jsx";

const LABELS = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/mine")
      .then((res) => setApps(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      setApps(apps.filter((a) => a.id !== id));
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>My applications</h2>
        {!loading && <span className="muted">{apps.length} total</span>}
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading your applications...</p>}

      {!loading && !error && apps.length === 0 && (
        <div className="empty">
          You have not applied to any jobs yet. <Link to="/jobs">Browse open roles</Link> to get started.
        </div>
      )}

      <div className="list">
        {apps.map((a) => (
          <div className="job-row" key={a.id}>
            <Monogram name={a.company} />
            <div className="job-main">
              <h3><Link to={`/jobs/${a.jobId}`}>{a.jobTitle}</Link></h3>
              <p className="job-company">{a.company}</p>
              <div className="chips">
                <span className={`badge badge-${a.status}`}>{LABELS[a.status] || a.status}</span>
                <span className="chip">Applied on {a.appliedAt.slice(0, 10)}</span>
              </div>
            </div>
            <div className="job-side">
              <button className="btn btn-small btn-outline" onClick={() => withdraw(a.id)}>Withdraw</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}