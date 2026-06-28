import type { APIRoute } from "astro";
import {
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

  try {
    const wix = await getWixClient();

    // 1) Persist to the CMS collection so the coach has a queryable record.
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
      // If the collection isn't provisioned yet, surface a useful 503 so the user
      // can complete the SETUP.md steps without losing the submission.
      const msg = String(err?.message || err);
      console.warn("CMS insert failed", msg);
      if (/collection/i.test(msg) || /WDE\d+/i.test(msg)) {
        return json(
          {
            ok: false,
            error:
              "The Wix CMS 'Intake' collection isn't set up yet. See SETUP.md and re-deploy. Your details have not been saved.",
          },
          503,
        );
      }
      throw err;
    }

    // 2) Create a Wix Contact so the lead appears in the Wix CRM Contacts list.
    const { contactId } = await submitContact(wix, {
      name: data.name,
      email: data.email,
      source: "Luna intake form",
    });

    return json({ ok: true, cmsItemId, contactId });
  } catch (err: any) {
    console.error("Intake submission failed", err);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
