import { useMemo, useRef, useState } from "react";
import { searchSkills } from "../data/skillCatalog.js";
import SkillIcon from "./SkillIcon.jsx";

export default function SkillPicker({ selected, onAdd, onRemove }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const q = query.trim();
  const alreadyHas = q !== "" && selected.some((s) => s.toLowerCase() === q.toLowerCase());

  const options = useMemo(() => {
    if (!q) return [];
    const found = searchSkills(q, selected).map((s) => ({ name: s.name, custom: false }));
    const exact = found.some((o) => o.name.toLowerCase() === q.toLowerCase());
    if (!exact && !alreadyHas && q.length <= 50) found.push({ name: q, custom: true });
    return found;
  }, [q, selected, alreadyHas]);

  const pick = (name) => {
    onAdd(name);
    setQuery("");
    setActive(0);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(options.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && options[active]) pick(options[active].name);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && q !== "" && (options.length > 0 || alreadyHas);

  return (
    <div className="picker">
      <div
        className="picker-box"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
      >
        <div className="picker-field">
          <input
            ref={inputRef}
            value={query}
            placeholder="Search skills, for example C Programming"
            aria-label="Search skills"
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />

          {showList && (
            <ul className="picker-list">
              {options.map((o, i) => (
                <li key={o.name + o.custom}>
                  <button
                    type="button"
                    className={i === active ? "picker-option active" : "picker-option"}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(o.name)}
                  >
                    <SkillIcon name={o.name} size={24} />
                    <span>{o.custom ? `Add "${o.name}" as a new skill` : o.name}</span>
                  </button>
                </li>
              ))}
              {options.length === 0 && alreadyHas && (
                <li className="picker-note">"{q}" is already in your skills.</li>
              )}
            </ul>
          )}
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
        >
          Search
        </button>
      </div>

      {selected.length === 0 ? (
        <p className="muted picker-empty">No skills yet. Search above and click a skill to add it.</p>
      ) : (
        <ul className="skill-chips">
          {selected.map((name) => (
            <li className="skill-chip" key={name}>
              <SkillIcon name={name} size={22} />
              <span>{name}</span>
              <button type="button" aria-label={`Remove ${name}`} onClick={() => onRemove(name)}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}