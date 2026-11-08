# Bogo Beverages website clone

A local Vite + React recreation of the [Bogo Beverages](https://bogobeverages.com/)
homepage and its main inner pages. Copy, imagery, fonts, layout measurements, and
interactions are reproduced from the live site; asset files are served locally.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173/>.

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build
```

## Routes

| Local path | Source path | Page |
| --- | --- | --- |
| `/` | `/` | Homepage |
| `/company/`, `/about-us/` | `/about-us/` | Company |
| `/brands/` | `/brands/` | Brands index |
| `/team/`, `/teams/` | `/team/` | Team |
| `/updates/` | `/updates/` | Updates index |
| `/contact/` | `/contact/` | Contact |

Trailing slashes are optional.

Brand detail pages, individual update stories, careers, and legal pages are not
cloned. Their links point to the original site.

## Motion

The landing page adds motion without changing the source layout:

- Staggered fade-down entrance for the logo and navigation items.
- Scale/fade entrance for the hero image, with the original title animation preserved.
- Fade-in plus a gentle nudge on the scroll-down arrow.
- Scroll reveals for the About, Stats, Brands, Updates, and footer-adjacent content,
  driven by one `IntersectionObserver` (`src/hooks/useScrollReveal.js`).
- Hover accents: card lift, image zoom, arrow slide, stats icon float, and button lift.
- Smooth anchor scrolling.
- Scroll-driven bottle background across the landing sections. A fixed,
  `aria-hidden` inline-SVG bottle sits behind the About, Stats, Brands, and
  Updates content. One GSAP timeline with a `ScrollTrigger` (`scrub: true`, no
  pin) raises the liquid from empty to full as the main content scrolls from top
  to bottom. The liquid is clipped to the bottle cavity; two looping waves form
  the surface, rising bubbles add depth, and the label glow and a brief light
  sweep resolve near the end. Wave amplitude reacts to scroll velocity and
  settles when scrolling stops. Section and card backgrounds remain behind the
  bottle, while headings, paragraphs, and links stay above it for legibility.

All motion is reduced under `prefers-reduced-motion: reduce`. In reduced-motion
mode the bottle is shown full immediately, wave and bubble motion is disabled,
and there is no scroll-driven fill. A `<noscript>` fallback keeps reveal content
visible without JavaScript.

## Structure

```text
src/
  App.jsx                  route selection and landing page wrapper
  components/              Hero, Navbar, BottlePour, Sections, Footer, inner pages
  data/content.js          copy, brand/update data, outbound source URLs
  hooks/useScrollReveal.js scroll-reveal observer
  styles.css               shared layout, page styles, motion
public/
  fonts/                   locally hosted Poppins weights
  images/                  local copies of source images, SVGs, and the hero GIF
```

The scroll-driven bottle uses [`gsap`](https://gsap.com/) and its `ScrollTrigger`
plugin (`npm install` installs both from the existing dependency).

## Checks

- `npm run build` passes.
- Lighthouse accessibility and best-practices scores are 1.0.
- Responsive checks at 320×568, 390×844, 775×518, 844×390, and 1440×900 show
  no horizontal overflow; the fixed bottle stays within the viewport.
- Bottle progress was checked against the main-content scroll range: at 0 the
  liquid is empty, at 0.5 it is half raised, and at 1 the liquid reaches `y: 0`,
  the label is bright, and the light sweep has passed.
- The reduced-motion branch was checked with a temporary `matchMedia` override:
  the bottle renders full and waves stay static.
- All 14 scroll-reveal targets become visible after scrolling through the page.
- Hero entrance, scroll arrow, brand/update card lift, image zoom, arrow slide, and
  button hover states were exercised in the browser.
- Section geometry matches the source at the tested widths. The source page has an
  extra hidden ShareThis bar that accounts for a roughly 32 px document-height
  difference at mobile width.

See [docs/research/bogo/page-brief.md](docs/research/bogo/page-brief.md) for source
notes, measurements, and the comparison log.
