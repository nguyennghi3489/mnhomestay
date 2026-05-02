// primitives.jsx — Pill, Avatar, Field, EmptyState, StatTile

const Pill = ({ kind = "confirmed", children }) => (
  <span className={`pill pill-${kind}`}><span className="dot" />{children}</span>
);

const Avatar = ({ name, tone = "moss", size = 38 }) => {
  const initials = name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  const tones = { moss: "", clay: "clay", bark: "bark" };
  return (
    <div className={`avatar ${tones[tone] || ""}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {initials}
    </div>
  );
};

const Field = ({ label, help, children, error }) => (
  <div className="field">
    {label && <label>{label}</label>}
    {children}
    {error && <span className="help" style={{ color: "var(--ember)" }}>{error}</span>}
    {help && !error && <span className="help">{help}</span>}
  </div>
);

const StatTile = ({ label, value, delta, deltaDir = "up" }) => (
  <div className="stat">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
    {delta && <div className={`delta ${deltaDir === "down" ? "down" : ""}`}>{delta}</div>}
  </div>
);

const EmptyState = ({ title, body, action }) => (
  <div className="empty">
    <img className="sprig" src="../../assets/sprig.svg" alt="" />
    <h3>{title}</h3>
    <p>{body}</p>
    {action}
  </div>
);

const SectionHead = ({ eyebrow, title, children }) => (
  <div className="section-head">
    <div>
      {eyebrow && <div className="eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>}
      <h2>{title}</h2>
    </div>
    <div className="actions">{children}</div>
  </div>
);

window.HearthPrimitives = { Pill, Avatar, Field, StatTile, EmptyState, SectionHead };
