import { useRef, useState } from "react";
import api, { errMsg } from "../../api.js";

export default function ResumeSection({ profile, onChange }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const upload = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!/\.(pdf|docx?)$/i.test(file.name)) {
      setError("Upload a PDF or Word file (.pdf, .doc, .docx).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("The resume must be 5 MB or smaller.");
      return;
    }

    setError("");
    setMessage("");
    setBusy(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await api.post("/profile/resume", data);
      onChange(res.data);
      setMessage("Resume uploaded.");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    setError("");
    try {
      const res = await api.get("/profile/resume", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = profile.resumeName || "resume";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async () => {
    if (!window.confirm("Remove your resume?")) return;
    setError("");
    setMessage("");
    try {
      const res = await api.delete("/profile/resume");
      onChange(res.data);
      setMessage("Resume removed.");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <section className="card profile-section">
      <div className="section-head">
        <h3>Resume</h3>
      </div>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={upload} />

      {profile.resumeName ? (
        <div className="resume-row">
          <div className="resume-file">
            <span className="resume-icon" aria-hidden="true">
              {profile.resumeName.split(".").pop().toUpperCase()}
            </span>
            <span className="resume-name">{profile.resumeName}</span>
          </div>
          <div className="row">
            <button type="button" className="btn btn-small" onClick={download}>Download</button>
            <button
              type="button"
              className="btn btn-small btn-outline"
              disabled={busy}
              onClick={() => fileRef.current.click()}
            >
              {busy ? "Uploading..." : "Replace"}
            </button>
            <button type="button" className="link-btn" onClick={remove}>Remove</button>
          </div>
        </div>
      ) : (
        <div className="empty">
          <p>No resume uploaded yet. PDF or Word, up to 5 MB.</p>
          <button
            type="button"
            className="btn"
            disabled={busy}
            onClick={() => fileRef.current.click()}
          >
            {busy ? "Uploading..." : "Upload resume"}
          </button>
        </div>
      )}
    </section>
  );
}