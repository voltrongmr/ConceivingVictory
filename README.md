# Conceiving Victory — Standalone HTML Site

A self-contained, plain HTML/CSS/JavaScript site. **No build step. No framework.**
Open `index.html` in any browser, or upload the whole folder to any web host.

## Files

```
conceiving-victory/
├── index.html          ← The page
├── styles.css          ← All styling
├── script.js           ← Booking dialog + interactions
└── assets/
    ├── hero-therapy.jpg
    ├── therapist-1.jpg
    └── about-tea.jpg
```

## How to publish

Pick any of these — the site is just static files:

- **Netlify Drop** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — `vercel deploy` in this folder
- **GitHub Pages** — push to a repo, enable Pages on the main branch
- **Cloudflare Pages** — connect a repo or upload the folder
- **Any web host** — FTP/SFTP the folder to your server's web root

## Local preview

Just double-click `index.html`, or run a tiny server:

```bash
cd conceiving-victory
python3 -m http.server 8000
# then open http://localhost:8000
```

## What's inside

- Responsive layout (mobile + desktop)
- Smooth-scrolling anchor navigation
- 4-step booking dialog (session → date/time → details → mock payment → confirmation)
- Mock card-input formatting (no real charges — all client-side)
- Toast notifications

## To make payments real

The current "Pay" button simulates a charge. To accept real money you'd need a
backend (e.g. Stripe Checkout, Paddle, etc.) — that's beyond a static site.
