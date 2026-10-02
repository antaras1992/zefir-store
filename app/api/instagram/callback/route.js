import { exchangeCode, oauthState, syncInstagram } from "@/lib/instagram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const back = (msg) => Response.redirect(`https://www.zefircanada.ca/admin?ig=${encodeURIComponent(msg)}`, 302);

  if (url.searchParams.get("error")) return back(`error: ${url.searchParams.get("error_description") || "denied"}`);
  if (!code || state !== oauthState()) return back("error: invalid request");

  try {
    await exchangeCode(code);
    const r = await syncInstagram();
    return back(`connected, ${r.added} photos imported`);
  } catch (e) {
    console.error("Instagram callback error:", e);
    return back(`error: ${e.message}`);
  }
}
