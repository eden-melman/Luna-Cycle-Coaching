import { useMemo, useState } from "react";

const PHASES = [
  {
    id: "menstrual",
    name: "Menstrual",
    days: "Day 1–5",
    color: "#6E2A60",
    arc: [-45, 45],
    headline: "Recover with intent",
    bullets: [
      "Easy aerobic work, mobility, technique drills.",
      "Deload sessions protect the foundation.",
      "Iron-status awareness in heavy bleeders.",
    ],
    citation: "Sims, S.T., 2016 — recovery prioritisation in menstruation",
  },
  {
    id: "follicular",
    name: "Follicular",
    days: "Day 6–13",
    color: "#4A2545",
    arc: [45, 135],
    headline: "Build heavy",
    bullets: [
      "Front-load heaviest compound lifts.",
      "Skill acquisition window — motor learning sharpens.",
      "Progressive overload with confidence.",
    ],
    citation: "Sung et al., 2014 — follicular-phase strength gains",
  },
  {
    id: "ovulatory",
    name: "Ovulatory",
    days: "Day 14–16",
    color: "#C25A12",
    arc: [135, 225],
    headline: "Test the ceiling",
    bullets: [
      "PR attempts and high-power efforts.",
      "Technique-led — joint laxity also peaks.",
      "Sprint and plyometric work.",
    ],
    citation: "Reis et al., 1995 — peri-ovulatory peak strength",
  },
  {
    id: "luteal",
    name: "Luteal",
    days: "Day 17–28",
    color: "#8E4267",
    arc: [225, 315],
    headline: "Sustain, don't shrink",
    bullets: [
      "Hold intensity, adjust volume.",
      "Aerobic base + accessory work.",
      "Fueling and hydration matter more.",
    ],
    citation: "McNulty et al., 2020 — perceived effort in luteal phase",
  },
];

const r = 42;
const cx = 50;
const cy = 50;
const toRad = (d) => (d * Math.PI) / 180;
const pointOnCircle = (deg) => {
  const rad = toRad(deg - 90);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const arcPath = (from, to) => {
  const start = pointOnCircle(from);
  const end = pointOnCircle(to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
};

export default function PhaseWheelInteractive() {
  const [activeId, setActiveId] = useState("follicular");
  const active = useMemo(() => PHASES.find((p) => p.id === activeId), [activeId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
      <div className="md:col-span-5 flex justify-center">
        <div className="relative w-full max-w-[400px] aspect-square">
          <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="Interactive four-phase wheel">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E4D7DF" strokeWidth="9" opacity="0.45" />
            {PHASES.map((p) => {
              const isActive = p.id === activeId;
              return (
                <g key={p.id}>
                  <path
                    d={arcPath(p.arc[0], p.arc[1])}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={isActive ? 12 : 9}
                    opacity={isActive ? 1 : 0.45}
                    style={{
                      transition: "stroke-width 250ms ease, opacity 250ms ease",
                      cursor: "pointer",
                    }}
                  />
                  {/* Wider transparent hit area for tap targets */}
                  <path
                    d={arcPath(p.arc[0], p.arc[1])}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="18"
                    onClick={() => setActiveId(p.id)}
                    style={{ cursor: "pointer", pointerEvents: "stroke" }}
                    role="button"
                    aria-label={`Show ${p.name} phase details`}
                  >
                    <title>{p.name}</title>
                  </path>
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[var(--color-text-muted)]">
              {active.days}
            </span>
            <span
              className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mt-1"
              style={{ color: active.color }}
            >
              {active.name}
            </span>
          </div>
        </div>
      </div>

      <div className="md:col-span-7">
        <div className="flex flex-wrap gap-2 mb-8">
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              className={`px-4 py-2 text-[11px] tracking-[0.12em] uppercase font-semibold border transition-colors ${
                p.id === activeId
                  ? "bg-[var(--color-primary)] text-[var(--color-on-dark)] border-[var(--color-primary)]"
                  : "bg-transparent text-[var(--color-primary)] border-[var(--color-border)] hover:border-[var(--color-primary)]"
              }`}
              aria-pressed={p.id === activeId}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8">
          <div className="text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: active.color }}>
            {active.name} · {active.days}
          </div>
          <h3 className="mt-3 text-2xl md:text-3xl font-[family-name:var(--font-display)] font-semibold text-[var(--color-primary)]">
            {active.headline}
          </h3>
          <ul className="mt-6 space-y-3">
            {active.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-[var(--color-text)]">
                <span aria-hidden className="mt-2 inline-block w-2 h-2 shrink-0" style={{ background: active.color }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-eyebrow text-[var(--color-text-muted)]">
            Source · {active.citation}
          </div>
        </div>
      </div>
    </div>
  );
}
