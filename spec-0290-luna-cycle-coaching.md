# Luna Cycle Coaching

> Training plans that work with your cycle, not against it

**HEADLESS DAY brief spec-0290** · Category: **Health & Wellness** · Difficulty: **medium**

A London coaching practice building women's training programs around menstrual cycle phases, backed by sports science and a refusal to call anything a 'girl workout'. Corporate workshops are booked through spring.

---

## Requirements

Your build is judged against these. All of them.

- [ ] Coaching programs page with 3 plans and pricing
- [ ] The science page with cited research summaries
- [ ] Intake form with training history
- [ ] Coach credentials page
- [ ] Mobile-first responsive design

## Art direction

| | |
|---|---|
| Mood | cyclical · empowering · evidence-based · strong |
| Primary color | `#4A2545` |
| Accent color | `#F4A261` |

Treat the palette as a starting point — interpret the mood, don't paint by numbers.

## Bonus challenge

Add a four-phase training visualization wheel

---

# Creative brief

A richer brief to build from — structure, content, design, SEO, and performance. Hit the requirements above; let this guide how.

## Audience & voice

**Audience.** Women aged 25-45 in London who train seriously — runners, lifters, CrossFit regulars — and are tired of fitness plans built on male physiology. They track their cycle, read research, want to lift heavy in the right week and stop blaming themselves in the wrong one, and bristle at anything pink, soft, or condescending.

**Voice.** evidence-led · direct · encouraging without cheerleading · physiologically literate · quietly fierce

**Avoid.** pink-it-and-shrink-it cliches, 'girl workout' language, woo wellness vagueness, shame-based fitness talk, exclamation hype

## Hero

**Headline.** “Your body runs on a four-week clock. Your training plan should too.”

**Layout.** Editorial split — typographic statement left, four-phase wheel right

**Focal / LCP element.** A four-phase cycle wheel (SVG) that is the LCP element, segmented into menstrual, follicular, ovulatory, and luteal arcs

**Treatment.** Large left-aligned display serif with knife-sharp wedge serifs, two-line statement, the words 'four-week' set in the deep plum and 'clock' tracked tight; body subhead in clean sans beneath

**On load.** Wheel draws its four arcs in sequence over ~700ms while the headline rises and fades in word by word, then the consult CTA settles; with prefers-reduced-motion the wheel renders fully drawn and all text is shown at once with no movement

**Atmosphere.** Warm off-white paper tone with a faint plum baseline grid, no photography behind the text

**Primary CTA.** Book a free consult

**Mobile.** Wheel stacks above the headline at reduced size, CTA becomes full-width, and a sticky consult bar pins to the bottom of the viewport

**The one thing they'll remember.** The cycle wheel quietly rotating into place — a body clock you can actually train around

## Sitemap (7 pages)

| Page | Route | Purpose | CTA |
|---|---|---|---|
| Home | `/` | Frame cycle-synced training as smarter training and push to book a consult | Book a free consult |
| Coaching Programs | `/programs` | Three programs with pricing and what each phase plan includes | Book a free consult |
| The Science | `/science` | Cited research summaries on how cycle phases affect strength, recovery, and load | See the programs |
| Your Coach | `/coach` | Credentials, certifications, and the no-girl-workout philosophy | Book a free consult |
| Start Your Intake | `/intake` | Training-history intake form that begins the coaching relationship | Submit intake |
| Corporate Workshops | `/workshops` | Workshop offering for teams, booked through spring | Enquire about a workshop |
| FAQ | `/faq` | Answer the practical and skeptical questions before the consult | Book a free consult |

## Homepage flow

1. **Hero** — Your body runs on a four-week clock. Your training plan should too.
2. **The four phases** — Four phases. Four ways your body wants to work. We build the plan around all of them.
3. **How it works** — You log where you are in your cycle. We map the load to match. You stop fighting your own week.
4. **Programs preview** — Three ways to work together, from self-guided to fully coached.
5. **The science, briefly** — Every recommendation has a citation behind it. No vibes, no guesswork.
6. **Coach credentials** — Strength coach, sports-science background, and a flat refusal to call anything a girl workout.
7. **Client outcomes** — Women who stopped dreading their luteal week and started PR-ing in their follicular one.
8. **Consult CTA band** — Book a free thirty-minute consult. Bring your training history and your questions.

## Content to create

Seed these into the CMS — counts and sample rows are the minimum bar.

- **8× ResearchSummary** (on The Science) — fields: title, phase, claim, summary, citation, strengthOfEvidence
  - e.g. Strength gains in the follicular phase | Follicular | Higher oestrogen may support strength adaptation, so this is the week to push heavy compound lifts | A 2014 study found that follicular-phase strength training produced greater gains in muscle strength than luteal-phase training in the same women. We use it to front-load your heaviest sessions in weeks one and two. | Sung et al., 2014, SpringerPlus | Moderate — small sample, replicated in trend but not large trials
  - e.g. Perceived effort in the luteal phase | Luteal | Sessions can feel harder before your period even when the numbers are the same, so we deload volume rather than your confidence | Reviews report elevated perceived exertion and core temperature in the luteal phase. We hold intensity steady but adjust volume and expectations, so a hard-feeling week reads as physiology, not failure. | McNulty et al., 2020, Sports Medicine systematic review | Strong — large systematic review across 78 studies
- **3× Program** (on Coaching Programs) — fields: name, price, billing, includes, bestFor
  - e.g. Phase Map | £45 | one-off | A four-phase training template built from your intake, a cycle-tracking guide, and one written plan review. | Self-motivated lifters who want the framework without weekly coaching.
  - e.g. Fully Coached | £160 | per month | Phase-mapped programming updated every cycle, weekly check-ins, form review by video, and unlimited message support. | Anyone training four-plus times a week who wants the plan to adapt as their cycle does.
- **1× StoryBlock** (on Your Coach) — fields: heading, body
  - e.g. Luna Cycle Coaching started in a London gym where I kept watching strong women apologise for an off week. I have a sports-science degree and a strength-coaching certification, and none of my textbooks were built on female physiology — almost all of the foundational training research used male subjects. So I went and read the studies that did include women, and the pattern was obvious: the menstrual cycle changes how you adapt, recover, and feel under load, and ignoring it is just bad coaching. I started mapping programs to cycle phases for a handful of clients. They stopped dreading their luteal week and started trusting their bodies again. Five years later I coach women across the city and run corporate workshops booked through spring. I will never call anything a girl workout. It is just good training, finally written for the body doing it.
- **3× Testimonial** (on Home) — fields: name, quote, detail
  - e.g. Priya Nair | 'I PR-ed my deadlift in week two for the first time in my life. Turns out I was just always testing in the wrong week.' | On Fully Coached for eight months, training for her first powerlifting meet.
  - e.g. Hannah Brooks | 'My luteal week used to feel like failure. Now it is just a planned deload and I stopped quitting every month.' | Switched from a generic app plan to Phase Map last spring.

## Design system

**Aesthetic direction.** Editorial sports-science — a clean broadsheet feel with strong typographic hierarchy and a single warm accent, signalling rigour over wellness fluff. It backs the brand's refusal to be soft or pink while staying unmistakably for women.

**Spatial composition.** Asymmetric editorial grid built on a strong left-aligned baseline, with the four-phase wheel as a recurring circular counterpoint that breaks the rectangular column rhythm and pulls the eye into the cyclical idea.

**Typography.** Display: `GT Sectra` · Body: `Public Sans` · GT Sectra Medium/Bold with its sharp, knife-cut wedge serifs and high stroke contrast for headlines and phase labels, against Public Sans 400/500 body and 600 for data callouts
_Source:_ GT Sectra (licensed webfont); Public Sans (Google Fonts / @fontsource) for body
_Why:_ GT Sectra is a high-contrast serif built from calligraphic and scalpel-sharp gestures, lending an editorial, almost surgical authority that reads as evidence-led but still human; Public Sans is a sober, highly legible workhorse that keeps research summaries and program details crisp and unfussy at small sizes.

**Color system** — paste into your Tailwind v4 `@theme`:

```css
@theme {
  --color-background: #FBF7F4;
  --color-surface: #FFFFFF;
  --color-text: #3A1D36;
  --color-text-muted: #6E5468;
  --color-border: #E4D7DF;
  --color-primary: #4A2545;
  --color-accent: #C25A12;
  --color-dark: #2A1226;
  --color-on-dark: #FBF7F4;
}
```

**Signature device.** A four-phase arc motif — the segmented cycle wheel — that recurs as section dividers, the science-page navigation, and the program timelines, always reading clockwise through menstrual to luteal.

**Motion.** CSS-first and restrained: SVG arc draw-on for the wheel, gentle scroll-reveal of phase sections, no parallax or autoplay video; reduced-motion snaps every element to its final drawn state.

**Imagery.** Documentary strength photography in warm natural light, lightly graded toward the plum-and-amber palette; real women lifting, running, and mid-effort, never posed or glossy. Paired with clean line-art phase diagrams.

**Avoid in imagery.** pink palettes · soft-focus spa glamour · weight-loss before-afters · smiling stock-photo gym models · 'girl workout' pastel iconography · woo crystals or moon mysticism

## Conversion & forms

**Primary action.** Book a free consult — via Wix Bookings (free consultation service) → `/intake`

**Repeat at.** hero · how-it-works band · mobile sticky bar · footer

**Secondary (ghost).** Read the science first

**Form fields.** name, email, trainingHistory, currentTrainingDays, mainGoal, cycleTrackingStatus, injuriesOrNotes

**Success message.** “Got it. I'll read your training history before we talk and come to the consult with a starting point, not a sales pitch. You'll have a booking link within one working day.”

**Reassurance.** Your training and cycle details stay between us. No account needed, and nothing here is shared or sold.

## FAQ

Real questions to answer on the site (and feed FAQPage JSON-LD).

**Do I need to track my cycle already?**

No. If you track, great, bring the data. If you don't, the intake and first consult cover what to log and how. The whole point is to make tracking useful, not another chore.

**What if my cycle is irregular, or I'm on hormonal birth control?**

Plenty of clients are. Irregular cycles, PCOS, and hormonal contraception all change the picture, and the programming adapts accordingly. We map to your physiology, not a textbook average.

**Is this only for advanced lifters?**

No. Programs run from a one-off Phase Map for self-guided trainers to fully coached weekly support. The science applies whether you're starting out or chasing a meet.

**Is this just normal training with a pink label on it?**

The opposite. It's standard, well-built strength and conditioning that finally accounts for a four-week hormonal cycle instead of pretending everyone runs on a flat line. No pink, no 'girl workouts', just programming written for the body doing it.

**What does the free consult involve?**

A thirty-minute call where I've already read your intake. We talk goals, training history, and where cycle-synced programming would actually help. No obligation to sign up afterwards.

**Do you run corporate workshops?**

Yes, for teams who want their staff to understand cycle-aware training and recovery. Spring is heavily booked, so enquire early through the workshops page.

## SEO

**Primary keyword.** menstrual cycle training coach London

**Secondary.** cycle syncing workout plan · strength training for women coaching · follicular phase training program · cycle based fitness coaching

**Schema.org type.** `HealthAndBeautyBusiness`

**JSON-LD per page.** Service (Coaching Programs) · Person (Your Coach) · Article (The Science) · FAQPage (FAQ)

**Business facts.** London, UK · Consults Mon-Fri 7am-7pm, Sat 9am-1pm · ££ · est. 2020

**Differentiators.** Programs mapped to all four menstrual cycle phases; every recommendation tied to a cited study; sports-science-certified coach; a flat refusal to call anything a girl workout

**Socials.** @lunacyclecoaching · @trainwithyourcycle

## Performance & accessibility

**LCP element.** The hero four-phase cycle wheel rendered as inline SVG

**Top moves.**
- Inline the hero SVG wheel so it needs no extra request and paints with the document
- Self-host GT Sectra and Public Sans as preloaded woff2 subsets with font-display:swap
- Drive the arc draw-on and scroll reveals with CSS animations and IntersectionObserver, not a scroll listener

**Hydration plan.**
- `MobileConsultStickyBar` → `client:load` (Above-fold per-visitor conversion control that must be tappable immediately)
- `NavConsultButton` → `client:load` (Primary conversion in the header, interactive on first paint)
- `PhaseWheelInteractive` → `client:visible` (The clickable four-phase visualization only needs to hydrate as it enters view)
- `IntakeForm` → `client:idle` (Below-fold multi-field form can defer hydration until the main thread is free)

**Defer as facades.** Wix Bookings consult calendar loaded as a button facade that opens the scheduler on tap · Optional client-story video loaded as a poster-image facade on click

**Targets.** LCP < 2.5s · INP < 200ms · CLS < 0.1 · Lighthouse mobile ≥ 90

**Accessibility baseline.** Text contrast 4.5:1 · UI 3:1 · 44px tap targets · visible focus · honor reduced-motion · alt text required · semantic landmarks

---

# How to build this with Wix Headless

This is the same flow HEADLESS DAY itself was built and deployed with.
Any frontend framework works; the steps below use Astro + React.

## 1. Create the project

```bash
npm create @wix/new@latest my-site
cd my-site
```

This scaffolds an Astro project preconfigured with the `@wix/astro`
integration and links it to a new Wix Headless project in your account
(it will open a browser to authenticate). Already have a project?
Run `npm create @wix/new@latest -- headless link` inside it instead.

## 2. Develop

```bash
npm run dev
```

- Pages live in `src/pages/` (Astro routes). Use React islands
  (`client:load`) for interactive pieces.
- Talk to Wix from code with the SDK:

```ts
import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';

const wix = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId: import.meta.env.PUBLIC_WIX_CLIENT_ID }),
});
```

- Need content collections (menus, galleries, listings)? Create CMS
  collections in your project dashboard (CMS → Collections) and query
  them with `@wix/data`. Need bookings, stores, or events? Install the
  app on the project and use the matching `@wix/...` SDK module.
- Your OAuth client ID is in the dashboard under
  **Settings → Headless Settings → OAuth apps**; put it in `.env.local`
  as `PUBLIC_WIX_CLIENT_ID`.

## 3. Deploy on Wix

```bash
npx wix build
npx wix release
```

`release` prints your live `*.wix-site-host.com` URL. Redeploys are the
same two commands. That URL is what you submit.

## 4. Submit

Paste your live URL into **My Spec → Submit your build** on the
HEADLESS DAY site before 16:00. Good luck. 🎰
