// Dashboard.jsx — today view: arrivals, occupancy, recent bookings
const { Pill, Avatar, StatTile, SectionHead } = window.HearthPrimitives;
const { IPhone, IMail, IKey } = window.HearthIcons;

function Dashboard({ bookings, onOpenBooking }) {
  const today = bookings.filter(b => b.status === "arriving");
  const recent = bookings.slice(0, 5);

  return (
    <div>
      <SectionHead eyebrow="Today · Tue Apr 29" title="Three guests, two rooms turned." />

      <div className="stat-grid">
        <StatTile label="Arrivals today" value="3" delta="+1 vs. yesterday" />
        <StatTile label="Occupancy" value="75%" delta="3 of 4 rooms" />
        <StatTile label="Revenue · this week" value="₹84,200" delta="+12%" />
        <StatTile label="Avg. stay" value="2.6 nights" delta="−0.2 nights" deltaDir="down" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <div className="card">
          <h3>Arriving today</h3>
          <div className="subtitle">Doors open at 2:00 PM. Welcome notes are queued.</div>
          {today.length === 0 ? (
            <p style={{ color: "var(--fg-2)" }}>A quiet morning — no arrivals.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {today.map(b => (
                <div key={b.id} onClick={() => onOpenBooking(b)}
                  style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "var(--linen)", cursor: "pointer", border: "1px solid var(--line-1)" }}>
                  <Avatar name={b.guest} tone={b.tone} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--fg-1)" }}>{b.guest}</div>
                    <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{b.room} · {b.nights} nights · ETA {b.eta}</div>
                  </div>
                  <Pill kind="arriving">Arriving</Pill>
                  <button className="btn btn-secondary" onClick={e => { e.stopPropagation(); }}>
                    <IKey size={14} /> Check in
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Today's notes</h3>
          <div className="subtitle">From housekeeping and your morning round.</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--clay)", marginTop: 8, flexShrink: 0 }}></span>
              <div>
                <div style={{ fontSize: 13.5, color: "var(--fg-1)" }}>Garden Suite — replace the towels in the second bathroom; keep the linen.</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>Priya · 8:14 AM</div>
              </div>
            </li>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--moss)", marginTop: 8, flexShrink: 0 }}></span>
              <div>
                <div style={{ fontSize: 13.5, color: "var(--fg-1)" }}>The Loft — Ravi prefers chai over coffee. Note added to his profile.</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>You · yesterday</div>
              </div>
            </li>
            <li style={{ display: "flex", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--honey)", marginTop: 8, flexShrink: 0 }}></span>
              <div>
                <div style={{ fontSize: 13.5, color: "var(--fg-1)" }}>Verandah Room geyser is slow to heat — service due Thursday.</div>
                <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>Manoj · Mon</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionHead eyebrow="Recent" title="Latest bookings" />
        <div className="guest-table">
          <div className="guest-row head">
            <div>Guest</div><div>Room</div><div>Stay</div><div>Status</div><div style={{ textAlign: "right" }}>Total</div>
          </div>
          {recent.map(b => (
            <div key={b.id} className="guest-row" onClick={() => onOpenBooking(b)}>
              <div className="who">
                <Avatar name={b.guest} tone={b.tone} />
                <div>
                  <div className="name">{b.guest}</div>
                  <div className="room-meta">{b.source}</div>
                </div>
              </div>
              <div className="room-meta" style={{ color: "var(--fg-1)", fontSize: 13.5 }}>{b.room}</div>
              <div className="stay-dates">{b.dates}</div>
              <div><Pill kind={b.status}>{b.statusLabel}</Pill></div>
              <div className="total" style={{ textAlign: "right" }}>₹{b.total.toLocaleString("en-IN")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
