import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errMsg } from "../api.js";
import Avatar from "../components/Avatar.jsx";

const OTHER_STATUSES = [
  ["UNDER_REVIEW", "Under review"],
  ["HIRED", "Hired"],
];

const LABELS = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under review",
  SHORTLISTED: "Accepted (shortlisted)",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

export default function JobApplicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState({}); // applicationId -> profile
  const [open, setOpen] = useState({}); // applicationId -> true/false
  const [notes, setNotes] = useState({}); // applicationId -> text

  useEffect(() => {
    Promise.all([api.get(`/jobs/${id}`), api.get(`/applications/job/${id}`)])
      .then(([j, a]) => {
        setJob(j.data);
        setApps(a.data);
      })
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleProfile = async (appId) => {
    const isOpen = !open[appId];
    setOpen({ ...open, [appId]: isOpen });
    if (isOpen && !profiles[appId]) {
      try {
        const res = await api.get(`/applications/${appId}/applicant`);
        setProfiles((p) => ({ ...p, [appId]: res.data }));
      } catch (err) {
        setError(errMsg(err));
      }
    }
  };

  const decide = async (a, status) => {
    setError("");
    setMessage("");
    try {
      const res = await api.put(`/applications/${a.id}/status`, {
        status,
        note: notes[a.id] || "",
      });
      setApps((list) => list.map((x) => (x.id === a.id ? res.data : x)));
      setNotes((n) => ({ ...n, [a.id]: "" }));
      setMessage(`${a.applicantName} was notified: ${LABELS[status] || status}.`);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const downloadResume = async (a, profile) => {
    try {
      const res = await api.get(`/applications/${a.id}/resume`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = profile?.resumeName || "resume";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not download the resume.");
    }
  };

  return (
    <div>
      <p><Link to="/recruiter/jobs">← Back to my postings</Link></p>
      <h2>Applicants{job ? ` for ${job.title}` : ""}</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {loading && <p className="muted">Loading...</p>}
      {!loading && !error && apps.length === 0 && <p className="muted">No applications yet.</p>}

      {apps.map((a) => {
        const profile = profiles[a.id];
        return (
          <div className="card applicant" key={a.id}>
            <div className="applicant-head">
              <Avatar
                userId={a.applicantId}
                name={a.applicantName}
                version={0}
                size={48}
                hasPhoto={true}
              />
              <div className="grow">
                <h3>{a.applicantName}</h3>
                <p className="muted">
                  {a.applicantEmail} · Applied {a.appliedAt.replace("T", " ").slice(0, 16)}
                </p>
              </div>
              <span className={`badge badge-${a.status}`}>{LABELS[a.status] || a.status}</span>
            </div>

            {a.coverLetter && (
              <>
                <strong>Cover letter</strong>
                <p className="pre">{a.coverLetter}</p>
              </>
            )}

            <button type="button" className="btn btn-small btn-outline" onClick={() => toggleProfile(a.id)}>
              {open[a.id] ? "Hide profile" : "View profile"}
            </button>

            {open[a.id] && (
              <div className="applicant-profile">
                {!profile && <p className="muted">Loading profile...</p>}
                {profile && (
                  <>
                    {profile.headline && <p><strong>{profile.headline}</strong></p>}
                    <p className="muted">
                      {[profile.location, profile.phone].filter(Boolean).join(" · ") || "No contact details added."}
                    </p>
                    {profile.about && <p className="pre">{profile.about}</p>}

                    <strong>Skills</strong>
                    {profile.skills?.length ? (
                      <div className="skill-chips">
                        {profile.skills.map((s) => (
                          <span className="skill-chip" key={s}>{s}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="muted">No skills added.</p>
                    )}

                    <strong>Education</strong>
                    {profile.education?.length ? (
                      profile.education.map((e) => (
                        <p key={e.id}>
                          {e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""} at {e.school}
                          <span className="muted">
                            {" "}({e.startYear || "?"} - {e.endYear || "present"})
                          </span>
                        </p>
                      ))
                    ) : (
                      <p className="muted">No education added.</p>
                    )}

                    <strong>Resume</strong>
                    {profile.resumeName ? (
                      <p>
                        <button type="button" className="link-btn" onClick={() => downloadResume(a, profile)}>
                          Download {profile.resumeName}
                        </button>
                      </p>
                    ) : (
                      <p className="muted">No resume uploaded.</p>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="decision">
              <label>Message to the applicant (optional)</label>
              <textarea
                rows={2}
                maxLength={500}
                placeholder="For example: Please come for an interview on Monday at 10 AM."
                value={notes[a.id] || ""}
                onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })}
              />
              <div className="row">
                <button type="button" className="btn btn-small" onClick={() => decide(a, "SHORTLISTED")}>
                  Accept
                </button>
                <button type="button" className="btn btn-small btn-danger" onClick={() => decide(a, "REJECTED")}>
                  Reject
                </button>
                {OTHER_STATUSES.map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    className="btn btn-small btn-outline"
                    onClick={() => decide(a, value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}