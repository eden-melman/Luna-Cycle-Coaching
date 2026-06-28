import type { APIRoute } from "astro";
import {
  classifyWixDataError,
  COLLECTIONS,
  getWixClient,
  insertCmsItem,
  parseIntake,
  submitContact,
} from "../../server/wix";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      body = await request.formData();
    }
  } catch {
    return json({ ok: false, error: "Could not parse request body." }, 400);
  }

  const parsed = parseIntake(body);
  if (!parsed.ok) {
    return json({ ok: false, errors: parsed.errors }, 422);
  }

  const data = parsed.data;

  let wix;
  try {
    wix = await getWixClient();
  } catch (err: any) {
    console.error("getWixClient failed", err);
    return json(
      { ok: false, error: `Wix backend is not configured: ${err?.message || err}` },
      503,
    );
  }

  let cmsItemId: string | undefined;
  try {
    const inserted = await insertCmsItem(wix, COLLECTIONS.intake, {
      name: data.name,
      email: data.email,
      trainingHistory: data.trainingHistory,
      currentTrainingDays: data.currentTrainingDays,
      mainGoal: data.mainGoal,
      cycleTrackingStatus: data.cycleTrackingStatus,
      injuriesOrNotes: data.injuriesOrNotes ?? "",
      submittedAt: new Date().toISOString(),
      status: "new",
    });
    cmsItemId = inserted?._id ?? inserted?.dataItem?._id;
  } catch (err: any) {
    console.error("Intake CMS insert failed", err);
    const { status, body } = classifyWixDataError(err, COLLECTIONS.intake);
    return json(body, status);
  }

  const { contactId } = await submitContact(wix, {
    name: data.name,
    email: data.email,
    source: "Luna intake form",
  });

  return json({ ok: true, cmsItemId, contactId });
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
