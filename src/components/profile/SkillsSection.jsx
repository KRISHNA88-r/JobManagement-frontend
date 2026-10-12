import { useState } from "react";
import api, { errMsg } from "../../api.js";
import SkillPicker from "../SkillPicker.jsx";

export default function SkillsSection({ profile, onChange }) {
  const [error, setError] = useState("");

  const save = async (list) => {
    setError("");
    try {
      const res = await api.put("/profile/skills", { skills: list });
      onChange(res.data);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <section className="card profile-section">
      <div className="section-head">
        <h3>Skills</h3>
      </div>
      <p className="muted">Search for a skill and click it to add it. Skills save as soon as you add them.</p>
      {error && <p className="error">{error}</p>}

      <SkillPicker
        selected={profile.skills}
        onAdd={(name) => save([...profile.skills, name])}
        onRemove={(name) => save(profile.skills.filter((s) => s !== name))}
      />
    </section>
  );
}