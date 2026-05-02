// Guests.jsx — table of guests across all bookings
const { Avatar, Pill, SectionHead } = window.HearthPrimitives;
const { IFilter, IPlus } = window.HearthIcons;

function Guests({ bookings, onOpenBooking }) {
  return (
    <div>
      <SectionHead eyebrow="All time" title="Your guests">
        <button className="btn btn-secondary"><IFilter size={14} /> Filter</button>
        <button className="btn btn-primary"><IPlus size={14} /> Add guest</button>
      </SectionHead>

      <div className="guest-table">
        <div className="guest-row head">
          <div>Guest</div>
          <div>Room</div>
          <div>Stay</div>
          <div>Status</div>
          <div style={{ textAlign: "right" }}>Total</div>
        </div>
        {bookings.map(b => (
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
  );
}

window.Guests = Guests;
