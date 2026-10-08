# Midnight & Coral design system

A small, framework-free design system for personal-brand and professional-services websites. It's plain CSS plus one optional JavaScript file, so it works on any static host, including GitHub Pages, Netlify and Vercel.

Open `index.html` in this folder through a local server to see every token, component and pattern rendered.

## Files

| File | What it holds | Reuse it? |
|---|---|---|
| `tokens.css` | Colors, type scale, spacing, radii, shadows, motion timings, all as CSS custom properties | Yes. This is the only file you edit to re-skin a project |
| `components.css` | Base styles plus every component and pattern, built only from tokens | Yes, copy it unchanged |
| `../assets/js/main.js` | Behaviour: sticky header, mobile menu, active nav, reveal-on-scroll, count-up, carousel, lightbox, back-to-top, contact form | Yes, copy it unchanged |
| `index.html` | Living style guide | Optional |

## Start a new project with it

1. Copy `tokens.css`, `components.css` and `main.js` into the new project.
2. In the page `<head>`, load the fonts, the two stylesheets, and add the `js` class (so reveal animations only hide content when JavaScript runs):

   ```html
   <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="design-system/tokens.css">
   <link rel="stylesheet" href="design-system/components.css">
   <script>document.documentElement.classList.add("js");</script>
   ```
3. Load `<script src="main.js" defer></script>` before `</body>`.
4. Re-skin by editing `tokens.css`. Change the brand colors to your palette, and swap `--font-sans` if you want another family (also change the Google Fonts link). Nothing else needs to change.

## Principles

1. **One accent.** Navy carries authority; coral is the only bright color. Use it for one highlighted phrase per heading, the most important button in a group, badges and numbers. Never for body text, and never with white text on top.
2. **Editorial calm.** Generous whitespace (`--space-section` between sections), one font family, regular weight, tight tracking on big type. Hierarchy comes from size and space, not from bold or color.
3. **Data as texture.** Monospace is reserved for small uppercase labels: eyebrows, dates, counters. It's a quiet nod to data and code, and never used for reading text.
4. **Quiet, purposeful motion.** Things fade up as they appear, highlighters draw in, numbers count up, buttons lift on hover. All of it switches off with `prefers-reduced-motion`.
5. **Accessible by default.** Text contrast meets WCAG AA, every target is 44px or more, controls are real `<a>` and `<button>` elements with labels, focus rings are visible, and the page works without JavaScript.

## Tokens (summary)

| Group | Tokens |
|---|---|
| Brand | `--color-ink` #121835 · `--color-navy` #1B2550 · `--color-navy-700` #2C3560 · `--color-coral` #F2776A · `--color-coral-600` #E8604F |
| Neutral | `--color-bg` #F5F6F9 · `--color-surface` #FFF · `--color-tint` #E7EAF4 · `--color-line` #D6D9E3 |
| Text | `--color-text` · `--color-text-muted` #474D63 · `--color-text-subtle` #575D73 · `--color-on-dark` · `--color-on-dark-soft` · `--color-on-dark-muted` |
| Type | `--text-display` 46→96px · `--text-h2` 36→64 · `--text-h3` 24→32 · `--text-h4` 22 · `--text-lead` 17→19 · `--text-body` 16 · `--text-small` 14 · `--text-caption` 13 · `--text-eyebrow` 12 |
| Space | `--space-1`…`--space-8` (4 → 64px) · `--space-section` 80→144px · `--gutter` 16→56px · `--container` 1280px |
| Shape | `--radius-sm` 6 · `--radius-md` 10 · `--radius-lg` 20 · `--radius-pill` · `--tap-target` 44px |
| Motion | `--ease-out` · `--duration-fast` 160ms · `--duration-base` 320ms · `--duration-slow` 700ms · `--duration-draw` 900ms |

## Components

| Component | Classes | Use for |
|---|---|---|
| Button | `.btn` + `--primary` / `--outline` / `--accent` / `--small` | Actions. One accent button per view |
| Icon button | `.icon-btn` (+ `--accent`) | Arrows, menu, close, back to top. Always add an `aria-label` |
| Badge | `.badge` + `.badge__dot` | Availability or status, once per page |
| Chip | `.chip-list` > `.chip` | Key words and tags |
| Date tag | `.date-tag` (+ `--current`) | Dates in timelines |
| Stat tile | `.stats` > `.stat` > `.stat__value` + `.stat__label` | Up to 3 headline numbers. Add `data-count` for count-up |
| Highlight | `.highlight` (light) / `.highlight--on-dark` | One key phrase per heading |
| Eyebrow | `.eyebrow` | Section labels |
| Language switch | `.lang-switch` > `a[aria-current="true"]` | Language toggle |
| Form | `.form` > `.form__row` > `.field` > `label` + `.input` | Contact forms (styled for dark backgrounds) |

## Patterns

### Sticky header with mobile menu
Transparent at the top of the page, frosted with a shadow once you scroll (`.is-scrolled` is added by JS). Under 860px the links collapse into a full-screen menu.

```html
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="#top">Name<span>.</span></a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav__links"><li><a class="nav__link" href="#about">About</a></li></ul>
      <a class="btn btn--primary btn--small" href="#contact">Get in touch</a>
      <button class="icon-btn nav__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">…</button>
    </nav>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true" inert>
  <div class="mobile-menu__top"><span class="brand">Name</span><button class="icon-btn mobile-menu__close" aria-label="Close menu">…</button></div>
  <ul class="mobile-menu__links"><li><a href="#about">About</a></li></ul>
</div>
```

### Section head
A mono eyebrow on the left, then a title with one highlighted phrase and an optional intro. Add `.section-head__row` to the body to put an action next to the title.

```html
<div class="section-head">
  <p class="eyebrow">Experience</p>
  <div class="section-head__body section-head__row">
    <h2 class="h2">Relevant <span class="highlight">experience</span></h2>
    <a class="btn btn--accent" href="cv.pdf" download>Download CV</a>
  </div>
</div>
```

### Split hero
The text column sits beside a photo that stretches to exactly the text's height (`align-items: stretch`; the image is absolutely positioned with `object-fit: cover`). On narrow screens the photo stacks underneath at a 440px minimum height. This layout lives in `assets/css/site.css` (`.hero`, `.hero__text`, `.hero__media`), so copy it from there.

### Service accordion
Collapsed rows give a one-screen overview: number, title with key-word chips, and a one-line description. Opening a row reveals its examples. It's built on native `<details>`, so it needs no JavaScript and works with the keyboard. On phones, the collapsed row shows only the number and title.

```html
<ol class="service-list">
  <li class="service">
    <details class="service__details">
      <summary class="service__summary">
        <div class="service__title-wrap">
          <span class="service__number" aria-hidden="true">01</span>
          <div><h3 class="h3">Title</h3><ul class="chip-list"><li class="chip">Key word</li></ul></div>
        </div>
        <p class="service__desc">One-sentence description.</p>
        <span class="service__toggle" aria-hidden="true">…plus icon svg…</span>
      </summary>
      <div class="service__more"><ul class="service__examples"><li>Example</li></ul></div>
    </details>
  </li>
</ol>
```

### Scroll timeline
A vertical line fills with coral as you scroll, and each dot lights up when it passes the reading line at 60% of the viewport (`main.js` sets `--progress` on `.timeline-wrap` and `.is-reached` on items). Entries are collapsed to date, role and organization; the details open on click.

```html
<div class="timeline-wrap">
  <span class="timeline__progress" aria-hidden="true"></span>
  <ol class="timeline">
    <li class="timeline__item">
      <span class="timeline__dot" aria-hidden="true"></span>
      <details class="timeline__details">
        <summary class="timeline__summary">
          <div class="timeline__date"><span class="date-tag date-tag--current">2023 – PRESENT</span></div>
          <div class="timeline__role"><h3 class="timeline__title">Role</h3><p class="timeline__org">Organization</p></div>
          <span class="timeline__toggle" aria-hidden="true">…chevron svg…</span>
        </summary>
        <ul class="timeline__points"><li>Achievement</li></ul>
      </details>
    </li>
  </ol>
</div>
```

### Brand mark
```html
<a class="brand" href="#top"><span class="brand__mark" aria-hidden="true">GR</span><span class="brand__name">Full Name</span></a>
```
The mark is an ink tile with a coral underline, and it inverts automatically inside `.dark-band` and `.mobile-menu`.

### Icons
Simple line icons (24px grid, 1.6px stroke, round caps) are drawn inline as SVG, so they take on the text color. In the service accordion, use `.service__icon` (coral disc) instead of a number.

### Carousel with lightbox
A native scroll-snap track (swipe works on touch with no library) showing 3, 2 or 1.15 slides depending on screen width. JS adds the arrows, counter, dots and keyboard support. Clicking a photo opens it full screen in a `<dialog id="lightbox">` (copy that markup from `index.html`).

```html
<div class="carousel" data-carousel aria-roledescription="carousel" aria-label="Photos">
  <div class="carousel__bar">
    <p class="eyebrow">In action</p>
    <div class="carousel__controls">
      <button class="icon-btn" data-carousel-prev aria-label="Previous">…</button>
      <span class="carousel__counter" aria-live="polite"></span>
      <button class="icon-btn icon-btn--accent" data-carousel-next aria-label="Next">…</button>
    </div>
  </div>
  <ul class="carousel__track" tabindex="0">
    <li class="carousel__slide">
      <button class="carousel__open" type="button" aria-label="Enlarge photo"><img src="photo.jpg" alt="…"></button>
      <p class="carousel__caption">Caption</p>
    </li>
  </ul>
  <div class="carousel__dots"></div>
</div>
```

### Dark band
The closing contact section and footer sit on `--color-ink` inside `.dark-band`. On dark, the heading highlight becomes coral text (`.highlight--on-dark`) instead of a marker stroke.

### Reveal on scroll
Add `.reveal` to any block to fade it up as it enters the viewport. Stagger neighbours with an inline `style="--reveal-delay: 120ms"`.

## Voice and content patterns

- Headlines are short statements of value, with the key phrase highlighted.
- Descriptions are written in the first person ("I turn business challenges into…") and kept to one sentence.
- Examples are concrete deliverables that start with a verb ("Designing…", "Assessing…").
- Numbers are rounded and end with a "+".
