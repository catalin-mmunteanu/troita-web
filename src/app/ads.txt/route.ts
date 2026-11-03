import { adsTxtResponse } from "@/lib/ads-txt";

// Served at /ads.txt. Required by AdSense; empty (404) until ADS.client is set.
export function GET() {
  return adsTxtResponse();
}
