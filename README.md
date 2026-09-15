# HA Landscape Inc. — Website

A modern, conversion-focused marketing website for HA Landscape Inc., a local landscaping and gardening business. Built with plain HTML5, CSS3, and vanilla JavaScript — no framework, no build step.

**🟢 Live at [halandscaping.com](https://halandscaping.com/)** · deploys automatically on `git push` to `main` · last updated 2026-08-26

> **Resuming work?** Read `PROJECT.md` first (short, current-state orientation), then "Next steps" directly below. The two things most likely to trip you up: **`www.` is currently broken (522)**, and **you must bump `?v=` on the CSS/JS tags in both HTML files after editing them** — see "Deploying".

## Status — what's done, what's next

**Done:**
- Full site built: top utility bar, sticky header, hero with an auto-rotating photo slideshow, a merged "Services & Work" section (filterable horizontal-scroll gallery with prev/next arrows + lightbox), About (which also carries the former "Why HA Landscape Inc." value-prop content — see below), 4-step process, contact/quote form, footer. Every nav item, button, and link is functional — mobile menu, gallery filtering, carousel arrows, and lightbox all work and were tested in-browser.
- **The old standalone "Why HA Landscape Inc." section (`#why-us`) was merged into About.** It had no nav link anywhere (header, mobile menu, or footer all only linked to `#about`), so it was an orphaned section only reachable by scrolling, with content that overlapped About's anyway (both talked about approach/trust; "Licensed & Insured" was said in both). Now `#about` is: photo → "Who We Are" → "Our Approach" (merged intro from the old section) → the checklist (Personalized Service, Attention to Detail, Licensed & Insured — "Clear Communication" was cut afterward as a fourth item, it made the section feel crowded) reused via the existing `.value-list`/`.value-item` CSS. The "Who We Are" paragraph had its own "licensed and insured" mention trimmed since the checklist covers it now. The dedicated logo showcase image that used to sit in `#why-us` was dropped in the merge at first, then brought back shortly after as `#about`'s own pictured image (see the About bullet below) — so the logo now shows in the header, footer, *and* About, not just header/footer as originally landed here.
- **About was split out to its own page (`about.html`), and nav order changed to Home, Services & Work, Contact, About.** Previously About was a same-page anchor section (`#about`) between Services and Contact. The client wants the primary flow (Home → Services & Work → Contact) fast and uncluttered; About is a click away for whoever wants the deeper backstory, not a scroll-through. `about.html` duplicates the shared top bar/header/mobile nav/footer markup from `index.html` (no shared template/build step exists) — if those change, update both files. `js/script.js` is shared by both pages and is now defensive about elements that only exist on `index.html` (gallery/lightbox/contact form) so it doesn't error out on `about.html`.
- **Legal company name is "HA Landscape Inc."** — every customer-facing mention of the name across `index.html` uses the full "HA Landscape Inc." (page `<title>`, `og:title`, the `LocalBusiness` JSON-LD `name`, header/footer brand, logo `alt` text, About heading/copy, and the footer copyright line). Internal-only text (code comments in `css/styles.css`/`js/script.js`, this README's prose) still says the shorter "HA Landscape" — that's fine, it's not customer-facing — but any **new copy added to `index.html`** should use the full "HA Landscape Inc."
- **Real project photography** (replacing the old placeholder SVGs) drives the "Services & Work" gallery, filed under 5 current categories (via each gallery item's `data-category`):
  - Patios & Outdoor Living (`patios-outdoor-living`) — 24 photos
  - Landscaping & Garden Beds (`landscaping`) — 24 photos
  - Walkways & Driveways (`walkways-driveways`) — 9 photos
  - Retaining Walls & Stonework (`retaining-walls`) — 9 photos
  - Outdoor Kitchens (`outdoor-kitchens`) — 7 photos
  - 73 gallery photos total, every category now has 7+ (the old thin 1-photo categories — Driveway, Fire Pits — no longer exist as their own filters; the client re-shot/reorganized). "Decorative Ponds & Pools" was removed entirely as a category (not a service HA Landscape offers).
  - **Filenames still carry old, pre-consolidation category prefixes for some files** (`brick-edging-*.jpg`, `driveway-1.jpg`, `fire-pits-1.jpg`, `patios-sidewalks-*.jpg`) even though those aren't current filter categories anymore — they were re-tagged with a current `data-category` rather than renamed on disk. **The filename prefix is cosmetic/historical; the `data-category` attribute in `index.html` is the only thing that actually controls what filter/category a photo shows under.** New photos should use the current category name as the filename prefix (see "Adding more photography" below) — the mismatched legacy filenames are just left as-is, not worth a mass rename.
- **Hero section** (`#home`) is an auto-rotating slideshow of 6 real project photos (`.hero-slide` elements inside `#hero-slideshow`), crossfading every 6s via `js/script.js`, with a dark-green gradient scrim (`.hero-media::after`) for text contrast. Respects `prefers-reduced-motion` (no rotation, first photo only). Hero height is capped at `min(78vh, 700px)` rather than filling the full viewport.
- **Top utility bar** (`.top-bar`, ≥960px viewports only) shows both phone numbers and both emails above the header. It's `position: fixed`, scrolls out of view (`translateY(-100%)`) once the user scrolls past 24px, at which point the sticky header (already existing) locks to `top: 0` in its place — both driven by the same `updateHeaderState()` scroll listener in `js/script.js`. Hidden below 960px; mobile users get phone/email via the existing mobile nav panel instead.
- **Logo: the client's real brick-and-wordmark logo is now used in the header and footer.** It went through a few rounds before landing here: first a custom-drawn brick-wall motif, then a redrawn tree/sun/sprout mark, both rejected — then the client sent an actual logo file to use (`assets/icons/logo-brick.png`: brick-course icons flanking "H.A." with "Landscape Inc." below, two-line lockup). **Do not reintroduce a custom-drawn mark or a different logo file without being asked again.** The client's source file was a checkerboard-transparency PNG that had been flattened to JPEG (losing real alpha); it was reprocessed in-browser via canvas (luminance-threshold the checkerboard to transparent, keep the black linework, tight-crop to content bounds) to get `logo-brick.png`, a clean transparent PNG. It's applied via CSS mask (`background-color: currentColor` + `mask: url(...logo-brick.png)` on `.brand-mark`/`.footer-brand-mark`) so it automatically recolors — cream over the hero, dark green once the header is scrolled/opaque; the separate HTML brand-name text next to it is visually-hidden (`.sr-only`) since the wordmark is baked into the image. It briefly also had its own dedicated showcase image in the "Why HA Landscape Inc." section on a white card, but that section was merged into About shortly after (see above) — the `.value-media--logo` CSS from that no longer exists, don't recreate it without being asked.
- **About section image is the logo, not a photo.** It briefly used a real photo of the crew at work (`assets/images/about.jpg`, converted from a client-supplied `.heic`) after the Why-Us merge, but the client asked for the logo there instead (same brick logo used in header/footer, `assets/icons/logo-brick.png`, on a white card via `.about-media--logo` — same treatment the old `.value-media--logo` used before that was removed). The copy in `#about` was also tightened at the same time (shorter "Who We Are"/"Our Approach" paragraphs, shorter checklist item descriptions) — it had gotten dense after the merge. `assets/images/about.jpg` is unused now but left in place in case a photo goes back in there later.
- Site's max content width (`--container-width`) widened from 1200px to 1360px sitewide, so content uses more of the screen on wide monitors instead of clustering in a narrow centered column.
- The 5 current service categories — Patios & Outdoor Living, Walkways & Driveways, Retaining Walls & Stonework, Landscaping & Garden Beds, Outdoor Kitchens — drive the Services & Work filter bar and the quote form's dropdown (plus an "Other / Not Sure" catch-all option in the dropdown only, not a gallery filter). Confirmed founding fact (family-owned, founded 2004 by brothers Jose and Hugo Hidrogo, licensed & insured) and service area (Lake & Cook County, IL — Mundelein, Vernon Hills, Libertyville, Lake Forest, Highland Park, Deerfield, and surrounding towns) are reflected in the hero, About section, footer, and the `LocalBusiness` JSON-LD (`areaServed`).
- **Quote form has a working backend and a photo upload field.** Submissions POST straight to Web3Forms from the browser (`submitQuoteRequest()` in `js/script.js`) — no server of our own needed, and no build step required. Every lead is sent to **both** configured Web3Forms access keys (Alex's and Dad's) — 100% of leads reach both inboxes, not a split. The form also gained an optional photo upload (up to 3 photos, 5MB each) with inline previews, plus a honeypot field for basic spam protection now that the form is live-capable. Full details are under "Contact form" below.
- **Testimonials section added** (`#testimonials` in `index.html`, between Services & Work and Contact), three real Google reviews (Maria Hidrogo, Michael S., Chris Carney) in a 3-column card grid (`.testimonial-grid`/`.testimonial-card` in `css/styles.css`, stacks to 1 column below 720px). No nav link — it's meant to be hit scrolling from the portfolio down to Contact, not a menu destination. The reviews are pasted in as static text with the relative "X years ago" timestamp the client gave; they don't update themselves and will read as stale eventually — either refresh the copy periodically or swap in a live Google Reviews widget/API later. No star ratings are shown since the client didn't provide per-review star counts — don't invent 5-star ratings without confirming them.

- **Site is LIVE at [halandscaping.com](https://halandscaping.com/)**, hosted on Cloudflare Pages, auto-deploying from GitHub ([PunyAlex/ha-landscape-website](https://github.com/PunyAlex/ha-landscape-website)) on every push to `main`. See "Deploying" below.
- **Conversion pass (2026-08-26):** mobile call bar, trust strip, contact-detail ordering, and section-width alignment — see "Conversion pass" below.

**Next steps — start here tomorrow:**
1. **Fix `www.halandscaping.com` — it's broken.** It currently returns **HTTP 522** (Cloudflare "connection timed out"); the apex `halandscaping.com` returns 200 and works fine. The `www` DNS record exists and points at Cloudflare, but `www` was never attached to the Pages project as a custom domain, so nothing is serving it. Anyone who types "www." gets an error page. Fix: Cloudflare dashboard → Pages project → **Custom domains → Set up a custom domain** → `www.halandscaping.com`, then set the `www` → apex 301 (apex is canonical — it's what `og:url` and the `<link rel="canonical">` tags already use).
2. **Decide on the old domain `halandscape.com`** — still registered and currently returns 403 (parked, not redirecting). Either 301 it to `halandscaping.com` or let it lapse. See step 4 of the Launch walkthrough.
3. **Google Business Profile** — not created yet. Everything it needs (service-area setup, categories, hours, service-area towns) is pre-written in step 6 of the Launch walkthrough.
4. Optional polish, in priority order, from the UI review: link the testimonial cards to the Google Business Profile once it exists (adds credibility, drives reviews), and add a concrete response-time promise to the contact form note (e.g. "we'll call you back within one business day") **only if the business can actually commit to it** — it was deliberately left vague rather than inventing an SLA.

## Launch prep — done

Taking the site from dev to actually live (domain, hosting, DNS, SEO, Google Search Console/Business Profile). Started 2026-08-24, launched 2026-08-26. Kept for history and because the Google Business Profile step is still outstanding.

**Decisions made (settled, don't re-litigate):**
- **Domain: `halandscaping.com`**, bought via Cloudflare Registrar (~$10.44/yr at-cost, no markup). Not `halandscapeinc.com` — already registered by someone else (confirmed via WHOIS). The old site's domain, `halandscape.com` (Network Solutions/Bluehost), is untouched by this work; whether to 301-redirect it to the new domain or let it lapse is still an open call — see the Launch walkthrough below.
- **Service-area business, no public street address published** — client's choice. `LocalBusiness` JSON-LD in `index.html` deliberately has no `address` field (comment in the `<head>` explains why); Google Business Profile will be set up the same way (hidden address, listed service-area cities/counties).
- **No dark theme** — `<meta name="color-scheme" content="light">` is intentional, not an oversight.
- **Business hours: Mon–Sat, 7am–4pm** — in `index.html`'s JSON-LD as `openingHoursSpecification`; also needed for Google Business Profile.

**Done:**
- SEO/meta: `og:image`/`og:url`/JSON-LD `image`/`url` point at `https://halandscaping.com/...`; `<link rel="canonical">` on both pages; `robots.txt` + `sitemap.xml` at the project root; PNG favicon fallbacks (`favicon-32.png`, `apple-touch-icon.png`) alongside the SVG favicon.
- `assets/images/og-cover.jpg` created (1200×630, cropped from `outdoor-kitchens-1.jpg` — no people, no address, no blown-out sky). `og:image` and the JSON-LD `image` field resolve instead of 404ing.
- Fixed missing `<h1>` on `about.html` (was an `<h2>`).
- Contact form routing: every lead goes to **both** Alex and Dad (no longer a 50/50 split with Uncle Hugo) — see "Contact form" below.
- All 70 original real photos compressed via `sips` (40MB → 11.8MB, no visible quality loss); orphaned `assets/images/about.jpg` deleted.
- **House-number privacy pass:** a photo scan flagged 7 photos showing a client's house number or a person. Client decision: blur the address number rather than crop/drop it. Done — `landscaping-13.jpg`, `driveway-1.jpg`, `retaining-walls-4.jpg` (both the mailbox-plate number and a smaller instance on the house), `retaining-walls-7.jpg`, and `walkways-driveways-1.jpg` all have a soft feathered blur directly over just the digits (stonework/houses themselves untouched). `walkways-driveways-2.jpg` (a "SURVEILLANCE / KEYTH" yard sign — not an address) and `patios-outdoor-living-3.jpg` (unidentifiable face) needed no change.
- **Thin categories resolved:** client re-shot/reorganized so every gallery category now has 7+ photos — see the "Real project photography" bullet above and the category table in "Adding more photography" below, both already updated to match.
- Verified: no missing images, no broken internal links, gallery filter categories match the quote-form dropdown, all `<img>` have non-empty `alt`, title/meta description lengths in range, no `console.*`/TODO/Lorem-ipsum/localhost artifacts left in shipped code.
- **Launch walkthrough** (see below) — hosting deploy, DNS, HTTPS, Google Search Console + Business Profile steps, a recurring-cost table, and a phased go-live checklist. Steps 1–3 and 5 are done; **step 4 (old domain) and step 6 (Google Business Profile) are still outstanding**, and `www` still needs attaching per step 3.

- **Domain bought and live.** `halandscaping.com` is on Cloudflare Registrar, deployed via Cloudflare Pages connected to the GitHub repo, HTTPS auto-issued. Apex serves 200.
- **Google Search Console verified** — the `google-site-verification` meta tag is in `index.html`'s `<head>` (homepage only, which is all verification needs). Sitemap submission status not re-confirmed in the 2026-08-26 session; worth a check.

**Still outstanding:**
- `www.halandscaping.com` returns 522 — see "Next steps" at the top, item 1.
- Google Business Profile not created — Launch walkthrough step 6.
- Old domain `halandscape.com` redirect-or-lapse decision — Launch walkthrough step 4.

## Launch walkthrough

Step-by-step for taking the site live once the domain is purchased. Written for whoever actually clicks through it (Alex/client) — Claude can't do the account creation, payment, or DNS/verification clicks itself.

**1. Domain (client action, real money)**
- Buy `halandscaping.com` via Cloudflare Registrar (~$10.44/yr, at-cost, no markup).
- Cloudflare Registrar auto-adds the domain to a Cloudflare account/zone — no separate DNS host needed.

**2. Deploy to Cloudflare Pages (free)**
- In the Cloudflare dashboard: **Workers & Pages → Create → Pages**.
- Easiest path with no git repo yet: use **"Upload assets"** and drag in the project folder (`index.html`, `about.html`, `css/`, `js/`, `assets/`, `robots.txt`, `sitemap.xml`) — every deploy after that is a new manual upload.
- Better long-term: push this folder to a GitHub repo first, then connect Pages to it via **"Connect to Git"** — every `git push` auto-deploys, and there's a free preview URL per commit. Build settings: no framework, no build command, output directory `/` (root).
- Either way, Pages gives a free `*.pages.dev` URL immediately — use it to sanity-check the deploy before pointing the real domain at it.

**3. Point the domain at Pages**
- Cloudflare Pages → the project → **Custom domains → Set up a custom domain** → enter `halandscaping.com`. Since the domain's already on Cloudflare, this auto-creates the right DNS record (a `CNAME`/proxied record) — no manual DNS editing needed.
- Add `www.halandscaping.com` as a second custom domain the same way, then set the redirect direction (`www` → apex, or apex → `www`) in Pages' custom domain settings — pick one as canonical and 301 the other. Apex (no `www`) matches what's already in `og:url`/canonical tags in `index.html`/`about.html`, so redirect `www` → apex to match.
- HTTPS is automatic — Cloudflare issues and renews the certificate, nothing to configure.

**4. Old domain (`halandscape.com`) — still an open decision**
- It's on Network Solutions/Bluehost, untouched by any of this. Either 301-redirect it to `halandscaping.com` (keeps any existing links/bookmarks/search rankings working) or let it lapse. Redirecting is usually worth the ~$10-20/yr if the old domain has any existing traffic or backlinks; ask the client whether the old site ever ranked or got direct visits.

**5. Google Search Console**
- [search.google.com/search-console](https://search.google.com/search-console) → add property → **URL prefix**, `https://halandscaping.com/`.
- Verify via the **HTML meta tag** method (simplest — paste one `<meta>` tag into both `<head>`s and deploy) or **DNS record** method (add a TXT record in the Cloudflare DNS tab — no site changes needed, works even before deploy).
- Submit `https://halandscaping.com/sitemap.xml` under **Sitemaps**.

**6. Google Business Profile**
- [business.google.com](https://business.google.com) → create a profile as a **service-area business** (no storefront address shown publicly — matches the JSON-LD decision already made in `index.html`).
- Categories: "Landscaper" (primary), plus "Landscape designer" / "Masonry contractor" as secondary if relevant.
- Service area: the cities/counties already listed sitewide — Lake & Cook County, IL (Mundelein, Vernon Hills, Libertyville, Lake Forest, Highland Park, Deerfield, and surrounding towns).
- Verification for a hidden-address service-area business is commonly done by **video verification** now (walking the phone camera around a work vehicle/equipment/sign) — Google will present the available options once the profile is submitted; it varies by account.
- Set business hours to Mon–Sat, 7am–4pm (matches the JSON-LD `openingHoursSpecification` already in `index.html`).
- Once verified, add the real project photos (same ones already in `assets/images/`) and link to `https://halandscaping.com/`.

**Recurring costs (target: as close to $0 as possible)**

| Item | Cost | Notes |
|---|---|---|
| Domain (`halandscaping.com`) | ~$10.44/yr | Cloudflare Registrar, at-cost, no markup — same price to renew |
| Hosting (Cloudflare Pages) | $0 | Free tier, unlimited bandwidth for static sites |
| SSL/TLS certificate | $0 | Auto-issued and renewed by Cloudflare |
| Form backend (Web3Forms) | $0 | Free tier = 250 submissions/mo, well above expected lead volume |
| Google Search Console | $0 | Free |
| Google Business Profile | $0 | Free |
| Old domain (`halandscape.com`), if kept for redirect | ~$10–20/yr | Optional — only if redirecting rather than letting it lapse |
| **Total** | **~$10–30/yr** | Effectively just domain renewal(s) |

**Phased go-live checklist**

- [x] Client buys `halandscaping.com` via Cloudflare Registrar
- [ ] Client decision: 301-redirect `halandscape.com` to the new domain, or let it lapse — still open; currently 403/parked
- [x] Business hours confirmed (Mon–Sat, 7am–4pm) — already in the JSON-LD, still needs entering into Google Business Profile
- [x] Deploy site to Cloudflare Pages — connected to the GitHub repo, auto-deploys on push to `main`
- [x] Attach `halandscaping.com` as a custom domain, HTTPS confirmed working
- [ ] **Attach `www.halandscaping.com` and set the `www`→apex 301 — NOT done, currently 522**
- [ ] Re-check `og:image`/canonical URLs render correctly by pasting the live URL into a social-preview debugger
- [x] Google Search Console: property verified via meta tag — sitemap submission not re-confirmed, worth checking
- [ ] Google Business Profile: create, verify, add photos, confirm service-area + hours match the site
- [ ] Final smoke test on the live domain: mobile menu, gallery filters/lightbox, quote form submission (real end-to-end email test), all nav links

## Conversion pass (2026-08-26)

Post-launch round focused on lead capture. The layout was deliberately **not** restructured — hero → visual proof → social proof → contact is already the right shape for a contractor, and the filterable 71-photo gallery is the site's strongest asset. These were targeted gaps, not a redesign.

**Contact details now read in one consistent order everywhere — Hugo, then Jose.** Phone numbers are labelled with names (`847-727-0192 (Hugo)`, `847-738-0676 (Jose)`), and the emails were reordered to match in the top bar, footer, and Contact section on both pages. `847-738-0676` is Jose (Alex's dad); `847-727-0192` is Hugo (uncle). The `LocalBusiness` JSON-LD still carries Jose's number/email as the single canonical business contact — that's structured metadata for Google, not display order, and was left alone intentionally.

**Mobile call bar** (`.call-bar`, both pages). The top utility bar carrying the phone numbers is `display: none` below 960px, so on phones — where most landscaping leads originate — there was no always-reachable tap-to-call; you had to open the hamburger or scroll to the footer. Now a fixed bottom bar with **Call Hugo** (tap-to-call) + **Get a Quote**, hidden at ≥960px where the top bar takes over. Sits at `z-index: 940`, just under `.nav-mobile` (950), so the menu covers it when open, and pads for `env(safe-area-inset-bottom)`.

> It dials Hugo because his number is listed first everywhere. One tap beats a chooser — **swap the `tel:` href in both files if it should be Jose's.**

**`--call-bar-height` token.** Because the bar is fixed, anything anchored to the bottom of the viewport has to clear it. `.hero-content` and `.site-footer` both subtract this token from their bottom padding; it's `4rem` on mobile and **`0rem` at ≥960px** where the bar is hidden, so both self-correct at every width. Anything bottom-anchored added later should use the same token rather than a hardcoded offset. This was a real bug first: the bar sat *on top of* the hero's "Get a Free Quote" button (45px overlap at 320px, 10px at 375px).

**Trust strip** (`.trust-strip`, `index.html` only) — Licensed & Insured · Family-Owned Since 2004 · Free Estimates · Lake & Cook County, IL, in a band under the hero. Every claim was already on the site, just buried in the footer and on `about.html`; these are the exact things homeowners screen contractors on, so they now appear at decision time. Laid out as a **2×2 grid on phones**, widening to a single row at ≥860px — as a wrapping flex row it stacked into four lines (~153px of banner) on a 375px screen. Not added to `about.html`, which already covers the same ground in prose.

**Contact form note** — "Free estimates — no pressure, no obligation." is now bold on its own line rather than one line of fine print, since fear of pressure/cost is the main thing that stops people contacting a contractor. **No response-time promise was invented** ("we'll call within 24 hours" and similar) — that's a commitment the business has to actually keep. Add one if they can honour it.

**Photo upload simplified.** Was a label + dashed dropzone + button + hint paragraph — a button inside a button. Now a single full-width "Add photos" button matching the other form fields, with the "up to 3 photos, 5MB each" guidance preserved as an `aria-label` for screen readers. The invalid-state outline moved onto the button itself.

**Section widths aligned.** Contact was capped at 1040px while everything else used 1360px, so its edges didn't line up with the header, hero, or Services above it — cap removed. The hero content block and Services heading were both widened to 1100px so their intro paragraphs sit on one line, Services' internal spacing was tightened, and the gallery filter pills were centred.

**Verified at 320 / 375 / 414 / 768px** (via a throwaway iframe harness — window resizing was unreliable): hero CTAs and footer content clear the call bar at every width, trust strip is 2 rows everywhere, buttons don't wrap, `about.html` matches. Desktop rendering is byte-identical to before the mobile fixes.

> **Testing gotcha:** in an automated/backgrounded tab `document.visibilityState` is `"hidden"`, which suspends `IntersectionObserver` — so every `.reveal` element sits at `opacity: 0` and the page looks blank. That is a harness artifact, not a bug. Add `.is-visible` manually before inspecting layout:
> ```js
> document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
> ```

## Project structure

```
/
├── index.html          Home, Services & Work, Contact (single-page, anchor nav)
├── about.html          About — its own page, not part of the index.html scroll
├── css/
│   └── styles.css      Design system + all styles (CSS custom properties in :root)
├── js/
│   └── script.js       Header/top-bar scroll behavior, hero slideshow, mobile nav,
│                        smooth scroll, reveal animations, gallery filter +
│                        horizontal-scroll carousel + lightbox, contact form validation
├── assets/
│   ├── images/          Real project photography (.jpg), organized as
│   │                     {category}-N.jpg — see table below
│   └── icons/           Logo (logo-brick.png), favicon.svg
├── Jobs/                Client's original unprocessed photos — gitignored, NOT
│                          used by the site. ~89MB, deliberately never committed.
├── robots.txt           Allows all, points at the sitemap
├── sitemap.xml          index.html + about.html
├── PROJECT.md           Short orientation doc — read this first, it's the
│                          "how it works now" guide
└── README.md            This file — long-form history and client decisions
```

`PROJECT.md` and this README serve different purposes on purpose: **PROJECT.md** is the concise, current-state guide (file map, how the gallery/form/lightbox work, conventions to follow); **README.md** is the narrative record of what was decided and why, so past choices don't get silently re-litigated.

## Running locally

This is a static site — no build step, no dependencies. Just serve the folder:

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node
npx serve .
```

Then open `http://localhost:8000`.

You can also just double-click `index.html`, though a local server is recommended so relative asset paths and `fetch`-based future integrations behave the same as production.

## Deploying

**`git push` to `main` is the deploy.** Cloudflare Pages is connected to [PunyAlex/ha-landscape-website](https://github.com/PunyAlex/ha-landscape-website) and rebuilds automatically — no build command, no manual upload, usually live within a minute.

```bash
git add -A && git commit -m "..." && git push
```

**After editing `css/styles.css` or `js/script.js`, bump the `?v=` query on their tags in BOTH `index.html` and `about.html`** (currently `?v=2`):

```html
<link rel="stylesheet" href="css/styles.css?v=2">
<script src="js/script.js?v=2"></script>
```

This is not optional cosmetics. The host serves HTML with `max-age=0` (always revalidated) but CSS/JS with `max-age=14400` (**4 hours**). Without a bump, a returning visitor gets **new markup against stale CSS**, and new components render *unstyled rather than missing* — which looks like a broken layout, not an obvious cache problem. This bit us on 2026-08-26: the trust strip's checkmarks each dropped onto their own line and the mobile call bar lost its fixed positioning entirely, on a deploy that was actually correct. Verify a deploy landed with:

```bash
curl -s https://halandscaping.com/ | grep -o 'styles.css?v=[0-9]*'
```

## Adding more photography

Every category already has 7+ real photos. To add more to an existing category:

1. Drop the new photo(s) into `assets/images/` named `{category}-N.jpg` using the **current category name** as the prefix (e.g. next Landscaping photo is `landscaping-19.jpg`), continuing the number sequence for that prefix. Don't worry about colliding with old pre-consolidation prefixes (`brick-edging`, `driveway`, `fire-pits`, `patios-sidewalks`) still present in the folder — those are legacy filenames re-tagged into current categories, not a sequence you need to continue.
2. In `index.html`, inside `#gallery-grid`, copy an existing `<button class="gallery-item">` block *for that `data-category`* (not necessarily one with a matching filename prefix) and update the `<img>`'s `src`, `width`/`height`, and `alt` text to match the new photo. The overlay labels inside the block stay as they are — the lightbox reads the photo and its captions straight out of that markup.

| Category | `data-category` value | Count |
|---|---|---|
| Patios & Outdoor Living | `patios-outdoor-living` | 24 |
| Landscaping & Garden Beds | `landscaping` | 24 |
| Walkways & Driveways | `walkways-driveways` | 9 |
| Retaining Walls & Stonework | `retaining-walls` | 9 |
| Outdoor Kitchens | `outdoor-kitchens` | 7 |

Photos are resized so the longer edge is ≤1600px and re-encoded as `.jpg` before adding (originals are often HEIC/WEBP straight from a phone, several MB each) — keep doing this for new photos so the gallery stays fast. `sips` (built into macOS) handles both the format conversion and the resize:

```bash
sips -s format jpeg --resampleWidth 1600 source-photo.heic --out assets/images/landscaping-19.jpg
```

If a new category is ever needed, add a `<button class="filter-btn">` in the filter bar, a matching `<option>` in the quote form's service dropdown, and gallery items tagged with the new `data-category` — the filtering/lightbox JS is fully data-driven off `data-category` and needs no changes.

## Editing content

- **Services & Work** — this single section (`#services`) doubles as the services list and the portfolio: the filter buttons define the categories, and each photo in `#gallery-grid` is tagged to one via `data-category`. The gallery is a horizontally-scrolling, snap-aligned carousel (arrow buttons `#gallery-prev`/`#gallery-next` step by one item) rather than a wrapping grid.
  - **Gotcha:** `#gallery-grid` has `overflow-anchor: none` in `css/styles.css` — don't remove it. Without it, switching filters causes Chrome's scroll-anchoring to silently fight the "scroll back to the start" reset in `js/script.js`: revealing previously-hidden items *earlier* in DOM order (e.g. switching from "Landscaping" back to "All" reveals Brick Edging/Fire Pits/Patios items before it) shifts content and the browser auto-adjusts `scrollLeft` to compensate, landing the carousel mid-list instead of at the first photo. This was hard to spot because it only reproduces when the newly-revealed items sit before the currently-visible ones — filtering into a narrower category from "All" looks fine either way.
- **Hero slideshow** — the 6 rotating photos live directly in `index.html` as `.hero-slide` images inside `#hero-slideshow`; swap which real photos are featured there by changing `src`/`alt` on those 6 `<img>` tags (keep exactly one with `class="hero-slide is-active"` as the first-paint image).
- **Top bar** — phone/email links live in `.top-bar` near the top of `index.html`, right before `<header>`. Update in sync with the header's mobile menu (`.nav-mobile-contact`), the `#contact` section, and the footer if a number/email ever changes — four places total.
- **About** — the "Who We Are" and "Our Approach" copy in `#about` uses HA Landscape's confirmed founding info, kept short (see "Copy voice" below). The pictured image is the logo (`assets/icons/logo-brick.png`) on a white card (`.about-media--logo`), not a photo. The section also ends with the value checklist (Personalized Service, Attention to Detail, Licensed & Insured) — this used to be its own "Why HA Landscape Inc." section but was merged in (see Status above); the `.value-list`/`.value-item` CSS it uses still lives under the "Value checklist" comment in `css/styles.css`.
- **Logo (header/footer)** — `assets/icons/logo-brick.png`, applied via CSS mask (`.brand-mark` / `.footer-brand-mark`) so it recolors with `currentColor`. If the client ever sends a replacement logo file, it needs the same checkerboard-transparency cleanup + tight crop described above before dropping it in — a raw export will likely have a huge transparent margin and/or a baked-in checker pattern instead of real alpha.
- **Service area / address** — city/county coverage is in the hero, About, footer, and the JSON-LD `areaServed`. No street address is published anywhere on purpose (service-area business, client's choice — see "Launch prep" above), not because one hasn't been provided.
- **Copy voice** — the client explicitly wants marketing copy that reads quick, plain, and human — not generic AI/marketing-speak. Concretely: short sentences, no flowery phrases ("bring your vision to life," "long-term beauty and health of your property"), cut filler lines that just restate the obvious (e.g. a services intro didn't need to also say "browse examples below" right above a filter bar). When rewriting any section's copy, default to what a real business owner would actually say out loud, not what sounds impressive.

## Contact form

The quote form (`#quote-form`) has full client-side validation (required fields, email format, basic phone format), an optional photo upload field, and clear success/error states. It sends real emails via **Web3Forms** — no server of our own.

**Why Web3Forms:** it's free, needs no backend/build step (fits a plain static site), and supports file attachments on the free tier — unlike Formspree (attachments need a paid plan) or EmailJS (tighter attachment limits, more setup). All submission logic is isolated in one function in `js/script.js`:

```js
function submitQuoteRequest(data) {
  // POSTs directly to Web3Forms' API as multipart/form-data
  // (needed because data.photos is an array of File objects).
}
```

**Routing — 100% to both, not a split.** Every submission is sent to **every** Web3Forms access key listed in `WEB3FORMS_ACCESS_KEYS`, via one POST request per key (`Promise.all` in `submitQuoteRequest()`). Currently that's Alex and Dad — every lead reaches both inboxes:

```js
var WEB3FORMS_ACCESS_KEYS = [
  '718cd8bc-8908-4418-a0d4-a4931b243957', // Alex
  '9544c81c-ddc5-4c8b-afe8-5de368cdb5e6'  // Dad
];
```

An earlier version of this randomly routed each lead to exactly one of two recipients (Dad or Uncle) to avoid double replies. That's no longer the setup — Uncle is no longer a recipient, and the client decided a double reply between Alex and Dad is fine. To change who gets notified, add/remove/replace entries in the array above — each needs its own Web3Forms access key with its recipient email set on web3forms.com.

**Photo upload** — the "Add Photos" field (`#field-photos`) accepts up to 3 images, 5MB each, JPG/PNG/WEBP only, all enforced client-side with inline error messages (`#error-photos`). Selected photos render as removable thumbnails (`#upload-preview-list`) and are attached to the outgoing email under the `attachment` field name, since Web3Forms needs `multipart/form-data` (not JSON) to receive files.

**Spam protection** — a hidden honeypot checkbox (`name="botcheck"` in the form, visually hidden via `.form-honeypot` in `css/styles.css`) follows Web3Forms' convention: real users never see or fill it, but simple bots that fill every field in a form will trip it.

**Testing locally:** the Web3Forms forms for both keys were registered with `localhost` as their site, so local testing works — serve the site (see "Running locally" above) and submit the form for real; the email will actually arrive.

## Design system

All colors, spacing, radii, shadows, typography, and layout widths (including `--container-width: 1360px` and `--topbar-height`) are defined as CSS custom properties at the top of `css/styles.css` (`:root`). Changing the palette, spacing scale, fonts, or overall content width site-wide only requires editing values in that one block.

## Browser support / accessibility

- Semantic HTML, labeled form fields, keyboard-operable nav/gallery/lightbox, visible focus states, `aria-live` form status, skip-to-content link.
- Respects `prefers-reduced-motion` (scroll reveals, smooth scrolling, and the hero slideshow are disabled/instant for users who request reduced motion).
- No horizontal overflow at common breakpoints (mobile, tablet, laptop, desktop).

## A note on this session's workflow

Photos were supplied a batch at a time, with the client specifying which category each batch belonged to (occasionally with some photos not matching the stated category — e.g. some old "Patios & Side Walks" photos were really retaining-wall- or landscaping-dominant shots but were filed as directed). The later category consolidation (7 narrow categories → 5 broader ones, see "Real project photography" above) folded most of those old narrow categories into wider ones, which likely resolved some of this on its own — but it was a category-level merge, not a photo-by-photo re-check, so individual photos filed in the wrong category may still exist. If asked to "clean up categories to better match the photos," treat that as still a legitimate open task, not something already done.
