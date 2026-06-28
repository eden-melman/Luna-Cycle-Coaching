import { useState } from "react";

const TRAINING_DAYS = ["1", "2", "3", "4", "5", "6+"];
const MAIN_GOAL = [
  "Get stronger across the cycle",
  "Train for a powerlifting meet",
  "Train for a running race",
  "CrossFit / hybrid training",
  "Recover from injury / return to lifting",
  "Stop dreading my luteal week",
  "Something else (I'll explain below)",
];
const CYCLE_STATUS = [
  "Regular cycle, I track it",
  "Regular cycle, I don't track yet",
  "Irregular cycle",
  "On hormonal contraception",
  "Perimenopause / menopause",
  "Prefer not to say",
];

export default function IntakeForm() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const next = {};
    if (!String(data.name || "").trim()) next.name = "Please add your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(data.email || ""))) next.email = "Please add a valid email.";
    if (!String(data.trainingHistory || "").trim()) next.trainingHistory = "A short paragraph is plenty.";
    if (!data.currentTrainingDays) next.currentTrainingDays = "Pick a rough number.";
    if (!data.mainGoal) next.mainGoal = "Pick the closest match.";
    if (!data.cycleTrackingStatus) next.cycleTrackingStatus = "Pick whichever fits best.";
    if (!data.consent) next.consent = "We need your okay to use this to prepare for the consult.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setSubmitError("");

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok || payload.ok === false) {
        if (payload.errors) setErrors(payload.errors);
        setSubmitError(payload.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch (err) {
      setSubmitError("Network problem. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-10 md:p-14 max-w-3xl">
        <div className="text-eyebrow text-[var(--color-accent)] mb-4">Intake received</div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold text-[var(--color-primary)]">
          Got it. I'll read your training history before we talk.
        </h2>
        <p className="mt-6 text-body-lg text-[var(--color-text-muted)] max-w-xl">
          I'll come to the consult with a starting point, not a sales pitch. You'll have a booking link within one working day at the email you provided.
        </p>
        <div className="mt-10 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">Nothing in your intake is shared or sold.</p>
          <a href="/" className="text-eyebrow text-[var(--color-primary)] border-b border-[var(--color-primary)] pb-1">
            Back to home →
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 md:p-12 max-w-3xl">
      <div className="mb-10">
        <div className="text-eyebrow text-[var(--color-accent)] mb-2">Step 01 / Intake</div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold text-[var(--color-primary)]">
          Tell me about your training.
        </h2>
        <p className="mt-4 text-[var(--color-text-muted)] max-w-xl">
          Five minutes, mostly short fields. I'll read this before the consult so we can spend the call on what matters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <Field label="Your name" name="name" error={errors.name}>
          <input className="field-input" type="text" name="name" id="name" placeholder="First and last" />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input className="field-input" type="email" name="email" id="email" placeholder="you@example.com" autoComplete="email" />
        </Field>

        <Field label="Days you currently train per week" name="currentTrainingDays" error={errors.currentTrainingDays}>
          <select className="field-input" name="currentTrainingDays" id="currentTrainingDays" defaultValue="">
            <option value="" disabled>Choose…</option>
            {TRAINING_DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Cycle tracking status" name="cycleTrackingStatus" error={errors.cycleTrackingStatus}>
          <select className="field-input" name="cycleTrackingStatus" id="cycleTrackingStatus" defaultValue="">
            <option value="" disabled>Choose…</option>
            {CYCLE_STATUS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        <Field label="Main goal" name="mainGoal" error={errors.mainGoal} className="md:col-span-2">
          <select className="field-input" name="mainGoal" id="mainGoal" defaultValue="">
            <option value="" disabled>Pick the closest match…</option>
            {MAIN_GOAL.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        <Field
          label="Training history"
          name="trainingHistory"
          hint="A paragraph or two — what you've been doing the last 6–12 months, anything notable before that."
          error={errors.trainingHistory}
          className="md:col-span-2"
        >
          <textarea
            className="field-input"
            name="trainingHistory"
            id="trainingHistory"
            rows={5}
            placeholder="e.g. 4x/week lifting for 2 years, ran a half marathon last May, deload weeks always feel terrible…"
          ></textarea>
        </Field>

        <Field
          label="Injuries or anything else I should know"
          name="injuriesOrNotes"
          hint="Optional. Include anything that would affect programming — current niggles, past surgeries, sleep, perimenopause, etc."
          className="md:col-span-2"
        >
          <textarea
            className="field-input"
            name="injuriesOrNotes"
            id="injuriesOrNotes"
            rows={4}
            placeholder="Optional"
          ></textarea>
        </Field>
      </div>

      <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="consent" className="mt-1.5 w-4 h-4 accent-[var(--color-primary)]" />
          <span className="text-sm text-[var(--color-text)]">
            I'm okay with you reading this before our consult. Your training and cycle details stay between us.
            {errors.consent && <span className="block text-[var(--color-accent)] mt-1">{errors.consent}</span>}
          </span>
        </label>

        {submitError && (
          <p className="mt-6 text-sm text-[var(--color-accent)] border-l-2 border-[var(--color-accent)] pl-3">
            {submitError}
          </p>
        )}

        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <p className="text-xs text-[var(--color-text-muted)] max-w-md">
            No account needed. Nothing here is shared or sold. I'll come back to the email you provided within one working day.
          </p>
          <button type="submit" className="btn-primary" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Submit intake →"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, name, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-eyebrow text-[var(--color-text-muted)] block mb-2">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-[var(--color-text-muted)]">{hint}</p>}
      {error && <p className="mt-2 text-xs text-[var(--color-accent)]">{error}</p>}
    </div>
  );
}
