import { useState } from "react";
import api, { errMsg } from "../../api.js";
import Monogram from "../Monogram.jsx";

const EMPTY = { school: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", description: "" };

function years(e) {
  if (!e.startYear && !e.endYear) return "";
  if (!e.startYear) return String(e.endYear);
  return `${e.startYear} to ${e.endYear || "Present"}`;
}

export default function EducationSection({ profile, onChange }) {
  const [editingId, setEditingId] = useState(null); // null = closed, "new" = adding, or an id
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const openNew = () => {
    setForm(EMPTY);
    setError("");
    setEditingId("new");
  };

  const openEdit = (e) => {
    setForm({
      school: e.school || "",
      degree: e.degree || "",
      fieldOfStudy: e.fieldOfStudy || "",
      startYear: e.startYear ?? "",
      endYear: e.endYear ?? "",
      description: e.description || "",
    });
    setError("");
    setEditingId(e.id);
  };

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const payload = {
      ...form,
      startYear: form.startYear === "" ? null : Number(form.startYear),
      endYear: form.endYear === "" ? null : Number(form.endYear),
    };
    try {
      const res =
        editingId === "new"
          ? await api.post("/profile/education", payload)
          : await api.put(`/profile/education/${editingId}`, payload);
      onChange(res.data);
      setEditingId(null);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this education entry?")) return;
    try {
      const res = await api.delete(`/profile/education/${id}`);
      onChange(res.data);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const formUi = (
    <form className="profile-form" onSubmit={save}>
      {error && <p className="error">{error}</p>}

      <label>School or college</label>
      <input name="school" value={form.school} onChange={change} required maxLength={120} />

      <div className="field-pair">
        <div>
          <label>Degree</label>
          <input name="degree" value={form.degree} onChange={change} placeholder="e.g. B.Tech" maxLength={120} />
        </div>
        <div>
          <label>Field of study</label>
          <input
            name="fieldOfStudy"
            value={form.fieldOfStudy}
            onChange={change}
            placeholder="e.g. Computer Science"
            maxLength={120}
          />
        </div>
      </div>

      <div className="field-pair">
        <div>
          <label>Start year</label>
          <input type="number" name="startYear" value={form.startYear} onChange={change} min="1950" max="2100" />
        </div>
        <div>
          <label>End year (leave empty if you are still studying)</label>
          <input type="number" name="endYear" value={form.endYear} onChange={change} min="1950" max="2100" />
        </div>
      </div>

      <label>Description (optional)</label>
      <textarea
        name="description"
        rows={3}
        value={form.description}
        onChange={change}
        maxLength={1000}
        placeholder="Grades, projects, activities"
      />

      <div className="row">
        <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save education"}</button>
        <button type="button" className="btn btn-outline" onClick={() => setEditingId(null)}>
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <section className="card profile-section">
      <div className="section-head">
        <h3>Education</h3>
        {editingId === null && (
          <button type="button" className="btn btn-small btn-outline" onClick={openNew}>
            Add education
          </button>
        )}
      </div>

      {editingId === "new" && formUi}

      {profile.education.length === 0 && editingId === null && (
        <p className="muted">Add your school, college or courses so recruiters can see your background.</p>
      )}

      <ul className="edu-list">
        {profile.education.map((e) => (
          <li className="edu-item" key={e.id}>
            {editingId === e.id ? (
              <div className="edu-edit">{formUi}</div>
            ) : (
              <>
                <Monogram name={e.school} size={44} />
                <div className="edu-main">
                  <h4>{e.school}</h4>
                  {(e.degree || e.fieldOfStudy) && (
                    <p>{[e.degree, e.fieldOfStudy].filter(Boolean).join(", ")}</p>
                  )}
                  {years(e) && <p className="muted">{years(e)}</p>}
                  {e.description && <p className="pre">{e.description}</p>}
                </div>
                <div className="edu-actions">
                  <button type="button" className="link-btn" onClick={() => openEdit(e)}>Edit</button>
                  <button type="button" className="link-btn" onClick={() => remove(e.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}