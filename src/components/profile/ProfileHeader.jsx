import { useRef, useState } from "react";
import api, { errMsg } from "../../api.js";
import { useAuth } from "../../AuthContext.jsx";
import Avatar from "../Avatar.jsx";
import { resizeImage } from "../../utils/resizeImage.js";
export default function ProfileHeader({ profile, onChange }) {
  const { login, refreshAvatar } = useAuth();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const startEdit = () => {
    setForm({
      fullName: profile.fullName,
      email: profile.email,
      headline: profile.headline || "",
      location: profile.location || "",
      phone: profile.phone || "",
      about: profile.about || "",
    });
    setError("");
    setMessage("");
    setEditing(true);
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      // 1) profile details (still uses the current login token)
      let updated = (
        await api.put("/profile", {
          headline: form.headline,
          location: form.location,
          phone: form.phone,
          about: form.about,
        })
      ).data;
      onChange(updated);

      // 2) name and email (the backend sends back a fresh token because the email may change)
      if (form.fullName !== profile.fullName || form.email !== profile.email) {
        const res = await api.put("/users/me", { fullName: form.fullName, email: form.email });
        login(res.data);
        updated = { ...updated, fullName: res.data.user.fullName, email: res.data.user.email };
        onChange(updated);
      }

      setEditing(false);
      setMessage("Profile saved.");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  
        const pickPhoto = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("That image is too large. Choose one under 20 MB.");
      return;
    }

    setError("");
    setMessage("");
    setBusy(true);
    try {
      const small = await resizeImage(file);
      const data = new FormData();
      data.append("file", small);
      const res = await api.post("/profile/photo", data);
      onChange(res.data);
      refreshAvatar();
      setMessage("Photo updated.");
    } catch (err) {
      setError(err.isAxiosError ? errMsg(err) : err.message);
    } finally {
      setBusy(false);
    }
  };
  const removePhoto = async () => {
    setError("");
    setMessage("");
    try {
      const res = await api.delete("/profile/photo");
      onChange(res.data);
      refreshAvatar();
      setMessage("Photo removed.");
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <>
      <section className="card profile-top">
        <div className="profile-cover" />
        <div className="profile-body">
          <div className="profile-avatar-wrap">
            <Avatar
              userId={profile.userId}
              name={profile.fullName}
              version={profile.photoVersion || 0}
              size={112}
              hasPhoto={profile.hasPhoto}
            />
          </div>

          <div className="photo-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={pickPhoto}
            />
            <button
              type="button"
              className="btn btn-small btn-outline"
              disabled={busy}
              onClick={() => fileRef.current.click()}
            >
              {profile.hasPhoto ? "Change photo" : "Upload photo"}
            </button>
            {profile.hasPhoto && (
              <button type="button" className="link-btn" onClick={removePhoto}>
                Remove photo
              </button>
            )}
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          {!editing ? (
            <>
              <div className="profile-name-row">
                <div>
                  <h1>{profile.fullName}</h1>
                  <p className="profile-headline">
                    {profile.headline || (
                      <span className="muted">Add a headline, for example "Final-year CSE student".</span>
                    )}
                  </p>
                </div>
                <button type="button" className="btn btn-small btn-outline" onClick={startEdit}>
                  Edit profile
                </button>
              </div>

              <ul className="profile-contact">
                <li>{profile.role === "RECRUITER" ? "Recruiter" : "Job seeker"}</li>
                {profile.location && <li>{profile.location}</li>}
                <li>{profile.email}</li>
                {profile.phone && <li>{profile.phone}</li>}
              </ul>
            </>
          ) : (
            <form className="profile-form" onSubmit={save}>
              <label>Full name</label>
              <input name="fullName" value={form.fullName} onChange={change} required />

              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={change} required />

              <label>Headline</label>
              <input
                name="headline"
                value={form.headline}
                onChange={change}
                maxLength={120}
                placeholder="e.g. Final-year CSE student, Java developer"
              />

              <div className="field-pair">
                <div>
                  <label>Location</label>
                  <input name="location" value={form.location} onChange={change} placeholder="City, State" />
                </div>
                <div>
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={change} maxLength={30} />
                </div>
              </div>

              <label>About</label>
              <textarea
                name="about"
                rows={5}
                value={form.about}
                onChange={change}
                maxLength={2000}
                placeholder="A short summary of your background and what you are looking for"
              />

              <div className="row">
                <button className="btn" disabled={busy}>
                  {busy ? "Saving..." : "Save changes"}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="card profile-section">
        <div className="section-head">
          <h3>About</h3>
        </div>
        {profile.about ? (
          <p className="pre">{profile.about}</p>
        ) : (
          <p className="muted">
            Tell recruiters about yourself. Choose "Edit profile" above to write a short summary.
          </p>
        )}
      </section>
    </>
  );
}