import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errMsg } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import Monogram from "../components/Monogram.jsx";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => setError(errMsg(err)));
  }, [id]);

  const apply = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.post(`/applications/jobs/${id}`, { coverLetter });
      setMessage("Application sent. Follow its status under My applications.");
      setCoverLetter("");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (!job) return error ? <p className="error">{error}</p> : <p className="muted">Loading job...</p>;

  const isOwner = user?.role === "RECRUITER" && user.id === job.recruiterId;

  return (
    <div>
      <p><Link to="/jobs">Back to all jobs</Link></p>

      <div className="detail-head">
        <Monogram name={job.company} size={64} />
        <div>
          <h1>{job.title}</h1>
          <p className="job-company">{job.company}</p>
          <div className="chips">
            {job.location && <span className="chip">{job.location}</span>}
            {job.jobType && <span className="chip">{job.jobType}</span>}
            {job.salary && <span className="chip chip-salary">{job.salary}</span>}
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <section className="card">
          <h3>About this role</h3>
          <p className="pre">{job.description || "The recruiter has not added a description yet."}</p>
          <p className="muted">Posted by {job.recruiterName}</p>
        </section>

        <aside className="card side-card">
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          {!user && (
            <>
              <h3>Interested in this role?</h3>
              <p className="muted">Log in as a job seeker to apply.</p>
              <div className="row">
                <Link className="btn" to="/login">Log in</Link>
                <Link className="btn btn-outline" to="/register">Create account</Link>
              </div>
            </>
          )}

          {user?.role === "JOB_SEEKER" && (
            <form className="form" style={{ margin: 0 }} onSubmit={apply}>
              <h3>Apply for this job</h3>
              <label>Cover letter (optional)</label>
              <textarea
                rows={6}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the recruiter why you are a good fit"
              />
              <button className="btn">Send application</button>
            </form>
          )}

          {user?.role === "RECRUITER" && (
            <>
              <h3>{isOwner ? "Your posting" : "Recruiter view"}</h3>
              {isOwner ? (
                <div className="row">
                  <Link className="btn" to={`/recruiter/jobs/${job.id}/applicants`}>View applicants</Link>
                  <Link className="btn btn-outline" to={`/recruiter/jobs/${job.id}/edit`}>Edit job</Link>
                </div>
              ) : (
                <p className="muted">Only job seekers can apply. This posting belongs to another recruiter.</p>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}