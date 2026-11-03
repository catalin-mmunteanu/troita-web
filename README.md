# troita-web

The website for **Troița**, the Romanian Orthodox calendar app: [www.troita.ro](https://www.troita.ro).

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind 4 · deployed on Vercel. The whole site is in Romanian.

## What's on it

| Route | What | Rendering |
|---|---|---|
| `/` | Landing page: app tabs, today's saint, "În curând pe Google Play" | static, re-rendered every 15 min |
| `/azi` | Today's saint, fast and the next 7 days | static, re-rendered every 15 min |
| `/calendar-ortodox`, `/[an]`, `/[an]/[luna]` | Calendar per year and month (2026, 2027) | fully static |
| `/posturi`, `/[an]`, `/[an]/[post]` | The four great fasts, day by day | fully static |
| `/despre`, `/confidentialitate` | About, privacy policy (also the URL for Play Console) | fully static |

`sitemap.xml`, `robots.txt`, the Open Graph image and icons are generated from `src/app/`.

## Where the calendar comes from

`data/seed-export.json` is exported from the **app's own seed database**, so the site and the app can never disagree.
`src/lib/liturgical.ts` is a port of the app's Dart engine (`lib/core/liturgical/`). If a fasting rule changes in the app, change it here too.

After rebuilding the app seed (`tool/update_data.py` in the `troita` repo):

```bash
python3 scripts/export-calendar.py ../troita/android/app/src/main/assets/seed/churches.db
```

Only names, ranks, fasting levels and notes are exported. The sinaxar texts and saint images stay in the app: they belong to the sites they came from. A new year (e.g. 2028) appears on the site automatically once it is in the seed's `published_years`.

## Screenshots

Drop real screenshots into `public/screenshots/` as `calendar.png`, `posturi.png`, `harta.png` and `profil.png` (`.webp` and `.jpg` also work). Portrait, about 1080×2340. Each one replaces the drawn phone screen for that tab automatically on the next build.

## Launch day

1. In `src/lib/site.ts`, set `playStoreUrl` to the Play Store link. Every "În curând" label becomes a "Descarcă" button.
2. Optionally swap that button for the official "Get it on Google Play" badge (Romanian version, unaltered, at least 28px tall). Before launch, Google's brand rules only allow the "Pre-register" badge, which is why there's no badge now.
3. Add a `MobileApplication` node to the JSON-LD in `src/app/layout.tsx` (see the comment there).

## Ads (Google AdSense) and cookies

Everything ad-related is off until you fill in `ADS` in `src/lib/site.ts`:

1. Create the AdSense account and add the site `troita.ro`. Copy your publisher ID (`ca-pub-…`) into `ADS.client` and deploy. That one value turns on:
   - the AdSense script and the `google-adsense-account` meta tag (site verification);
   - `/ads.txt` and `/app-ads.txt` (the second is what AdMob checks for the Android app);
   - the "Preferințe cookie" link in the footer.
2. In AdSense → **Privacy & messaging**, create and publish the **European regulations (GDPR)** message in Romanian. This is Google's own cookie banner (a Google-certified CMP, required for ads in the EEA). It loads with the AdSense script; there is no banner code in this repo.
3. Either turn on **Auto ads**, or create a responsive display ad unit and put its ID in `ADS.slots.inContent`. The manual slots sit on `/azi`, the month pages, the year pages and the fast pages, labelled "Publicitate", with space reserved so the page doesn't jump.
4. If you use Auto ads, consider switching off **vignette** (full-screen) ads in the Auto ads settings. Full-screen ads on mobile are what Google Search ranks down.

The privacy policy at `/confidentialitate` already covers AdSense on the site and AdMob in the app.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, what Vercel runs
```

## Deploy (Vercel + GitHub)

1. Push this folder to `github.com/catalin-mmunteanu/troita-web`.
2. In Vercel: **Add New → Project → Import** the repo. The framework is detected as Next.js; no settings or environment variables are needed.
3. **Settings → Domains**: add `www.troita.ro` and `troita.ro`. Make `www.troita.ro` the primary domain and let `troita.ro` redirect to it (Vercel offers this when you add the apex). At your registrar, set the DNS records Vercel shows: an `A` record for `troita.ro` and a `CNAME` for `www`.
4. **Analytics → Enable** (Web Analytics, cookieless; already wired in the code).

Every push to `main` deploys to production; every other branch gets a preview URL.

## Google Search Console

1. Add a **Domain property** for `troita.ro` and verify it with the DNS TXT record GSC gives you. This covers www and non-www, http and https.
2. **Sitemaps → Add** `https://www.troita.ro/sitemap.xml`.
3. Use **URL inspection** on `/`, `/azi` and `/posturi` and request indexing.
