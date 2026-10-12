import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { errMsg } from "../api.js";

const EMPTY = { title: "", company: "", location: "", description: "", salary: "", jobType: "Full-time" };

// Used for both "new job" (/recruiter/jobs/new) and "edit job" (/recruiter/jobs/:id/edit)
export default function JobForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    api.get(`/jobs/${id}`)
      .then((res) => {
        const j = res.data;
        setForm({
          title: j.title || "",
          company: j.company || "",
          location: j.location || "",
          description: j.description || "",
          salary: j.salary || "",
          jobType: j.jobType || "Full-time",
        });
      })
      .catch((err) => setError(errMsg(err)));
  }, [id, editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await api.put(`/jobs/${id}`, form);
      else await api.post("/jobs", form);
      navigate("/recruiter/jobs");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{editing ? "Edit job" : "Post a new job"}</h2>
      {error && <p className="error">{error}</p>}

      <label>Job title</label>
      <input name="title" value={form.title} onChange={change} required />

      <label>Company</label>
      <input name="company" value={form.company} onChange={change} required />

      <label>Location</label>
      <input name="location" value={form.location} onChange={change} />

      <label>Job type</label>
      <select name="jobType" value={form.jobType} onChange={change}>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Contract</option>
        <option>Internship</option>
        <option>Remote</option>
      </select>

      <label>Salary</label>
      <input name="salary" value={form.salary} onChange={change} placeholder="e.g. 6-9 LPA" />

      <label>Description</label>
      <textarea name="description" rows={6} value={form.description} onChange={change} />

      <div className="row">
        <button className="btn">{editing ? "Save changes" : "Post job"}</button>
        <button type="button" className="btn btn-outline" onClick={() => navigate("/recruiter/jobs")}>
          Cancel
        </button>
      </div>
    </form>
  );
}