import { useState } from "react";

export default function NavConsultButton() {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);

    // Try the Wix Bookings facade first; the endpoint either 302s to the
    // booking page or returns a fallback intake URL when no service is wired.
    try {
      const res = await fetch("/api/consult?format=json", { credentials: "same-origin" });
      if (res.ok) {
        const payload = await res.json();
        if (payload?.url) {
          window.location.href = payload.url;
          return;
        }
      }
    } catch {
      /* fall through */
    }
    window.location.href = "/intake";
  }

  return (
    <button type="button" className="btn-primary" onClick={onClick} disabled={busy}>
      {busy ? "Opening…" : "Book a free consult"}
    </button>
  );
}
