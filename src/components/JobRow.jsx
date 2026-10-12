import { Link } from "react-router-dom";
import Monogram from "./Monogram.jsx";

function posted(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (Number.isNaN(days) || days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  return `Posted ${days} days ago`;
}

export default function JobRow({ job }) {
  return (
    <Link to={`/jobs/${job.id}`} className="job-row">
      <Monogram name={job.company} />
      <div className="job-main">
        <h3>{job.title}</h3>
        <p className="job-company">{job.company}</p>
        <div className="chips">
          {job.location && <span className="chip">{job.location}</span>}
          {job.jobType && <span className="chip">{job.jobType}</span>}
          {job.salary && <span className="chip chip-salary">{job.salary}</span>}
        </div>
      </div>
      <div className="job-side">
        <span>{posted(job.createdAt)}</span>
        <span className="btn btn-small btn-outline">View role</span>
      </div>
    </Link>
  );
}