import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "JOB_SEEKER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/users/register", form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}

      <label>Full name</label>
      <input name="fullName" value={form.fullName} onChange={change} required />

      <label>Email</label>
      <input type="email" name="email" value={form.email} onChange={change} required />

      <label>Password (min 6 characters)</label>
      <input type="password" name="password" value={form.password} onChange={change} required minLength={6} />

      <label>I am a</label>
      <select name="role" value={form.role} onChange={change}>
        <option value="JOB_SEEKER">Job seeker</option>
        <option value="RECRUITER">Recruiter</option>
      </select>

      <button className="btn" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}