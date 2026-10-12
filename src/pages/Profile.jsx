import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api.js";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import EducationSection from "../components/profile/EducationSection.jsx";
import SkillsSection from "../components/profile/SkillsSection.jsx";
import ResumeSection from "../components/profile/ResumeSection.jsx";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => setError(errMsg(err)));
  }, []);

  if (!profile) {
    return error ? <p className="error">{error}</p> : <p className="muted">Loading your profile...</p>;
  }

  return (
    <div className="profile-page">
      <ProfileHeader profile={profile} onChange={setProfile} />
      <EducationSection profile={profile} onChange={setProfile} />
      <SkillsSection profile={profile} onChange={setProfile} />
      <ResumeSection profile={profile} onChange={setProfile} />

      <section className="card profile-section">
        <div className="section-head">
          <h3>Account</h3>
        </div>

        <div className="account-row">
          <div>
            <h4>Update password</h4>
            <p className="muted">Change the password you use to log in.</p>
          </div>
          <Link className="btn btn-small btn-outline" to="/profile/password">Update password</Link>
        </div>

        <div className="account-row">
          <div>
            <h4>Delete account</h4>
            <p className="muted">Permanently remove your account and everything attached to it.</p>
          </div>
          <Link className="btn btn-small btn-danger" to="/profile/delete">Delete account</Link>
        </div>
      </section>
    </div>
  );
}