const PALETTE = [
  ["#d9efee", "#0b5f5e"],
  ["#e3e8fb", "#33449b"],
  ["#f3e3ef", "#7a2b66"],
  ["#fbebd0", "#8a5a12"],
  ["#e6eaee", "#3b4a5a"],
  ["#fbe4e1", "#8f3a30"],
];

// Square tile with the company's first letter; the colour is picked from the name
export default function Monogram({ name, size = 48 }) {
  const text = (name || "?").trim() || "?";
  let sum = 0;
  for (const ch of text) sum += ch.charCodeAt(0);
  const [bg, fg] = PALETTE[sum % PALETTE.length];

  return (
    <span
      className="monogram"
      style={{ background: bg, color: fg, width: size, height: size }}
      aria-hidden="true"
    >
      {text.charAt(0).toUpperCase()}
    </span>
  );
}