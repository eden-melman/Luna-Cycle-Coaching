import type { APIRoute } from "astro";
import {
  COLLECTIONS,
  getWixClient,
  insertCmsItem,
  parseWorkshop,
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

  const parsed = parseWorkshop(body);
  if (!parsed.ok) return json({ ok: false, errors: parsed.errors }, 422);

  const data = parsed.data;

  try {
    const wix = await getWixClient();

    let cmsItemId: string | undefined;
    try {
      const inserted = await insertCmsItem(wix, COLLECTIONS.workshopEnquiries, {
        name: data.name,
        email: data.email,
        company: data.company,
        format: data.format,
        notes: data.notes ?? "",
        submittedAt: new Date().toISOString(),
        status: "new",
      });
      cmsItemId = inserted?._id ?? inserted?.dataItem?._id;
    } catch (err: any) {
      const msg = String(err?.message || err);
      console.warn("Workshops CMS insert failed", msg);
      if (/collection/i.test(msg) || /WDE\d+/i.test(msg)) {
        return json(
          {
            ok: false,
            error:
              "The Wix CMS 'WorkshopEnquiries' collection isn't set up yet. See SETUP.md.",
          },
          503,
        );
      }
      throw err;
    }

    const { contactId } = await submitContact(wix, {
      name: data.name,
      email: data.email,
      source: "Luna workshops enquiry",
    });

    return json({ ok: true, cmsItemId, contactId });
  } catch (err: any) {
    console.error("Workshop enquiry failed", err);
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
};

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
