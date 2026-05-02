// BookingDrawer.jsx — slide-in for editing/viewing a booking
const { Pill, Avatar, Field } = window.HearthPrimitives;
const { IClose, IPhone, IMail, IKey } = window.HearthIcons;

function BookingDrawer({ booking, open, onClose }) {
  return (
    <React.Fragment>
      <div className={`drawer-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`drawer ${open ? "open" : ""}`} role="dialog">
        {booking && (
          <React.Fragment>
            <div className="drawer-head">
              <Avatar name={booking.guest} tone={booking.tone || "moss"} size={42} />
              <div>
                <h3>{booking.guest}</h3>
                <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 2 }}>
                  Booking <span className="mono" style={{ fontFamily: "var(--font-mono)" }}>HRT-2401-{booking.id?.toUpperCase?.()}</span>
                </div>
              </div>
              <button className="btn-icon close" onClick={onClose}><IClose size={16} /></button>
            </div>

            <div className="drawer-body">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Pill kind={booking.status || "confirmed"}>{booking.statusLabel || "Confirmed"}</Pill>
                <span style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{booking.source || "Direct booking"}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Check-in"><input defaultValue={booking.checkIn || "Tue, Apr 29"} /></Field>
                <Field label="Check-out"><input defaultValue={booking.checkOut || "Fri, May 2"} /></Field>
              </div>

              <Field label="Room">
                <select defaultValue={booking.room || "Garden Suite"}>
                  <option>Garden Suite</option>
                  <option>The Loft</option>
                  <option>Verandah Room</option>
                  <option>Writer's Nook</option>
                </select>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Guests"><input defaultValue="2 adults" /></Field>
                <Field label="Rate / night"><input defaultValue="₹4,200" /></Field>
              </div>

              <div style={{ borderTop: "1px solid var(--line-1)", paddingTop: 16, marginTop: 4 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Contact</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--fg-1)", fontSize: 14 }}>
                    <IPhone size={16} style={{ color: "var(--fg-2)" }} /> +91 98xxx 21xxx
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--fg-1)", fontSize: 14 }}>
                    <IMail size={16} style={{ color: "var(--fg-2)" }} /> {booking.guest?.split(" ")[0]?.toLowerCase()}@example.com
                  </div>
                </div>
              </div>

              <Field label="Note for the host" help="Visible only to you and your team.">
                <textarea rows="3" defaultValue="Prefers chai over coffee. Late check-in around 9pm."></textarea>
              </Field>
            </div>

            <div className="drawer-foot">
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-clay"><IKey size={14} /> Check in</button>
              <button className="btn btn-primary">Save</button>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

window.BookingDrawer = BookingDrawer;
