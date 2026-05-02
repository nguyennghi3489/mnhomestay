// TopBar.jsx
const { ISearch, IBell, IPlus } = window.HearthIcons;

function TopBar({ title, onAdd }) {
  return (
    <div className="topbar">
      <div className="title">{title}</div>
      <div className="search">
        <ISearch size={16} />
        <input placeholder="Search guests, bookings, rooms…" />
      </div>
      <div className="actions">
        <button className="btn-icon" title="Notifications"><IBell size={18} /></button>
        <button className="btn btn-primary" onClick={onAdd}>
          <IPlus size={16} />
          New booking
        </button>
      </div>
    </div>
  );
}

window.TopBar = TopBar;
