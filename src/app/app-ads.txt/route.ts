import { adsTxtResponse } from "@/lib/ads-txt";

// Served at /app-ads.txt. AdMob checks it on the developer website listed in
// the Play Store, to authorise ads in the Android app.
export function GET() {
  return adsTxtResponse();
}
