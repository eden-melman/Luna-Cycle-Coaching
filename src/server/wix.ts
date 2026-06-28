import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";
import { contacts, submittedContact } from "@wix/crm";
import { services } from "@wix/bookings";
import { redirects } from "@wix/redirects";

// IDs for CMS collections we own. These must exist in the Wix dashboard
// (CMS → Collections) before items will persist. See SETUP.md.
export const COLLECTIONS = {
  intake: "Intake",
  workshopEnquiries: "WorkshopEnquiries",
} as const;

// IDs for things provisioned in the Wix dashboard. Read from env so they can
// be set without redeploying. See SETUP.md.
const env = (key: string): string | undefined => {
  // Astro server-only env. Works with .env.local + Wix runtime env.
  const fromImport = (import.meta as any).env?.[key];
  if (fromImport) return String(fromImport);
  const fromProcess = typeof process !== "undefined" ? process.env?.[key] : undefined;
  return fromProcess;
};

export const CONFIG = {
  clientId: env("WIX_CLIENT_ID") || env("PUBLIC_WIX_CLIENT_ID") || "",
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
    const res = await (client as any).submittedContact.createSubmittedContact({
      info: {
        name: { first, last: last || undefined },
        emails: { items: [{ email: args.email, tag: "MAIN" }] },
        ...(args.phone ? { phones: { items: [{ phone: args.phone, tag: "MOBILE" }] } } : {}),
      },
      source: args.source ? { sourceType: "OTHER", appId: undefined } : undefined,
    });
    return { contactId: res?.identityId ?? res?.contactId };
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
