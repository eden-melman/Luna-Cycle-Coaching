import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";
import { contacts, submittedContact } from "@wix/crm";
import { services } from "@wix/bookings";
import { redirects } from "@wix/redirects";
// `astro:env/client` is the virtual module @wix/astro uses to surface
// WIX_CLIENT_ID at runtime — on the deployed Wix host it's the only path
// that resolves (process.env doesn't have it; import.meta.env is empty there).
import { WIX_CLIENT_ID as ASTRO_WIX_CLIENT_ID } from "astro:env/client";

// IDs for CMS collections we own. These must exist in the Wix dashboard
// (CMS → Collections) before items will persist. See SETUP.md.
export const COLLECTIONS = {
  intake: "Intake",
  workshopEnquiries: "WorkshopEnquiries",
} as const;

const env = (key: string): string | undefined => {
  const fromImport = (import.meta as any).env?.[key];
  if (fromImport) return String(fromImport);
  const fromProcess = typeof process !== "undefined" ? process.env?.[key] : undefined;
  return fromProcess;
};

export const CONFIG = {
  clientId:
    (ASTRO_WIX_CLIENT_ID as string | undefined) ||
    env("WIX_CLIENT_ID") ||
    env("PUBLIC_WIX_CLIENT_ID") ||
    "",
  /** Bookings service ID for the free consult. Set via `wix env set --key WIX_CONSULT_SERVICE_ID --value …`. */
  consultServiceId: env("WIX_CONSULT_SERVICE_ID") || "",
};

/**
 * Server-side Wix SDK client. Uses OAuth visitor tokens for anonymous writes.
 *
 * Lazy: tokens are generated on first call so we don't network on cold imports.
 */
export async function getWixClient() {
  if (!CONFIG.clientId) {
    throw new Error(
      "WIX_CLIENT_ID is not set. Pull env with `npx wix env pull` or set it in .env.local.",
    );
  }

  const client = createClient({
    modules: { items, contacts, submittedContact, services, redirects },
    auth: OAuthStrategy({ clientId: CONFIG.clientId }),
  });

  // Generate visitor tokens once per request handler.
  const tokens = await (client.auth as any).generateVisitorTokens();
  (client.auth as any).setTokens(tokens);

  return client;
}

/** Normalise + validate intake form payloads coming off the client. */
export interface IntakePayload {
  name: string;
  email: string;
  trainingHistory: string;
  currentTrainingDays: string;
  mainGoal: string;
  cycleTrackingStatus: string;
  injuriesOrNotes?: string;
}

export function parseIntake(form: FormData | Record<string, any>): {
  ok: true;
  data: IntakePayload;
} | {
  ok: false;
  errors: Record<string, string>;
} {
  const get = (k: string) =>
    form instanceof FormData ? String(form.get(k) ?? "").trim() : String(form?.[k] ?? "").trim();

  const data: IntakePayload = {
    name: get("name"),
    email: get("email"),
    trainingHistory: get("trainingHistory"),
    currentTrainingDays: get("currentTrainingDays"),
    mainGoal: get("mainGoal"),
    cycleTrackingStatus: get("cycleTrackingStatus"),
    injuriesOrNotes: get("injuriesOrNotes") || undefined,
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Please add your name.";
  if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Please add a valid email.";
  if (!data.trainingHistory) errors.trainingHistory = "A short paragraph is plenty.";
  if (!data.currentTrainingDays) errors.currentTrainingDays = "Pick a rough number.";
  if (!data.mainGoal) errors.mainGoal = "Pick the closest match.";
  if (!data.cycleTrackingStatus) errors.cycleTrackingStatus = "Pick whichever fits best.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data };
}

export interface WorkshopPayload {
  name: string;
  email: string;
  company: string;
  format: string;
  notes?: string;
}

export function parseWorkshop(form: FormData | Record<string, any>): {
  ok: true;
  data: WorkshopPayload;
} | {
  ok: false;
  errors: Record<string, string>;
} {
  const get = (k: string) =>
    form instanceof FormData ? String(form.get(k) ?? "").trim() : String(form?.[k] ?? "").trim();

  const data: WorkshopPayload = {
    name: get("name"),
    email: get("email"),
    company: get("company"),
    format: get("format"),
    notes: get("notes") || undefined,
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Please add your name.";
  if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Please add a valid work email.";
  if (!data.company) errors.company = "Add your company or team name.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data };
}

/**
 * Submit a contact through Wix CRM's public "submitted contact" endpoint. This
 * is the right path for unauthenticated form submissions — it creates or
 * updates a contact and tags the source as a marketing form.
 */
export async function submitContact(
  client: Awaited<ReturnType<typeof getWixClient>>,
  args: { name: string; email: string; phone?: string; source?: string },
): Promise<{ contactId?: string }> {
  const [first, ...rest] = args.name.split(/\s+/);
  const last = rest.join(" ");

  try {
    const res = await (client as any).submittedContact.appendOrCreateContact({
      info: {
        name: { first, last: last || undefined },
        emails: { items: [{ email: args.email, tag: "MAIN" }] },
        ...(args.phone ? { phones: { items: [{ phone: args.phone, tag: "MOBILE" }] } } : {}),
      },
      ...(args.source ? { passThroughData: args.source } : {}),
    });
    return { contactId: res?.contactId ?? res?.identityId };
  } catch (err) {
    // Swallow — contact creation should never block the form submission UX.
    console.warn("submitContact failed", err);
    return {};
  }
}

/**
 * Insert a row into a CMS collection. Returns the inserted item or throws.
 */
export async function insertCmsItem(
  client: Awaited<ReturnType<typeof getWixClient>>,
  collectionId: string,
  payload: Record<string, any>,
) {
  return (client as any).items.insert(collectionId, payload);
}

/**
 * Classify a Wix data SDK error. The SDK sometimes throws with an empty
 * `message` and the real code is only in `details.applicationError.code` —
 * so we check both. Returns a shape suitable for an API response.
 */
export function classifyWixDataError(err: any, collectionId: string): {
  status: number;
  body: { ok: false; error: string; code?: string };
} {
  const appError = err?.details?.applicationError ?? err?.applicationError;
  const code = appError?.code != null ? String(appError.code) : "";
  const description = String(appError?.description ?? "");
  const message = String(err?.message ?? "");

  const haystack = `${code} ${description} ${message}`;

  // Collection missing → WDE0025 (or any WDE-prefixed data error referencing the collection).
  if (/WDE\d+/i.test(haystack) || /collection/i.test(haystack)) {
    return {
      status: 503,
      body: {
        ok: false,
        error:
          `The Wix CMS '${collectionId}' collection isn't reachable (${code || "unknown"}). See SETUP.md. Your details have not been saved.`,
        code: code || undefined,
      },
    };
  }

  // Permission denied (visitor token lacks insert permission on the collection).
  if (code === "403" || /PERMISSION_DENIED|forbidden/i.test(haystack)) {
    return {
      status: 503,
      body: {
        ok: false,
        error:
          `The '${collectionId}' collection rejected the submission for permission reasons. Set its Add permission to 'Anyone' in the Wix dashboard. See SETUP.md.`,
        code: code || "403",
      },
    };
  }

  return {
    status: 502,
    body: {
      ok: false,
      error: description || message || "Persistence failed.",
      code: code || undefined,
    },
  };
}
