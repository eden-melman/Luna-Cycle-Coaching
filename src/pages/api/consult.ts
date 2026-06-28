import type { APIRoute } from "astro";
import { CONFIG, getWixClient } from "../../server/wix";

export const prerender = false;

/**
 * GET /api/consult
 *
 * Returns (or 302s to) the Wix Bookings checkout URL for the free consult
 * service. The mobile sticky bar / nav button calls this so we never embed the
 * Wix booking calendar inline — it stays a facade, per the perf budget.
 *
 * Set WIX_CONSULT_SERVICE_ID env var to the booking service ID. See SETUP.md.
 */
export const GET: APIRoute = async ({ request, url, redirect }) => {
  const wantJson = url.searchParams.get("format") === "json" || request.headers.get("accept")?.includes("application/json");
  const origin = url.origin;
  const fallbackThanks = `${origin}/intake?from=consult-thanks`;
  const fallbackError = `${origin}/intake?error=consult`;

  if (!CONFIG.consultServiceId) {
    // No service configured yet — gracefully fall back to the intake page so
    // the CTA always lands somewhere useful. SETUP.md explains how to wire it.
    if (wantJson) {
      return json({ ok: false, url: `${origin}/intake`, reason: "WIX_CONSULT_SERVICE_ID not set" }, 200);
    }
    return redirect(`${origin}/intake`, 302);
  }

  try {
    const wix = await getWixClient();

    const session = await (wix as any).redirects.createRedirectSession({
      bookingsCheckout: {
        serviceId: CONFIG.consultServiceId,
        timezone: "Europe/London",
      },
      callbacks: {
        postFlowUrl: fallbackThanks,
        errorUrl: fallbackError,
        thankYouPageUrl: fallbackThanks,
      },
    });

    const redirectUrl =
      session?.redirectSession?.fullUrl ||
      session?.redirectSession?.shortUrl;

    if (!redirectUrl) {
      if (wantJson) return json({ ok: false, url: fallbackError, reason: "No redirect URL" }, 200);
      return redirect(fallbackError, 302);
    }

    if (wantJson) return json({ ok: true, url: redirectUrl });
    return redirect(redirectUrl, 302);
  } catch (err: any) {
    console.error("createRedirectSession failed", err);
    if (wantJson) return json({ ok: false, url: `${origin}/intake`, reason: String(err?.message || err) }, 200);
    return redirect(`${origin}/intake`, 302);
  }
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
