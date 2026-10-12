import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { errMsg } from "../api.js";
import JobRow from "../components/JobRow.jsx";

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const urlKeyword = params.get("keyword") || "";

  const [keyword, setKeyword] = useState(urlKeyword);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // reload whenever the ?keyword= in the address bar changes
  useEffect(() => {
    setLoading(true);
    setError("");
    api.get("/jobs", { params: urlKeyword ? { keyword: urlKeyword } : {} })
      .then((res) => setJobs(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [urlKeyword]);

  const search = (e) => {
    e.preventDefault();
    const kw = keyword.trim();
    setParams(kw ? { keyword: kw } : {});
  };

  const clear = () => {
    setKeyword("");
    setParams({});
  };

  return (
    <div>
      <div className="page-head">
        <h2>Open jobs</h2>
        {!loading && <span className="muted">{jobs.length} {jobs.length === 1 ? "role" : "roles"}</span>}
      </div>

      <form className="row" onSubmit={search}>
        <input
          className="grow"
          placeholder="Job title, company or city"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Search jobs"
        />
        <button className="btn">Search</button>
        {urlKeyword && <button type="button" className="btn btn-outline" onClick={clear}>Clear</button>}
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading jobs...</p>}

      {!loading && !error && jobs.length === 0 && (
        <div className="empty">
          {urlKeyword
            ? `No jobs match "${urlKeyword}". Try a shorter keyword or clear the search.`
            : "No jobs are posted yet. Check back soon."}
        </div>
      )}

      <div className="list">
        {jobs.map((j) => <JobRow key={j.id} job={j} />)}
      </div>
    </div>
  );
}