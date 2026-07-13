import react from 'react';

const INDIGO = "#5B4FFF";
const INDIGO_LIGHT = "#7B72FF";
const NAVY = "#0A0E27";
const NAVY2 = "#111530";

export function SmartRentMark({ size = 44 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SmartRent logomark"
    >
      <rect width="44" height="44" rx="10" fill={INDIGO} />

      {/* Chimney */}
      <rect x="27" y="9" width="5" height="10" rx="1.5" fill="white" />

      {/* Roof */}
      <path
        d="M 5 23 L 22 7 L 39 23"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* House body */}
      <rect x="10" y="22" width="24" height="15" rx="2" fill="white" />

      {/* Door */}
      <path
        d="M 18 37 L 18 29 Q 18 27 20 27 L 24 27 Q 26 27 26 29 L 26 37"
        fill={INDIGO}
      />

      {/* Window */}
      <rect x="12" y="25" width="5" height="4" rx="1" fill={INDIGO} />

      {/* Smart pulse dot */}
      <circle cx="37" cy="7" r="3.5" fill={NAVY} />
      <circle cx="37" cy="7" r="1.8" fill="white" />
    </svg>
  );
}

export function SmartRentWordmark({
  size = 44,
  theme = "light",
}) {
  const textColor = theme === "dark" ? "white" : NAVY;
  const subColor = theme === "dark" ? "rgba(255,255,255,0.45)" : "#9CA3AF";

  return (
    <div className="flex items-center gap-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SmartRentMark size={size} />
      <div className="flex flex-col leading-none gap-0.5">
        <span
          style={{
            color: textColor,
            fontSize: size * 0.52,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Smart
          <span style={{ color: INDIGO }}>Rent</span>
        </span>
        <span
          style={{
            color: subColor,
            fontSize: size * 0.22,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Property Management
        </span>
      </div>
    </div>
  );
}

export function SmartRentInline({
  size = 36,
  theme = "light",
}) {
  const textColor = theme === "dark" ? "white" : NAVY;
  return (
    <div className="flex items-center gap-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <SmartRentMark size={size} />
      <span
        style={{
          color: textColor,
          fontSize: size * 0.5,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
      >
        Smart<span style={{ color: INDIGO }}>Rent</span>
      </span>
    </div>
  );
}