# gustavoramirez: personal website

A static personal website (English) built on the **Midnight & Coral** design system. There's no build step, no framework and no dependencies, so it's ready for GitHub Pages.

```
website/
├── index.html              the page
├── assets/
│   ├── css/site.css        page-specific layout (hero, contact, footer)
│   ├── js/main.js          all interactions
│   ├── img/                photos + favicon
│   └── cv/                 put Gustavo-Ramirez-CV.pdf here
├── design-system/          reusable tokens, components, style guide, docs
└── tools/serve.ps1         local preview server (Windows)
```

## Preview locally

```bash
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

Then open http://localhost:8080/ for the site and http://localhost:8080/design-system/ for the style guide. Opening `index.html` by double-clicking also works in most browsers.

## Before publishing

1. **CV:** save your CV as `assets/cv/Gustavo-Ramirez-CV.pdf`. The Download CV button points to this file.
2. **Contact form:** by default, Send opens the visitor's email app with the message pre-filled, addressed to gustavo_rp@yahoo.com. To receive messages directly without that step:
   1. Create a free form at https://formspree.io. It gives you an address like `https://formspree.io/f/abcdwxyz`.
   2. Paste it into `data-endpoint=""` on the `<form>` in `index.html`.
3. **Photos:** the current photos are 595px wide, which looks slightly soft on large and retina screens. Replace them with versions about 1600px wide, keeping the same file names in `assets/img/`.

## Publish on GitHub Pages

1. Create a new GitHub repository (for example `gustavoramirez.github.io` for a root-domain site, or any name for a project site).
2. Upload the **contents** of this `website/` folder to the repository root, either from the GitHub web UI ("Add file → Upload files") or with git.
3. In the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After about a minute the site is live at `https://<username>.github.io/` (or `https://<username>.github.io/<repo>/`). All links are relative, so both addresses work.
5. Optional custom domain: add it under Settings → Pages → Custom domain and follow GitHub's DNS instructions.

## Editing content

- All text lives directly in `index.html`.
- Visitors who prefer Spanish or another language can use their browser's built-in "Translate this page".
- To add a carousel photo, put the image in `assets/img/` and copy one `<li class="carousel__slide">…</li>` block. The counter, dots and lightbox update automatically.
- To add a role, copy one `<li class="timeline__item">…</li>` block. Use `date-tag--current` for current roles.
- Colors, fonts and spacing are in `design-system/tokens.css`. See `design-system/README.md`.
