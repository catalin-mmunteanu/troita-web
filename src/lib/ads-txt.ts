import { ADS } from "./site";

/**
 * The ads.txt line that authorises Google to sell ads for this publisher.
 * "f08c47fec0942fa0" is Google's fixed certification authority ID.
 */
export function adsTxtResponse() {
  if (!ADS.client) return new Response("Not found", { status: 404 });
  const pub = ADS.client.replace(/^ca-/, "");
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
