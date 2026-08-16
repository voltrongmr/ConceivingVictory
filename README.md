# Conceiving Victory — Standalone HTML Site

A self-contained, plain HTML/CSS/JavaScript site. **No build step. No framework.**
Open `index.html` in any browser, or upload the whole folder to any web host.

## Files

```
conceiving-victory/
├── index.html          ← The page
├── styles.css          ← All styling
├── script.js           ← Pricing, testimonials, and email booking links
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
- Session pricing cards with email-to-book links (`marcenesmarcus@gmail.com`)
- Steps, testimonials, and practice info