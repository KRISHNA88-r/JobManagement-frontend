import { useState } from "react";
import { findSkill } from "../data/skillCatalog.js";

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";

// Shows the technology logo. If there is no logo (or it fails to load), shows the first letter.
export default function SkillIcon({ name, size = 22 }) {
  const slug = findSkill(name)?.icon;
  const [failed, setFailed] = useState(false);

  if (!slug || failed) {
    return (
      <span
        className="skill-fallback"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
        aria-hidden="true"
      >
        {name.trim().charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className="skill-img"
      src={`${CDN}/${slug}/${slug}-original.svg`}
      width={size}
      height={size}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}