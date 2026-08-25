# HA Landscape Inc. — website

Marketing site for a family-owned landscaping business (Lake & Cook County, IL, founded 2004).
Plain HTML/CSS/vanilla JS. **No build step, no dependencies, no framework.**

Serve it and open `http://localhost:8000`:

```bash
python3 -m http.server 8000
```

## Files

```
index.html      Home + Services & Work (filter gallery + lightbox) + Testimonials + Contact form
about.html      About — a separate page, not an anchor on index.html
css/styles.css  All styles. Design tokens (color, spacing, type, layout) live in :root at the top.
js/script.js    One IIFE, shared by both pages, section-commented in page order.
assets/images/  Gallery + hero photography, {category}-N.jpg
assets/icons/   logo-brick.png (used via CSS mask), favicons
Jobs/           Client's original unprocessed photos. Not used by the site.
robots.txt, sitemap.xml
README.md       Long-form history: client decisions, launch/DNS walkthrough, photo workflow.
```

Both pages duplicate the same top bar, header, mobile nav, SVG icon sprite, and footer — there is
no template or build step, so **a change to any of those must be made in both files**. Each page's
sprite only carries the icons that page actually uses.

## How things work

- **Gallery** (`#gallery-grid`): a horizontal snap-scroll carousel of `<button class="gallery-item">`.
  `data-category` is the only data attribute and it drives everything — the filter buttons hide
  non-matching items with `.is-hidden`. The lightbox reads everything out of the item's own markup
  (photo + `src`, category from the overlay eyebrow, caption text from the photo's `alt`), so items
  carry no duplicated title/src attributes. Each item has three distinct pieces of text and none
  should repeat another: the category eyebrow, a 2-5 word `.gallery-item-title`, and a full
  descriptive `alt` that doubles as the lightbox caption.
  Keep `overflow-anchor: none` on `#gallery-grid` — without it Chrome's scroll anchoring fights the
  "reset to start" on filter change.
- **Contact form** (`#quote-form`): client-side validation, optional photo upload (3 max, 5MB each),
  honeypot field. Submits from the browser to Web3Forms, one POST per key in
  `WEB3FORMS_ACCESS_KEYS` — every lead goes to *all* configured inboxes. No server of our own.
- **Header/top bar**: fixed; one scroll listener toggles `.is-scrolled` on both.
  `about.html` uses `.site-header--static` since it has no dark hero behind the header.
- **Motion**: hero slideshow, scroll reveals, and smooth scrolling all respect
  `prefers-reduced-motion`.

## Conventions

- The 5 service categories (Patios & Outdoor Living, Walkways & Driveways, Retaining Walls &
  Stonework, Landscaping & Garden Beds, Outdoor Kitchens) must stay in sync between the gallery
  filter buttons, `data-category` values, and the quote form's `<select>`.
- Customer-facing copy uses the full legal name **"HA Landscape Inc."**
- Copy voice: short, plain, what a real owner would say — not marketing-speak.
- No street address anywhere (service-area business, deliberate); the `LocalBusiness` JSON-LD has no
  `address` field on purpose. Light theme only, also on purpose.
- Some photo filenames use retired category prefixes (`brick-edging-*`, `patios-sidewalks-*`,
  `driveway-1`, `fire-pits-1`). Filenames are cosmetic; `data-category` is what matters.
- New photos: resize to ≤1600px long edge and convert to `.jpg` first
  (`sips -s format jpeg --resampleWidth 1600 in.heic --out assets/images/landscaping-19.jpg`).

## Status

Built and complete. The one thing left is going live — domain purchase, hosting, DNS, Google Search
Console / Business Profile. See the "Launch walkthrough" section of `README.md`.
