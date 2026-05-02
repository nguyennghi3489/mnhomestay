// Sidebar.jsx
const { IHome, ICalendar, IGuests, IRooms, IInbox, ISettings, IChevron } = window.HearthIcons;

function Sidebar({ route, setRoute, counts }) {
  const items = [
    { id: "dashboard", label: "Today", icon: IHome },
    { id: "calendar", label: "Calendar", icon: ICalendar, count: counts.upcoming },
    { id: "guests", label: "Guests", icon: IGuests, count: counts.guests },
    { id: "rooms", label: "Rooms", icon: IRooms },
    { id: "inbox", label: "Messages", icon: IInbox, count: counts.unread },
  ];
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="../../assets/logo-mark.svg" width="32" height="32" alt="" />
        <span className="name">Hearth</span>
      </div>

      <div className="group-label">Manage</div>
      {items.map(it => {
        const I = it.icon;
        return (
          <div key={it.id}
            className={`nav-item ${route === it.id ? "active" : ""}`}
            onClick={() => setRoute(it.id)}>
            <I />
            <span>{it.label}</span>
            {it.count != null && <span className="count">{it.count}</span>}
          </div>
        );
      })}

      <div className="group-label">Account</div>
      <div className={`nav-item ${route === "settings" ? "active" : ""}`} onClick={() => setRoute("settings")}>
        <ISettings />
        <span>Settings</span>
      </div>

      <div className="property">
        <div className="pavatar">FH</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pname">Fern House</div>
          <div className="pmeta">Coorg · 4 rooms</div>
        </div>
        <IChevron size={14} style={{ color: "var(--fg-3)", transform: "rotate(90deg)" }} />
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
