# Bogo Beverages page brief

Source: <https://bogobeverages.com/>  
Scope: homepage plus the main index/inner pages listed below.  
Local stack: Vite 5, React 18, hand-authored CSS (no copied WordPress/Elementor bundles).

## Route map

| Local | Source | File owner |
| --- | --- | --- |
| `/` | `/` | `src/App.jsx`, `Hero.jsx`, `Sections.jsx`, `Footer.jsx` |
| `/company/`, `/about-us/` | `/about-us/` | `src/components/Pages.jsx` (`CompanyPage`) |
| `/brands/` | `/brands/` | `src/components/Pages.jsx` (`BrandsPage`) |
| `/team/`, `/teams/` | `/team/` | `src/components/Pages.jsx` (`TeamPage`) |
| `/updates/` | `/updates/` | `src/components/Pages.jsx` (`UpdatesPage`) |
| `/contact/` | `/contact/` | `src/components/Pages.jsx` (`ContactPage`) |

Not cloned: brand detail pages, individual update stories, careers, legal pages.
Those links remain absolute URLs to the source and open externally.

## Homepage section order

1. Fixed-width black navbar over the hero: logo, About Us dropdown, Brands, Contact.
2. Hero at `90vh` above 1300 px: title left, animated `bogo-new.gif` right, scroll arrow.
3. About: `INNOVATION | EXPERIENCE | AMBITION`, one-line description, Learn More button.
4. Stats banner: 4 Countries, 150+ Premium Brands, 120+ Years Experience.
5. Brands band: 370 px tall black panel, intro column plus three 400 px cards.
6. Latest Updates: heading plus three image cards linking to source stories.
7. Footer: Company, Career, Links, Connect with us; social icon rows.

## Typography and tokens

- Poppins, locally hosted: 100, 400, 500, 700.
- Root font size 62.5%; body 16 px; paragraphs and lists 18 px.
- H1 96 px desktop, 36 px at `max-width: 767px`; H2 32 px uppercase; H3 24 px;
  H4 20 px; buttons 14 px.
- Colors: gold `#cc8f1b`, dark gold `#b67700`, yellow `#ffc700`, black, white.
- Bootstrap-like containers: 540/720/960/1140/1320 px at the standard breakpoints,
  7.5 px gutters, 3/4/8 column widths from 768 px.

## Key measurements

At a 390 px layout width, the rendered section heights were:

| Section | Height |
| --- | --- |
| Hero | 635.1 px |
| About | 405.5 px |
| Stats | 451.4 px |
| Brands | 1500.3 px |
| Updates | 1122.4 px |
| Footer | 1563.2 px |
| Document | 5728 px |

Source document height at the same width is about 5760 px. The difference is the
source's hidden ShareThis bar (about 32 px). Every named section height matched.

At a roughly 800 px layout width (775 px content area), section heights were:
hero 619.8 px, about 340.1 px, stats 272.6 px, brands 370 px, updates 353 px,
footer 970.1 px, document 2975 px. These also matched the source. At 1440 px,
section geometry matched without horizontal overflow.

Other responsive rules preserved from the source:

- Hero image 400 px at 576 px and up, 250 px below.
- Brands band fixed at 370 px from 768 px up, auto height below.
- Brand card 400 px at 993 px and up, 320 px from 768 to 992 px, 400 px on mobile.
- Brand bottle 150 px wide at 576 px and up, capped at 200 px on mobile.
- Mobile logo 120 px at `max-width: 575.98px`.
- Updates use three columns from 768 px up.
- Footer social icons 25 px with 15 px right margins.

## Assets

All source assets are local under `public/images` and `public/fonts`:

- Hero: `home_banner.png`, `bogo-new.gif`, `arrow-down.svg`
- About/stats: `globe.svg`, `award.svg`, `calendar.svg`, `stats-banner.png`
- Brands: `brand-bg.svg`, `granca.png`, `bottega-img.png`, `image-13.png`
- Updates: `we-are-live-1.png`, `Bottega-1.png`, `Gran-Castillo-1.png`
- Inner headers: `bg-1.png`, `brand-bg.svg`, `footer.png`
- Branding/social: `logo.png`, `favicon.png`, `fb.svg`, `logo-twitter.svg`,
  `logo-instagram.svg`, `logo-linkedin.svg`, `youtube.svg`
- Icons: `arrow-right.svg`
- Fonts: `Poppins-Light.ttf`, `Poppins-Regular.ttf`, `Poppins-Medium.ttf`,
  `Poppins-SemiBold.ttf`

## Interactions

- About dropdown toggles by click; Escape closes it. Mobile menu toggles the nav
  collapse and closes on item click.
- Hero scroll arrow anchors to `#about` with smooth scrolling.
- Brand cards, update cards, brand links, and nav/footer links preserve their source
  destinations; cloned index links stay local.
- Contact email/phone use `mailto:` and `tel:`.
- All images have alt text or are decorative with empty alt.

## Motion implementation

CSS keyframes plus one `IntersectionObserver` hook; no animation library.

- Logo fade-down: 0.8 s, 0.1 s delay.
- Nav items fade-down in sequence: 0.22 s, 0.32 s, 0.42 s delays.
- Hero image scale/fade: 1.1 s at 0.25 s.
- Source title `moveInLeft` retained, with `backwards` fill to avoid a pre-delay flash.
- Scroll arrow: fade-in at 0.9 s, then a 2.4 s looping 8 px nudge.
- Reveals: `data-reveal` targets, `--reveal-delay` stagger up to 240 ms, 0.9 s
  `revealUp`, threshold 0.15, `rootMargin: 0px 0px -40px 0px`, unobserved after reveal.
- Hover accents: 6 px card lift, 1.05 image zoom, 4 px arrow slide, 5 px stats icon
  float, 3 px button lift and gold fill.
- `prefers-reduced-motion: reduce` disables entrance/reveal animation, hover
  transforms, transitions, and smooth scrolling.
- `<noscript>` styles keep reveal content visible when JavaScript is unavailable.

## Comparison and checks

The source was captured as a standards-mode HTML mirror with its own assets and
compared against the local build at 390, 800, and 1440 px widths. Computed styles,
section geometry, document height, and overflow were compared; the first mirror
was missing a doctype and produced false line-box differences in quirk mode, which
disappeared once `<!doctype html>` was added. The comparison middleware and mirror
files were removed after verification.

Checks run:

- `npm run build` completes successfully.
- Lighthouse accessibility and best-practices scores are 1.0; the landing page uses
  a `main` landmark for the content between the hero and footer.
- No console errors on the landing page.
- All 14 `[data-reveal]` elements reveal after a full scroll at 390/800/1440.
- No horizontal overflow at tested widths.
- Hover states confirmed through real pointer input: brand card lift/image zoom/
  arrow slide, update card lift/image zoom, and button lift/gold fill.
- Mobile menu and dropdown interactions previously confirmed.

## Remaining differences

- The source's hidden ShareThis bar (about 32 px tall at mobile width) is not
  reproduced; it is not visible in the source design.
- Non-cloned routes navigate to the live source site rather than local pages.
- Comparison evidence is recorded as measurements and checks, not committed
  screenshot montages.
