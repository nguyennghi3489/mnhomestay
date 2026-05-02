// Icons.jsx — small, consistent line-icon set used across the manager kit.
// Lucide-style: 1.6 stroke, round caps, currentColor.

const Icon = ({ children, size = 18, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

const IHome     = (p) => <Icon {...p}><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></Icon>;
const ICalendar = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></Icon>;
const IGuests   = (p) => <Icon {...p}><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-7 7-7s7 3 7 7"/><circle cx="17" cy="9" r="3"/><path d="M22 20c0-3-2-5-5-5"/></Icon>;
const IRooms    = (p) => <Icon {...p}><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-7h6v7"/></Icon>;
const IInbox    = (p) => <Icon {...p}><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></Icon>;
const ISettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Icon>;
const ISearch   = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>;
const IPlus     = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IBell     = (p) => <Icon {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></Icon>;
const IClose    = (p) => <Icon {...p}><path d="M18 6L6 18M6 6l12 12"/></Icon>;
const IChevron  = (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
const IFilter   = (p) => <Icon {...p}><path d="M3 6h18M6 12h12M10 18h4"/></Icon>;
const IPhone    = (p) => <Icon {...p}><path d="M22 16.92V21a1 1 0 0 1-1.1 1 19 19 0 0 1-8.3-3 19 19 0 0 1-6-6 19 19 0 0 1-3-8.3A1 1 0 0 1 4.6 3h4.1a1 1 0 0 1 1 .8 11 11 0 0 0 .6 2.4 1 1 0 0 1-.2 1L8.5 8.5a16 16 0 0 0 6 6l1.3-1.6a1 1 0 0 1 1-.2 11 11 0 0 0 2.4.6 1 1 0 0 1 .8 1z"/></Icon>;
const IMail     = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></Icon>;
const IMoon     = (p) => <Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></Icon>;
const IKey      = (p) => <Icon {...p}><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M19 4l3 3"/></Icon>;

window.HearthIcons = { IHome, ICalendar, IGuests, IRooms, IInbox, ISettings, ISearch, IPlus, IBell, IClose, IChevron, IFilter, IPhone, IMail, IMoon, IKey };
