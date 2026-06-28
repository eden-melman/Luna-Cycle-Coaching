# Wix Headless backend — required dashboard setup

The front-end is fully wired to the Wix SDK. The two things below need to exist
on the Wix project itself before submissions and bookings actually land
somewhere — both are one-time clicks in the dashboard.

Open the dashboard from the CLI: `npx wix open-editor` (or use the URL printed by `npx wix dev`).

## 1) Install the Wix apps used by the site

These apps need to be installed on the Wix project. Without them, the SDK calls
fall through gracefully (the form shows a "collection not set up" message;
consult CTAs fall back to `/intake`) but no data is captured.

In the dashboard → **Add Apps**:

- **CMS (Wix Data)** — for the two collections below.
- **Wix Bookings** — for the free 30-minute consult service.
- **Wix CRM / Contacts** — installed by default on most projects; if missing,
  add it so form submissions create contact records.

## 2) Create CMS collections

Dashboard → **CMS → Collections → Create Collection**.

### `Intake` collection

| Field key             | Type      | Required | Notes                                  |
|-----------------------|-----------|----------|----------------------------------------|
| `name`                | Text      | ✓        | First and last name                    |
| `email`               | Text      | ✓        | We index this — set `Email` validation |
| `trainingHistory`     | Rich text | ✓        | Multi-line                             |
| `currentTrainingDays` | Text      | ✓        | One of "1"…"6+"                        |
| `mainGoal`            | Text      | ✓        | Picklist (see `IntakeForm.jsx`)        |
| `cycleTrackingStatus` | Text      | ✓        | Picklist (see `IntakeForm.jsx`)        |
| `injuriesOrNotes`     | Rich text |          |                                        |
| `submittedAt`         | Date/Time |          | Server-set                             |
| `status`              | Text      |          | We seed it to `"new"`                  |

**Permissions:** Add → Anyone. Update/Delete → Admin only.

### `WorkshopEnquiries` collection

| Field key      | Type      | Required | Notes                            |
|----------------|-----------|----------|----------------------------------|
| `name`         | Text      | ✓        |                                  |
| `email`        | Text      | ✓        | Email validation                 |
| `company`      | Text      | ✓        |                                  |
| `format`       | Text      |          | One of the 4 options on the page |
| `notes`        | Rich text |          |                                  |
| `submittedAt`  | Date/Time |          |                                  |
| `status`       | Text      |          |                                  |

**Permissions:** Anyone can add, admin-only read.

## 3) Wix Bookings — the free consult service

Dashboard → **Bookings → Services → Add Service**.

- **Service name:** Free 30-minute consult
- **Type:** Appointment (1:1)
- **Duration:** 30 minutes
- **Price:** Free
- **Buffer:** 15 min before/after
- **Online only by default** (or in-person London if you offer that)

Once created, copy the service ID from the URL (or via
`npx wix generate` / dashboard service settings) and set it on the project:

```bash
npx wix env set --key WIX_CONSULT_SERVICE_ID --value <service-id>
```

After this, the **Book a free consult** button in the nav and the mobile sticky
bar will route through `/api/consult`, which calls
`redirects.createRedirectSession({ bookingsCheckout: { serviceId } })` and 302s
the visitor to the Wix Bookings flow.

If `WIX_CONSULT_SERVICE_ID` is unset, every consult CTA gracefully falls back
to `/intake` so the site keeps converting while you finish setup.

## 4) Re-deploy

```bash
npx wix build && npx wix release --comment "Wire Wix backend"
```

## Where things live in the codebase

| File                                                 | Purpose                                         |
|------------------------------------------------------|-------------------------------------------------|
| `src/server/wix.ts`                                  | Server-side SDK client + visitor-token auth     |
| `src/pages/api/intake.ts`                            | POST `/api/intake` → Intake collection + Contact |
| `src/pages/api/workshops.ts`                         | POST `/api/workshops` → WorkshopEnquiries + Contact |
| `src/pages/api/consult.ts`                           | GET `/api/consult` → 302 to Bookings checkout (or `/intake`) |
| `src/components/IntakeForm.jsx`                      | Posts to `/api/intake`                          |
| `src/pages/workshops.astro`                          | Inline script posts to `/api/workshops`         |
| `src/components/NavConsultButton.jsx`                | Calls `/api/consult?format=json`, then navigates |
| `src/components/MobileConsultStickyBar.jsx`          | `<a href="/api/consult">`                       |

## Environment variables

Pulled into `.env.local` by `npx wix env pull`:

- `WIX_CLIENT_ID` — set by scaffold, used by `OAuthStrategy`.
- `WIX_CONSULT_SERVICE_ID` — **you set this** after creating the consult service.

The SDK uses **visitor (anonymous) OAuth tokens** for all writes, generated per
request via `generateVisitorTokens()`. No API key is required as long as the
CMS collection permissions allow anonymous insert.
