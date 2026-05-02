# Hearth Manager — UI Kit

The host-facing web app: dashboard, calendar, guest list, booking drawer, settings.

## Components

- `App.jsx` — root with simple client-side routing
- `Sidebar.jsx` — fixed 240px nav with brand mark
- `TopBar.jsx` — page header with search and quick actions
- `Dashboard.jsx` — today's arrivals, occupancy, recent bookings
- `Calendar.jsx` — room × day grid
- `Guests.jsx` — guest list with avatars and status pills
- `BookingDrawer.jsx` — slide-in form for adding/editing a booking
- `primitives.jsx` — Button, Pill, Field, Avatar, Card, Icon

## Running

Open `index.html`. The kit is React + Babel inline, no build step.

## Visual fidelity

Built directly from the design tokens in `colors_and_type.css`. No screenshots or codebase were available; this is the canonical reference. If a real codebase appears, reconcile against this kit.
