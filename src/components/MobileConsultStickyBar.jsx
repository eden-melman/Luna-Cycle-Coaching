import { useEffect, useState } from "react";

export default function MobileConsultStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only render on mobile-width viewports. Hide after the first viewport height so it's not duplicating the hero CTA.
    const compute = () => {
      if (typeof window === "undefined") return;
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      const scrolled = window.scrollY > window.innerHeight * 0.4;
      const path = window.location.pathname;
      const isIntake = path.startsWith("/intake");
      setVisible(mobile && scrolled && !isIntake);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2"
      role="region"
      aria-label="Book a free consult"
    >
      <a
        href="/api/consult"
        className="flex items-center justify-center gap-2 w-full bg-[var(--color-primary)] text-[var(--color-on-dark)] py-4 text-xs font-semibold tracking-[0.12em] uppercase shadow-[0_-6px_18px_-12px_rgba(42,18,38,0.45)]"
      >
        Book a free consult
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
