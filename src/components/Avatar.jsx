import { useEffect, useState } from "react";
import api from "../api.js";

// Round profile picture. Falls back to the first letter of the name when there is no photo.
export default function Avatar({ userId, name, version = 0, size = 40, hasPhoto = true }) {
  const src = `${api.defaults.baseURL}/profile/photo/${userId}?v=${version}`;
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  const showImage = hasPhoto && !failed;

  return (
    <span className="pic" style={{ width: size, height: size, fontSize: size * 0.42 }}>
      {showImage ? (
        <img src={src} alt={`${name || "User"} profile photo`} onError={() => setFailed(true)} />
      ) : (
        initial
      )}
    </span>
  );
}