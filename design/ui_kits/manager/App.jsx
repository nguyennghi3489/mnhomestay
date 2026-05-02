// App.jsx — root with simple route state
const { useState } = React;

const BOOKINGS = [
  { id: "b1", guest: "Aanya Iyer", room: "Garden Suite", dates: "Apr 29 – May 2", checkIn: "Tue, Apr 29", checkOut: "Fri, May 2", nights: 3, eta: "4:00 PM", status: "arriving", statusLabel: "Arriving today", total: 12600, source: "Direct · phone", tone: "moss" },
  { id: "b2", guest: "Ravi Menon", room: "The Loft", dates: "Apr 28 – Apr 30", nights: 2, eta: "9:00 PM", status: "arriving", statusLabel: "Arriving today", total: 6800, source: "Booking.com", tone: "clay" },
  { id: "b3", guest: "Sara Khan", room: "The Loft", dates: "May 2 – May 5", nights: 3, status: "confirmed", statusLabel: "Confirmed", total: 10200, source: "Direct · email", tone: "moss" },
  { id: "b4", guest: "Liu Wei", room: "Verandah Room", dates: "May 1 – May 3", nights: 2, status: "confirmed", statusLabel: "Confirmed", total: 5600, source: "Airbnb", tone: "bark" },
  { id: "b5", guest: "Mira Patel", room: "Writer's Nook", dates: "Apr 26 – Apr 28", nights: 2, status: "checked", statusLabel: "Checked in", total: 4200, source: "Returning guest", tone: "clay" },
  { id: "b6", guest: "Tomás Ortiz", room: "Garden Suite", dates: "May 8 – May 12", nights: 4, status: "pending", statusLabel: "Pending", total: 16800, source: "Booking.com", tone: "moss" },
  { id: "b7", guest: "Hana Sato", room: "The Loft", dates: "May 15 – May 18", nights: 3, status: "confirmed", statusLabel: "Confirmed", total: 10200, source: "Direct · website", tone: "bark" },
];

function App() {
  const [route, setRoute] = useState("dashboard");
  const [openBooking, setOpenBooking] = useState(null);

  const titles = { dashboard: "Today", calendar: "Calendar", guests: "Guests", rooms: "Rooms", inbox: "Messages", settings: "Settings" };

  const handleOpenBooking = (b) => setOpenBooking(b);
  const handleAdd = () => setOpenBooking({ id: "new", guest: "New guest", room: "Garden Suite", status: "pending", statusLabel: "Draft", source: "Direct booking", tone: "moss" });

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} counts={{ upcoming: 12, guests: 47, unread: 3 }} />
      <div className="main">
        <TopBar title={titles[route]} onAdd={handleAdd} />
        <div className="content">
          {route === "dashboard" && <Dashboard bookings={BOOKINGS} onOpenBooking={handleOpenBooking} />}
          {route === "calendar" && <Calendar bookings={BOOKINGS} onOpenBooking={handleOpenBooking} />}
          {route === "guests" && <Guests bookings={BOOKINGS} onOpenBooking={handleOpenBooking} />}
          {route === "rooms" && (
            <div>
              <div className="empty">
                <img className="sprig" src="../../assets/sprig.svg" alt="" />
                <h3>Your rooms live here</h3>
                <p>Photos, rates, amenities, and seasonal pricing — all in one place.</p>
                <button className="btn btn-primary">Add a room</button>
              </div>
            </div>
          )}
          {route === "inbox" && (
            <div className="empty">
              <img className="sprig" src="../../assets/sprig.svg" alt="" />
              <h3>Nothing waiting on you.</h3>
              <p>Messages from guests and OTAs will land here.</p>
            </div>
          )}
          {route === "settings" && <Settings />}
        </div>
      </div>

      <BookingDrawer
        booking={openBooking}
        open={!!openBooking}
        onClose={() => setOpenBooking(null)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
