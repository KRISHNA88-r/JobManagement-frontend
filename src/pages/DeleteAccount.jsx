import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function DeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.delete("/users/me", { data: { password } });
      alert("Your account has been deleted.");
      navigate("/", { replace: true });
      logout();
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div>
      <p><Link to="/profile">Back to profile</Link></p>

      <form className="card form danger-zone" onSubmit={submit}>
        <h2>Delete account</h2>
        <p className="muted">
          This permanently deletes your account, profile, photo and resume. Recruiters also lose
          their job postings and the applications on them. This cannot be undone.
        </p>
        {error && <p className="error">{error}</p>}

        <label>Confirm with your password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-danger" disabled={busy}>
          {busy ? "Deleting..." : "Delete my account"}
        </button>
      </form>
    </div>
  );
}