import { useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api.js";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.newPassword !== form.confirm) {
      setError("The new passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await api.put("/users/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
      setMessage("Your password has been updated.");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p><Link to="/profile">Back to profile</Link></p>

      <form className="card form" onSubmit={submit}>
        <h2>Update password</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <label>Current password</label>
        <input
          type="password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={change}
          required
        />

        <label>New password (at least 6 characters)</label>
        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={change}
          required
          minLength={6}
        />

        <label>Confirm new password</label>
        <input
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={change}
          required
          minLength={6}
        />

        <button className="btn" disabled={busy}>{busy ? "Updating..." : "Update password"}</button>
      </form>
    </div>
  );
}