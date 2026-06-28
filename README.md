# Luna Cycle Coaching

Marketing and onboarding site for a strength-coaching practice that programs training around the menstrual cycle. Built on Astro with a Wix Headless backend; runs SSR on Wix's hosting at [lunacyclecoaching.com](https://lunacyclecoaching.com).

The site explains the science, introduces the coach, lists programs and workshops, captures intake submissions, and books a free 30-minute consult — all without a custom server.

## What's on the site

| Route | Purpose |
|---|---|
| `/` | Home — value prop, phase-wheel hero, primary CTAs |
| `/science` | The cycle-phase model explained, with an interactive wheel |
| `/programs` | 1:1 coaching tiers |
| `/coach` | Coach bio and credentials |
| `/workshops` | Corporate workshop pitch + enquiry form |
| `/intake` | Long-form intake questionnaire (the main conversion path) |
| `/faq` | FAQ |

Three API routes handle dynamic behaviour:

| Endpoint | Behaviour |
|---|---|
| `POST /api/intake` | Validates submission → inserts into the `Intake` CMS collection → upserts a Wix CRM contact |
| `POST /api/workshops` | Same shape for `WorkshopEnquiries` collection + contact |
| `GET /api/consult` | Creates a Wix Bookings redirect session for the consult service and 302s the visitor into the Wix booking flow. Falls back to `/intake` if `WIX_CONSULT_SERVICE_ID` is unset. |

## Stack

- **Astro 5** in SSR mode (`output: "server"`) — most pages are server-rendered, the wheel + form components hydrate as React islands.
- **React 18** for interactive components (`IntakeForm`, `PhaseWheelInteractive`, `NavConsultButton`, `MobileConsultStickyBar`).
- **Tailwind CSS 4** via the official Vite plugin.
- **Wix Headless SDK** (`@wix/sdk`, `@wix/data`, `@wix/bookings`, `@wix/crm`, `@wix/redirects`) — CMS, Bookings, and Contacts all called from API routes.
- **`@wix/astro`** + **`@wix/cloud-provider-fetch-adapter`** — packages the SSR build into a self-contained bundle that runs on Wix's edge runtime.

## How the Wix integration works

Everything writes to Wix via **visitor (anonymous) OAuth tokens** generated per request — there is no API key in the deployed runtime. The flow:

1. `src/server/wix.ts` constructs a `createClient({ auth: OAuthStrategy({ clientId }) })` and exposes a helper that calls `generateVisitorTokens()` for each request.
2. API routes call SDK methods (`items.insert`, `contacts.createContact`, `redirects.createRedirectSession`) using that visitor-scoped client.
3. CMS collections (`Intake`, `WorkshopEnquiries`) are configured with **Anyone can add** permission on the Wix side, so the visitor token is sufficient.
4. If a collection or the consult service isn't set up, the SDK call surfaces a known error and the route returns a graceful fallback (form shows a "collection not set up" message; consult CTAs redirect to `/intake`). The site keeps converting while you finish dashboard setup.

See [`SETUP.md`](./SETUP.md) for the one-time Wix dashboard steps (apps to install, collection schemas, consult service).

## Repo layout

```
.
├── astro.config.mjs          # Wix + React + Tailwind integrations, server output
├── wix.config.json           # Wix appId / siteId (project identifiers, not secrets)
├── public/                   # Static assets served as-is (favicon, sitemap)
├── src/
│   ├── pages/                # File-based routes (.astro pages + /api/*.ts handlers)
│   ├── components/           # Astro components + React islands
│   ├── layouts/Layout.astro  # Shared shell (nav, footer, mobile sticky bar)
│   ├── server/wix.ts         # SDK client factory + visitor-token helper
│   ├── styles/global.css     # Tailwind entry + design tokens
│   └── assets/               # Imported assets that go through Astro's image pipeline
├── stitch_luna_cycle_coaching/  # Stitch design exports used as visual references
├── SETUP.md                  # Wix backend setup (apps, collections, bookings)
└── AGENTS.md                 # Guidance for AI coding agents working in this repo
```

