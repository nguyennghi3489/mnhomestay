// Calendar.jsx — room × day grid
// Bars render in a single absolute overlay per row, using percentage widths
// over the 7-day track, so spans never overflow the grid.
const { SectionHead } = window.HearthPrimitives;
const { IFilter, IChevron } = window.HearthIcons;

function Calendar({ bookings, onOpenBooking }) {
  const days = [
    { d: "Mon", n: "28" },
    { d: "Tue", n: "29", today: true },
    { d: "Wed", n: "30" },
    { d: "Thu", n: "01" },
    { d: "Fri", n: "02" },
    { d: "Sat", n: "03" },
    { d: "Sun", n: "04" },
  ];
  const rooms = [
    { id: "garden", name: "Garden Suite", meta: "King · ₹4,200" },
    { id: "loft", name: "The Loft", meta: "Queen · ₹3,400" },
    { id: "verandah", name: "Verandah Room", meta: "Twin · ₹2,800" },
    { id: "writers", name: "Writer's Nook", meta: "Single · ₹2,100" },
  ];

  const schedule = {
    garden: [{ start: 1, span: 3, label: "Aanya Iyer", kind: "arriving", bookingId: "b1" }],
    loft:   [{ start: 0, span: 2, label: "Ravi Menon", kind: "arriving", bookingId: "b2" },
             { start: 4, span: 3, label: "Sara Khan", kind: "moss", bookingId: "b3" }],
    verandah: [{ start: 3, span: 2, label: "Liu Wei", kind: "moss", bookingId: "b4" }],
    writers: [{ start: 5, span: 2, label: "Blocked · maintenance", kind: "blocked" }],
  };

  const COLS = 7;

  return (
    <div>
      <SectionHead eyebrow="This week" title="Apr 28 – May 4">
        <button className="btn btn-secondary"><IFilter size={14} /> Filter</button>
        <button className="btn-icon"><IChevron size={14} style={{ transform: "rotate(180deg)" }} /></button>
        <button className="btn-icon"><IChevron size={14} /></button>
      </SectionHead>

      <div className="cal">
        <div className="cal-row">
          <div className="cal-head" style={{ textAlign: "left", paddingLeft: 14 }}>Room</div>
          {days.map(d => (
            <div key={d.n} className={`cal-head ${d.today ? "today" : ""}`}>
              {d.d}<br /><span style={{ fontSize: 14, color: d.today ? "var(--clay)" : "var(--fg-1)", fontWeight: 600, fontFamily: "var(--font-display)" }}>{d.n}</span>
            </div>
          ))}
        </div>

        {rooms.map(room => {
          const sched = schedule[room.id] || [];
          return (
            <div key={room.id} className="cal-row" style={{ position: "relative" }}>
              <div className="cal-room">
                <span>{room.name}</span>
                <span className="rmeta">{room.meta}</span>
              </div>
              {days.map((d, i) => (
                <div key={i} className={`cal-cell ${d.today ? "today-col" : ""}`} />
              ))}

              {/* Bar overlay — sits on top of the day cells only (left:160px past the room column) */}
              <div style={{ position: "absolute", left: 160, right: 0, top: 0, bottom: 0, pointerEvents: "none" }}>
                {sched.map((s, idx) => {
                  const leftPct = (s.start / COLS) * 100;
                  const widthPct = (s.span / COLS) * 100;
                  const isBlocked = s.kind === "blocked";
                  const isArriving = s.kind === "arriving";
                  return (
                    <div
                      key={idx}
                      onClick={() => s.bookingId && onOpenBooking({ id: s.bookingId, guest: s.label, room: room.name })}
                      style={{
                        position: "absolute",
                        left: `calc(${leftPct}% + 4px)`,
                        width: `calc(${widthPct}% - 8px)`,
                        top: 8,
                        bottom: 8,
                        borderRadius: 8,
                        background: isBlocked
                          ? "repeating-linear-gradient(45deg,#EFE8D9,#EFE8D9 6px,#E5DCC4 6px,#E5DCC4 12px)"
                          : isArriving ? "var(--clay)" : "var(--moss)",
                        color: isBlocked ? "var(--fg-2)" : "var(--linen)",
                        padding: "0 10px",
                        fontSize: 12,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: s.bookingId ? "pointer" : "default",
                        pointerEvents: "auto",
                      }}
                    >
                      {s.label}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "var(--fg-2)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 10, background: "var(--clay)", borderRadius: 3 }}></span> Arriving</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 10, background: "var(--moss)", borderRadius: 3 }}></span> Booked</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 10, background: "repeating-linear-gradient(45deg,#EFE8D9,#EFE8D9 4px,#E5DCC4 4px,#E5DCC4 8px)", borderRadius: 3 }}></span> Blocked</span>
      </div>
    </div>
  );
}

window.Calendar = Calendar;
