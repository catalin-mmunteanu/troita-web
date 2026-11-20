import { SITE } from "@/lib/site";

// Served at /.well-known/assetlinks.json. Android checks it to verify the
// app's App Links: with it, a troita.ro link to a day, a month or a fast opens
// the Troița app when it is installed instead of asking which app to use.
// The app side is the autoVerify intent filter in the troita repo's
// AndroidManifest.xml.
//
// Empty until SITE.appSigningSha256 holds the release key's fingerprint, so
// nothing is claimed before there is a signed app to claim it.

export function GET() {
  const statements = SITE.appSigningSha256.length
    ? [
        {
          relation: ["delegate_permission/common.handle_all_urls"],
          target: {
            namespace: "android_app",
            package_name: SITE.androidPackage,
            sha256_cert_fingerprints: SITE.appSigningSha256,
          },
        },
      ]
    : [];
  return Response.json(statements, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
