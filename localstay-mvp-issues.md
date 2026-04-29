# 🎫 LocalStay Manager — MVP GitHub Issues
### Breakdown by Epic → Story → Task

> **Convention:** Labels shown as `[label]` · Story Points shown as `(SP)`
> **Labels used:** `epic`, `frontend`, `backend`, `database`, `devops`, `integration`, `bug`, `chore`

---

## 📦 EPIC LIST

| # | Epic | Week Target |
|---|------|-------------|
| EP-01 | Project Setup & Infrastructure | Week 1 |
| EP-02 | Auth & User Management | Week 1–2 |
| EP-03 | Property & Room Management | Week 2 |
| EP-04 | Availability Calendar | Week 2–3 |
| EP-05 | Booking Management | Week 3–4 |
| EP-06 | Front Desk — Daily Operations | Week 4 |
| EP-07 | Payment Integration | Week 5 |
| EP-08 | Messaging & Notifications | Week 5 |
| EP-09 | Public Guest Booking Page | Week 6 |
| EP-10 | Revenue Summary Dashboard | Week 6 |
| EP-11 | Polish, i18n & Testing | Week 7 |
| EP-12 | Launch & Deployment | Week 8 |

---

---

## EP-01 · Project Setup & Infrastructure

---

### 🎫 ISSUE-001 · Initialize monorepo project structure
`[chore]` `[devops]` · (2 SP)

**Description:**
Set up the monorepo with separate `frontend/` and `backend/` workspaces.

**Tasks:**
- [ ] Create GitHub repository with branch protection on `main`
- [ ] Initialize `frontend/` — Vue 3 + Vite + Vuetify 3 + TypeScript
- [ ] Initialize `backend/` — NestJS + TypeScript
- [ ] Add root-level `README.md` with setup instructions
- [ ] Configure `.gitignore`, `.editorconfig`, `.nvmrc` (Node version)
- [ ] Set up Prettier + ESLint for both workspaces

**Acceptance Criteria:**
- `cd frontend && npm run dev` starts the Vue dev server
- `cd backend && npm run start:dev` starts NestJS in watch mode
- Both lint with zero errors on fresh clone

---

### 🎫 ISSUE-002 · Set up PostgreSQL database on Supabase
`[database]` `[devops]` · (2 SP)

**Description:**
Provision the managed PostgreSQL instance and connect it to the NestJS backend.

**Tasks:**
- [ ] Create Supabase project (localstay-mvp)
- [ ] Note connection string, store in `.env` as `DATABASE_URL`
- [ ] Install Prisma in backend: `npm install prisma @prisma/client`
- [ ] Run `npx prisma init` to scaffold `schema.prisma`
- [ ] Verify connection with `npx prisma db pull`
- [ ] Add `.env.example` with all required keys (no values)

**Acceptance Criteria:**
- `npx prisma studio` opens and connects to Supabase DB successfully

---

### 🎫 ISSUE-003 · Define and migrate core database schema
`[database]` · (3 SP)

**Description:**
Create all MVP tables via Prisma schema and apply first migration.

**Schema to implement:**
```prisma
model Property {
  id              String    @id @default(uuid())
  name            String
  address         String
  phone           String
  zaloId          String?
  checkinTime     String    @default("14:00")
  checkoutTime    String    @default("12:00")
  depositPercent  Int       @default(30)
  currency        String    @default("VND")
  createdAt       DateTime  @default(now())
  rooms           Room[]
  bookings        Booking[]
  users           User[]
}

model Room {
  id           String    @id @default(uuid())
  propertyId   String
  name         String
  roomType     String
  maxOccupancy Int
  baseRate     Decimal
  status       RoomStatus @default(AVAILABLE)
  property     Property  @relation(fields: [propertyId], references: [id])
  bookings     Booking[]
}

enum RoomStatus { AVAILABLE OCCUPIED MAINTENANCE OUT_OF_ORDER }

model Booking {
  id             String        @id @default(uuid())
  propertyId     String
  roomId         String
  guestName      String
  guestPhone     String
  checkinDate    DateTime
  checkoutDate   DateTime
  adults         Int           @default(1)
  children       Int           @default(0)
  totalAmount    Decimal
  depositAmount  Decimal
  depositPaid    Boolean       @default(false)
  status         BookingStatus @default(PENDING)
  source         BookingSource @default(WALKIN)
  notes          String?
  createdAt      DateTime      @default(now())
  createdBy      String
  property       Property      @relation(fields: [propertyId], references: [id])
  room           Room          @relation(fields: [roomId], references: [id])
  payments       Payment[]
}

enum BookingStatus { PENDING CONFIRMED CHECKED_IN CHECKED_OUT CANCELLED }
enum BookingSource { WALKIN PHONE ZALO WEBSITE OTA }

model Payment {
  id             String        @id @default(uuid())
  bookingId      String
  amount         Decimal
  method         PaymentMethod
  status         PaymentStatus @default(PENDING)
  transactionRef String?
  paidAt         DateTime?
  booking        Booking       @relation(fields: [bookingId], references: [id])
}

enum PaymentMethod { VNPAY MOMO CASH TRANSFER }
enum PaymentStatus { PENDING COMPLETED REFUNDED }

model User {
  id         String   @id @default(uuid())
  propertyId String
  name       String
  phone      String   @unique
  role       UserRole @default(STAFF)
  createdAt  DateTime @default(now())
  property   Property @relation(fields: [propertyId], references: [id])
}

enum UserRole { OWNER STAFF }
```

**Tasks:**
- [ ] Write full `schema.prisma` per above
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Seed database with 1 sample property + 4 rooms for local dev

**Acceptance Criteria:**
- Migration runs without errors
- All tables visible in Prisma Studio

---

### 🎫 ISSUE-004 · Set up CI/CD pipeline
`[devops]` · (2 SP)

**Description:**
GitHub Actions pipeline for automated lint, test, and deploy.

**Tasks:**
- [ ] Create `.github/workflows/ci.yml` — runs on every PR: lint + unit tests
- [ ] Create `.github/workflows/deploy-frontend.yml` — deploys to Cloudflare Pages on merge to `main`
- [ ] Create `.github/workflows/deploy-backend.yml` — deploys to Railway on merge to `main`
- [ ] Add `CLOUDFLARE_API_TOKEN`, `RAILWAY_TOKEN` as GitHub Secrets
- [ ] Add Prisma migration step to backend deploy workflow

**Acceptance Criteria:**
- PR to `main` triggers CI and shows green check
- Merge to `main` auto-deploys frontend and backend within 5 minutes

---

### 🎫 ISSUE-005 · Configure Cloudflare domain & SSL
`[devops]` · (1 SP)

**Tasks:**
- [ ] Register / point `localstay.vn` to Cloudflare nameservers
- [ ] Configure `app.localstay.vn` → Cloudflare Pages (frontend)
- [ ] Configure `api.localstay.vn` → Railway backend (reverse proxy)
- [ ] Enable Cloudflare R2 bucket for photo storage
- [ ] Verify SSL certificates active on all subdomains

---

---

## EP-02 · Auth & User Management

---

### 🎫 ISSUE-006 · Backend — JWT authentication module (NestJS)
`[backend]` · (3 SP)

**Description:**
Implement JWT-based auth with role guard for Owner and Staff.

**Tasks:**
- [ ] Install `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`
- [ ] Create `AuthModule` with `AuthService`, `AuthController`
- [ ] `POST /auth/login` — accepts phone + password, returns `access_token` (JWT, 8h expiry)
- [ ] `POST /auth/refresh` — returns new token
- [ ] Create `JwtAuthGuard` to protect routes
- [ ] Create `RolesGuard` with `@Roles('owner' | 'staff')` decorator
- [ ] Hash passwords with bcrypt on user creation

**Acceptance Criteria:**
- `POST /auth/login` with valid credentials returns JWT
- Protected route returns 401 without token
- Owner-only route returns 403 for Staff token

---

### 🎫 ISSUE-007 · Backend — Users CRUD endpoints
`[backend]` · (2 SP)

**Tasks:**
- [ ] `GET /users` — list users for current property (Owner only)
- [ ] `POST /users` — create staff user (Owner only)
- [ ] `PATCH /users/:id` — update name/role (Owner only)
- [ ] `DELETE /users/:id` — remove staff user (Owner only)
- [ ] `GET /users/me` — current logged-in user profile (all roles)
- [ ] All endpoints scoped to `propertyId` from JWT payload (multi-tenant safety)

---

### 🎫 ISSUE-008 · Frontend — Login screen
`[frontend]` · (2 SP)

**Description:**
Mobile-optimized login page using Vuetify components.

**Tasks:**
- [ ] Create `/login` route in Vue Router
- [ ] Build login form: phone field + password field + "Login" button
- [ ] Call `POST /auth/login`, store JWT in `localStorage`
- [ ] Redirect to `/dashboard` on success
- [ ] Show error snackbar on invalid credentials
- [ ] Add Pinia auth store: `useAuthStore` — stores token + user role
- [ ] Route guard: redirect to `/login` if no token on protected routes

**Acceptance Criteria:**
- Login with valid credentials → redirected to dashboard
- Login with wrong credentials → snackbar error shown
- Refreshing page keeps user logged in (token persisted)

---

### 🎫 ISSUE-009 · Frontend — User management screen (Owner only)
`[frontend]` · (2 SP)

**Tasks:**
- [ ] Create `/settings/users` route (Owner role guard)
- [ ] List all staff users in a Vuetify `v-data-table`
- [ ] "Add Staff" button → dialog form: name, phone, role, temp password
- [ ] Delete user with confirmation dialog
- [ ] Hide this menu item from Staff role in sidebar

---

---

## EP-03 · Property & Room Management

---

### 🎫 ISSUE-010 · Backend — Property endpoints
`[backend]` · (2 SP)

**Tasks:**
- [ ] `GET /property` — get current property details (scoped to JWT)
- [ ] `PATCH /property` — update property profile (Owner only)
- [ ] Fields: name, address, phone, zaloId, checkinTime, checkoutTime, depositPercent

---

### 🎫 ISSUE-011 · Backend — Rooms CRUD endpoints
`[backend]` · (2 SP)

**Tasks:**
- [ ] `GET /rooms` — list all rooms for property
- [ ] `POST /rooms` — create room (Owner only)
- [ ] `PATCH /rooms/:id` — update room details (Owner only)
- [ ] `DELETE /rooms/:id` — soft-delete room (Owner only, only if no active bookings)
- [ ] `PATCH /rooms/:id/status` — update room status: AVAILABLE / MAINTENANCE / OUT_OF_ORDER

---

### 🎫 ISSUE-012 · Frontend — Property settings screen
`[frontend]` · (2 SP)

**Tasks:**
- [ ] Create `/settings/property` route (Owner only)
- [ ] Form: property name, address, phone, Zalo ID, check-in time, check-out time, deposit %
- [ ] Save via `PATCH /property`
- [ ] Show success snackbar on save

---

### 🎫 ISSUE-013 · Frontend — Room management screen
`[frontend]` · (3 SP)

**Tasks:**
- [ ] Create `/settings/rooms` route (Owner only)
- [ ] List rooms in card grid: room name, type, rate, status badge
- [ ] "Add Room" button → bottom sheet form: name, type (dropdown), max occupancy, base rate/night
- [ ] Tap room → edit dialog with same fields + status toggle
- [ ] Status chip: green (Available), red (Maintenance), grey (Out of Order)
- [ ] Cannot delete room with active booking → show warning

---

---

## EP-04 · Availability Calendar

---

### 🎫 ISSUE-014 · Backend — Availability endpoint
`[backend]` · (3 SP)

**Description:**
Returns a grid of room availability for a date range, used to render the calendar.

**Tasks:**
- [ ] `GET /availability?from=YYYY-MM-DD&to=YYYY-MM-DD`
- [ ] Response: array of rooms, each with array of date slots + booking info per slot
- [ ] Include: booking ID, guest name, status, check-in/out dates for each occupied slot
- [ ] Enforce property scoping from JWT

**Response shape:**
```json
[
  {
    "roomId": "uuid",
    "roomName": "101",
    "slots": [
      { "date": "2026-05-01", "bookingId": "uuid", "guestName": "Nguyen An", "status": "CONFIRMED" },
      { "date": "2026-05-02", "bookingId": null, "status": null }
    ]
  }
]
```

---

### 🎫 ISSUE-015 · Frontend — Availability calendar view
`[frontend]` · (5 SP)

**Description:**
The core visual — a horizontal room × date grid. Highest complexity frontend task.

**Tasks:**
- [ ] Create `/calendar` route
- [ ] Build grid: rows = rooms, columns = dates (7-day window default)
- [ ] Fetch data from `GET /availability`
- [ ] Booked cells: colored block spanning check-in to check-out, shows guest name (truncated)
- [ ] Color by status: yellow (Pending), green (Confirmed), blue (Checked-in)
- [ ] Empty cells: white/grey, tappable
- [ ] Tap booked cell → navigate to `/bookings/:id`
- [ ] Tap empty cell → navigate to `/bookings/new?roomId=X&date=Y` (pre-fill form)
- [ ] Left/right arrows to navigate week
- [ ] "+" FAB button → navigate to `/bookings/new`
- [ ] Loading skeleton while fetching

**Acceptance Criteria:**
- Grid renders correctly for 10 rooms × 7 days
- Multi-night bookings show as single continuous block
- Navigating weeks fetches new date range without full page reload

---

---

## EP-05 · Booking Management

---

### 🎫 ISSUE-016 · Backend — Bookings CRUD endpoints
`[backend]` · (4 SP)

**Tasks:**
- [ ] `GET /bookings` — list bookings, filterable by status, date range, room
- [ ] `GET /bookings/:id` — booking detail with payment history
- [ ] `POST /bookings` — create booking with overlap validation (no double booking)
- [ ] `PATCH /bookings/:id` — update booking (dates, guest info, notes)
- [ ] `PATCH /bookings/:id/status` — update status: check-in, check-out, cancel
- [ ] `DELETE /bookings/:id` — soft cancel (sets status to CANCELLED)
- [ ] Overlap check: reject if room already booked for overlapping dates
- [ ] Auto-calculate `totalAmount` from room `baseRate` × nights
- [ ] Auto-calculate `depositAmount` from property `depositPercent`

**Acceptance Criteria:**
- Creating overlapping booking returns `409 Conflict`
- Status transition validated: can only check-in a CONFIRMED booking, etc.

---

### 🎫 ISSUE-017 · Frontend — New booking form
`[frontend]` · (4 SP)

**Tasks:**
- [ ] Create `/bookings/new` route
- [ ] Accept query params: `?roomId=X&checkinDate=Y` (pre-fill from calendar tap)
- [ ] Fields: room (dropdown), check-in date, check-out date, guest name, guest phone, adults stepper, children stepper, source dropdown, notes
- [ ] Auto-display: nights count, rate/night, total, deposit amount (calculated live)
- [ ] "Save Booking" → POST to `/bookings`, redirect to booking detail
- [ ] "Save & Send QR" → POST to `/bookings` then trigger payment QR flow (links to EP-07)
- [ ] Show validation errors inline (required fields, date logic)

---

### 🎫 ISSUE-018 · Frontend — Booking detail view
`[frontend]` · (3 SP)

**Tasks:**
- [ ] Create `/bookings/:id` route
- [ ] Show all booking fields + payment status
- [ ] Status badge with color coding
- [ ] Action buttons (conditional on status):
  - PENDING → "Check In" disabled, "Send Payment Reminder", "Edit", "Cancel"
  - CONFIRMED → "Check In", "Edit", "Cancel"
  - CHECKED_IN → "Check Out"
  - CHECKED_OUT / CANCELLED → read-only
- [ ] "Edit" → navigate to edit form (same as new booking form, pre-filled)
- [ ] "Cancel" → confirmation dialog → PATCH status to CANCELLED
- [ ] Show payment history list at bottom (amount, method, date)

---

### 🎫 ISSUE-019 · Frontend — Edit booking form
`[frontend]` · (2 SP)

**Tasks:**
- [ ] Reuse New Booking Form component at `/bookings/:id/edit`
- [ ] Pre-fill all fields from existing booking data
- [ ] On save → PATCH `/bookings/:id`
- [ ] Prevent editing checked-out or cancelled bookings (redirect to detail)

---

---

## EP-06 · Front Desk — Daily Operations

---

### 🎫 ISSUE-020 · Backend — Dashboard summary endpoint
`[backend]` · (2 SP)

**Tasks:**
- [ ] `GET /dashboard/today`
- [ ] Response:
  - `checkinsToday`: count + list of bookings checking in today
  - `checkoutsToday`: count + list of bookings checking out today
  - `occupiedRooms`: count of CHECKED_IN rooms
  - `totalRooms`: total room count
  - `revenueToday`: sum of payments with `paidAt` = today

---

### 🎫 ISSUE-021 · Frontend — Dashboard (Home) screen
`[frontend]` · (3 SP)

**Tasks:**
- [ ] Create `/dashboard` as default route after login
- [ ] Stat cards: Check-ins today, Check-outs today, Occupancy (X/Y rooms), Revenue today
- [ ] Quick action buttons: "+ New Booking", "View Calendar", "Today's List"
- [ ] Property name + current date in header
- [ ] Fetch from `GET /dashboard/today`
- [ ] Pull-to-refresh on mobile

---

### 🎫 ISSUE-022 · Backend — Today's list endpoint
`[backend]` · (2 SP)

**Tasks:**
- [ ] `GET /bookings/today` — returns two lists:
  - `checkIns`: bookings with `checkinDate` = today, status = CONFIRMED or PENDING
  - `checkOuts`: bookings with `checkoutDate` = today, status = CHECKED_IN
- [ ] Include: guest name, room name, adults, depositPaid, balance due (totalAmount - paid)

---

### 🎫 ISSUE-023 · Frontend — Today's list screen
`[frontend]` · (3 SP)

**Tasks:**
- [ ] Create `/today` route
- [ ] Two sections: "Check-Ins" and "Check-Outs"
- [ ] Each item: guest name, room, time, adults count, deposit status
- [ ] "Check In" button → PATCH booking status to CHECKED_IN
- [ ] "Check Out & Collect" button → show balance due → confirm → PATCH to CHECKED_OUT
- [ ] "Send Reminder" button on deposit-pending items → trigger Zalo reminder (links to EP-08)
- [ ] Empty state message if no arrivals/departures today

---

---

## EP-07 · Payment Integration

---

### 🎫 ISSUE-024 · Backend — VNPay QR generation
`[backend]` · (4 SP)

**Tasks:**
- [ ] Install VNPay SDK or implement VNPay payment URL signing per official docs
- [ ] `POST /payments/vnpay/create-qr` — accepts `bookingId`, returns signed QR payment URL
- [ ] Set return URL to `api.localstay.vn/payments/vnpay/callback`
- [ ] `GET /payments/vnpay/callback` — VNPay redirect after payment
  - Verify signature
  - On success: create `Payment` record, set `depositPaid = true`, update booking status to CONFIRMED
  - Return redirect to booking confirmation page

**Acceptance Criteria:**
- QR URL generated correctly with valid signature
- Successful test payment auto-confirms booking in DB

---

### 🎫 ISSUE-025 · Backend — MoMo QR generation
`[backend]` · (3 SP)

**Tasks:**
- [ ] `POST /payments/momo/create-qr` — accepts `bookingId`, returns MoMo payment deep link / QR
- [ ] `POST /payments/momo/webhook` — MoMo IPN webhook handler
  - Verify signature
  - On success: create `Payment` record, set `depositPaid = true`, update booking to CONFIRMED
- [ ] Register webhook URL in MoMo developer portal

---

### 🎫 ISSUE-026 · Backend — Manual payment recording
`[backend]` · (2 SP)

**Description:**
Allow staff to record cash or bank transfer payments manually.

**Tasks:**
- [ ] `POST /payments/manual` — accepts `bookingId`, `amount`, `method` (CASH/TRANSFER), `notes`
- [ ] Creates `Payment` record, updates `depositPaid` if deposit threshold met
- [ ] Owner only: `GET /payments?bookingId=X` — payment history for a booking

---

### 🎫 ISSUE-027 · Frontend — Payment QR screen
`[frontend]` · (3 SP)

**Tasks:**
- [ ] Create `/bookings/:id/payment` route
- [ ] Show booking summary + deposit amount due
- [ ] Two tabs: "VNPay" | "MoMo"
- [ ] Fetch QR URL from backend → display as QR code image (`qrcode` npm package)
- [ ] "Mark as Cash Paid" button → POST manual payment → navigate back to booking
- [ ] Auto-poll `GET /bookings/:id` every 5s — when `depositPaid = true`, show success state + navigate to booking detail
- [ ] Copy payment link button

---

---

## EP-08 · Messaging & Notifications

---

### 🎫 ISSUE-028 · Backend — Zalo OA integration
`[backend]` · (4 SP)

**Tasks:**
- [ ] Register Zalo OA app, obtain `access_token` and `refresh_token`
- [ ] Store Zalo credentials in env: `ZALO_APP_ID`, `ZALO_SECRET`, `ZALO_OA_TOKEN`
- [ ] Create `ZaloService` with method `sendMessage(phone, templateId, params)`
- [ ] Implement token refresh logic (Zalo tokens expire every 3 months)
- [ ] Message templates to implement:
  - **Booking Confirmation:** "Xin chào {guestName}! Đặt phòng #{bookingId} tại {propertyName} từ {checkinDate} → {checkoutDate} đã được xác nhận. Số tiền cọc: {depositAmount}đ."
  - **Payment QR:** "Vui lòng thanh toán tiền cọc {depositAmount}đ để xác nhận đặt phòng: {paymentLink}"
  - **Check-in Reminder:** "Nhắc nhở: Bạn có lịch nhận phòng tại {propertyName} vào ngày mai {checkinDate}. Check-in từ {checkinTime}."
  - **Check-out Reminder:** "Nhắc nhở: Lịch trả phòng của bạn tại {propertyName} là {checkoutDate} trước {checkoutTime}."
- [ ] Trigger confirmation message automatically after booking CONFIRMED status

---

### 🎫 ISSUE-029 · Backend — SMS fallback (eSMS.vn)
`[backend]` · (2 SP)

**Tasks:**
- [ ] Create `SmsService` using eSMS.vn HTTP API
- [ ] Send booking confirmation SMS if Zalo message fails (fallback logic)
- [ ] SMS content: short version of confirmation with booking ID and dates

---

### 🎫 ISSUE-030 · Backend — Scheduled reminder job
`[backend]` · (2 SP)

**Tasks:**
- [ ] Install `@nestjs/schedule`
- [ ] Daily cron job at 09:00 Vietnam time (ICT, UTC+7)
- [ ] Query bookings with `checkinDate` = tomorrow + status CONFIRMED → send check-in reminder
- [ ] Query bookings with `checkoutDate` = tomorrow + status CHECKED_IN → send check-out reminder

---

---

## EP-09 · Public Guest Booking Page

---

### 🎫 ISSUE-031 · Backend — Public booking API (no auth)
`[backend]` · (3 SP)

**Description:**
Public endpoints — no JWT required, scoped by property slug.

**Tasks:**
- [ ] Add `slug` field to `Property` model (e.g., "sunset-homestay")
- [ ] `GET /public/:slug` — property info + room types + photos
- [ ] `GET /public/:slug/availability?checkin=X&checkout=Y` — available rooms for date range
- [ ] `POST /public/:slug/bookings` — create guest booking (returns booking ID + payment QR)
- [ ] Rate limit: 10 requests/min per IP (prevent abuse)
- [ ] Validate no double booking on public endpoint too

---

### 🎫 ISSUE-032 · Frontend — Public booking page
`[frontend]` · (4 SP)

**Description:**
A separate, guest-facing page at `localstay.vn/:slug`. No login required.

**Tasks:**
- [ ] Create public layout (no sidebar/auth)
- [ ] Route `/:slug` → public booking page
- [ ] Property header: name, location, star rating, from price
- [ ] Date selector: check-in + check-out date pickers → "Search" button
- [ ] Fetch available rooms → display as cards: room name, photo, occupancy, rate/night, "Book Now"
- [ ] "Book Now" → booking form modal: guest name, phone, adults, children
- [ ] Submit → POST to `/public/:slug/bookings` → show QR payment screen
- [ ] After payment confirmed → show "Booking Confirmed 🎉" page with booking summary
- [ ] Vietnamese + English toggle
- [ ] SEO: `<meta>` title/description per property (for Google indexing)
- [ ] Shareable URL: `localstay.vn/sunset-homestay`

---

---

## EP-10 · Revenue Summary Dashboard

---

### 🎫 ISSUE-033 · Backend — Revenue summary endpoint
`[backend]` · (2 SP)

**Tasks:**
- [ ] `GET /reports/revenue?period=today|week|month`
- [ ] Response:
  - `collected`: sum of completed payments in period
  - `pending`: sum of bookings with unpaid balance
  - `totalBookings`: count of bookings in period
  - `avgOccupancy`: % (occupied room-nights / total room-nights in period)
  - `bySource`: breakdown count per `BookingSource`
- [ ] Owner role only

---

### 🎫 ISSUE-034 · Frontend — Revenue summary screen
`[frontend]` · (2 SP)

**Tasks:**
- [ ] Create `/reports` route (Owner only, hidden from Staff in nav)
- [ ] Tab bar: Today / This Week / This Month
- [ ] Stat rows: Collected, Pending, Total Bookings, Avg Occupancy
- [ ] "By Source" section: text-based bar breakdown (no chart library needed in MVP)
- [ ] Fetch from `GET /reports/revenue?period=X`

---

---

## EP-11 · Polish, i18n & Testing

---

### 🎫 ISSUE-035 · Frontend — Vietnamese / English i18n
`[frontend]` · (3 SP)

**Tasks:**
- [ ] Install `vue-i18n`
- [ ] Create `locales/vi.json` and `locales/en.json` with all UI strings
- [ ] Language toggle button in top navbar (VI 🇻🇳 / EN 🇬🇧)
- [ ] Persist language choice in `localStorage`
- [ ] All date/time displays use locale-aware formatting
- [ ] Currency always displayed as VND with proper separator (1,200,000 đ)

---

### 🎫 ISSUE-036 · Frontend — Mobile responsiveness pass
`[frontend]` · (2 SP)

**Tasks:**
- [ ] Test all screens on 375px (iPhone SE) and 390px (iPhone 14) widths
- [ ] Fix any overflow, truncation, or tap target issues
- [ ] Calendar grid: ensure horizontal scroll on mobile with sticky room name column
- [ ] Bottom navigation bar on mobile (Dashboard, Calendar, Today, +Booking)
- [ ] Sidebar navigation on tablet/desktop

---

### 🎫 ISSUE-037 · Frontend — PWA configuration
`[frontend]` · (2 SP)

**Tasks:**
- [ ] Install `vite-plugin-pwa`
- [ ] Configure `manifest.json`: app name, icons (192x192, 512x512), theme color
- [ ] Service worker: cache app shell for offline access
- [ ] "Add to Home Screen" prompt on mobile
- [ ] Offline fallback page: "No internet — some features unavailable"

---

### 🎫 ISSUE-038 · Backend — Input validation & error handling
`[backend]` · (2 SP)

**Tasks:**
- [ ] Install `class-validator` + `class-transformer`
- [ ] Add `ValidationPipe` globally in `main.ts`
- [ ] Create DTOs with validation decorators for all POST/PATCH endpoints
- [ ] Global exception filter → consistent error response shape: `{ statusCode, message, error }`
- [ ] 409 Conflict for double booking attempts
- [ ] 404 for unknown IDs, scoped to current property

---

### 🎫 ISSUE-039 · Testing — Backend unit & integration tests
`[backend]` · (3 SP)

**Tasks:**
- [ ] Unit tests for `BookingService` overlap detection logic
- [ ] Unit tests for payment amount calculation
- [ ] Integration test: full booking creation flow (POST → GET → PATCH status)
- [ ] Integration test: double booking returns 409
- [ ] Run tests in CI pipeline

---

### 🎫 ISSUE-040 · Testing — Frontend E2E tests (Playwright)
`[frontend]` · (2 SP)

**Tasks:**
- [ ] Install Playwright
- [ ] E2E: login → view calendar → create booking → verify in calendar
- [ ] E2E: public booking page → search availability → submit booking
- [ ] Run E2E in CI against staging environment

---

---

## EP-12 · Launch & Deployment

---

### 🎫 ISSUE-041 · Production environment setup
`[devops]` · (2 SP)

**Tasks:**
- [ ] Set all production environment variables in Railway + Cloudflare Pages
- [ ] Enable Supabase connection pooling (PgBouncer) for production
- [ ] Configure Cloudflare R2 CORS policy for photo uploads from frontend
- [ ] Set up Cloudflare WAF basic rules
- [ ] Enable Railway automatic restarts on crash

---

### 🎫 ISSUE-042 · Onboarding flow for new properties
`[frontend]` `[backend]` · (3 SP)

**Description:**
New property owners should be able to self-register and set up their property without contacting support.

**Tasks:**
- [ ] `POST /auth/register` — create property + owner account in one step
- [ ] Frontend: `/register` page — property name, owner name, phone, password
- [ ] After register → redirect to onboarding wizard:
  - Step 1: Property details (address, check-in/out time, deposit %)
  - Step 2: Add rooms (name, type, rate) — add up to 5 in wizard
  - Step 3: Copy your booking link → share on Zalo / Facebook
- [ ] Finish → redirect to Dashboard

---

### 🎫 ISSUE-043 · Seed pilot data & support docs
`[chore]` · (1 SP)

**Tasks:**
- [ ] Create 3 demo property accounts for pilot guesthouses in Mui Ne
- [ ] Write `ONBOARDING.md`: step-by-step guide for new property owners (VI + EN)
- [ ] Record 3-minute Zalo video walkthrough: login → add rooms → create booking → share link
- [ ] Create feedback form (Google Form) for pilot property owners

---

---

## 📊 Issue Summary

| Epic | Issues | Total Story Points |
|------|--------|--------------------|
| EP-01 Project Setup | 5 issues | 10 SP |
| EP-02 Auth & Users | 4 issues | 9 SP |
| EP-03 Property & Rooms | 4 issues | 9 SP |
| EP-04 Calendar | 2 issues | 8 SP |
| EP-05 Bookings | 4 issues | 13 SP |
| EP-06 Front Desk | 4 issues | 10 SP |
| EP-07 Payments | 4 issues | 12 SP |
| EP-08 Messaging | 3 issues | 8 SP |
| EP-09 Public Booking | 2 issues | 7 SP |
| EP-10 Revenue | 2 issues | 4 SP |
| EP-11 Polish & Testing | 6 issues | 14 SP |
| EP-12 Launch | 3 issues | 6 SP |
| **TOTAL** | **43 issues** | **110 SP** |

---

## 🏷️ Suggested GitHub Labels

```
Type:     epic · feature · chore · bug
Layer:    frontend · backend · database · devops · integration
Priority: p0-critical · p1-high · p2-medium · p3-low
Status:   blocked · in-progress · needs-review
```

---

## 🗂️ Suggested GitHub Milestones

| Milestone | Issues | Target Date |
|-----------|--------|-------------|
| M1 · Foundation | EP-01, EP-02, EP-03 | End of Week 2 |
| M2 · Core Booking | EP-04, EP-05, EP-06 | End of Week 4 |
| M3 · Payments & Messaging | EP-07, EP-08 | End of Week 5 |
| M4 · Guest Page & Reports | EP-09, EP-10 | End of Week 6 |
| M5 · Polish & Launch | EP-11, EP-12 | End of Week 8 |

---

*LocalStay Manager — Issue Tracker Ready 🚀*
