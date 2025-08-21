<div align="center">

<!-- Banner / Typing headline -->

<a href="#">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=32&duration=2800&pause=800&color=2F80ED&center=true&vCenter=true&width=800&lines=My+Website;Clean+UI+%E2%80%A2+Subtle+Animations+%E2%80%A2+Node.js+Contact+Form;Built+with+HTML+%2B+CSS+%2B+JavaScript" alt="Typing SVG banner" />
</a>

<br/>

<!-- Shields -->

<p>
  <a href="https://github.com/jiyanshi622/my-website"><img alt="repo" src="https://img.shields.io/badge/GitHub-my--website-181717?logo=github"/></a>
  <img alt="status" src="https://img.shields.io/badge/status-active-success"/>
  <img alt="stack" src="https://img.shields.io/badge/stack-HTML/CSS/JS/Node-2F80ED"/>
  <img alt="issues" src="https://img.shields.io/github/issues/jiyanshi622/my-website"/>
  <img alt="stars" src="https://img.shields.io/github/stars/jiyanshi622/my-website?style=social"/>
</p>

<!-- Decorative wave -->

<img src="https://raw.githubusercontent.com/kamranahmedse/driver.js/master/assets/wave.svg" alt="wave divider" width="100%"/>

</div>

## ✨ Overview

A modern personal website with a responsive layout, smooth micro‑interactions, and a Node.js backend for handling contact form submissions. This repository includes:

* `index.html` — home/landing page
* `contact.html` — contact form page
* `style.css` — global styles, layout, and UI effects
* `script.js` — interactions (scroll/menus/buttons)
* `server.js` — Node.js server (Express-style) for form handling
* `.env` — environment variables (never commit secrets)
* `assests/` — images and static assets (note: folder name spelled **assests**)

> Tip: Consider renaming `assests/` ➜ `assets/` for consistency.

## 🌈 Live Demo

* **Local:** `http://localhost:3000` (or the port you configure)
* **Hosted:** `https://jiyanshi-dev.vercel.app/`

## 🧩 Features

* Responsive layout and mobile‑first design
* Smooth scrolling & subtle hover/active effects
* Animated sections on scroll (CSS + small JS helper)
* Contact form with backend route (e.g., email via SMTP)
* Basic form validation and toasts/alerts
* Production‑ready folder structure

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Backend:** Node.js (Express‑style server)
* **Tooling:** npm scripts, dotenv

## 📁 Project Structure

```text
my-website/
├─ assests/                 # images, icons, media (consider: assets/)
├─ .env                     # environment variables (NOT committed)
├─ contact.html             # contact page with form
├─ index.html               # homepage / landing
├─ package.json             # npm scripts and dependencies
├─ package-lock.json        # lockfile
├─ script.js                # client-side interactions
├─ server.js                # Node.js server (routes, mailer)
└─ style.css                # site-wide styles
```

## 🚀 Getting Started

### 1) Prerequisites

* **Node.js** ≥ 18
* **npm** ≥ 9

### 2) Clone & Install

```bash
# clone
git clone https://github.com/jiyanshi622/my-website.git
cd my-website

# install deps
npm install
```

### 3) Configure Environment

Create a `.env` file in the project root:

```env
PORT=3000
# SMTP (example using Gmail SMTP; use your provider)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
TO_EMAIL=your_email@example.com
```

> Never commit `.env`. Use provider‑specific settings for Outlook, Zoho, etc.

### 4) Run Locally

```bash
# if package.json has a dev script
npm run dev

# otherwise
node server.js
```

Then open `http://localhost:3000`.

## 📮 Contact Form — Quick Wiring

Inside `server.js`, ensure you:

1. Parse JSON/form bodies
2. Accept POST from `/contact` (or similar)
3. Send email using SMTP (e.g., `nodemailer`)

Example *minimal* Express route (for reference):

```js
import express from 'express'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public')) // or serve index.html from root

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
  await transporter.sendMail({
    from: `Website Contact <${process.env.SMTP_USER}>`,
    to: process.env.TO_EMAIL,
    subject: `New message from ${name}`,
    replyTo: email,
    text: message
  })
  res.json({ ok: true })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on http://localhost:' + (process.env.PORT || 3000))
})
```

## 🎞️ Screenshots & Promo GIFs

<div align="center">

| Desktop                                                                      | Mobile                                                                      |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| <img src="https://picsum.photos/800/450" width="600" alt="desktop preview"/> | <img src="https://picsum.photos/300/600" width="260" alt="mobile preview"/> |

<!-- Optional animated preview -->

<img src="https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif" alt="animated demo" width="75%"/>

</div>

> Tip: Replace with real screenshots when available, or keep placeholders.

## 🪄 Built‑in Animations & Effects (ready‑to‑use)

### Hover glow (buttons/links)

```css
.button, a.button {
  position: relative;
  display: inline-block;
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  transition: transform 160ms ease, box-shadow 160ms ease;
}
.button:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(47,128,237,.25); }
.button:active { transform: translateY(0); box-shadow: 0 6px 16px rgba(47,128,237,.35) inset; }
```

### Fade‑in on scroll (IntersectionObserver)

```js
const revealEls = document.querySelectorAll('[data-reveal]')
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed')
      io.unobserve(e.target)
    }
  })
}, { threshold: .08 })
revealEls.forEach(el => io.observe(el))
```

```css
[data-reveal] { opacity: 0; transform: translateY(16px); transition: .6s ease; }
.revealed { opacity: 1; transform: translateY(0); }
```

Usage:

```html
<section data-reveal> ... </section>
```

### Smooth anchor scrolling (native)

```css
html { scroll-behavior: smooth; }
```

## ✅ Accessibility & Performance

* Semantic HTML landmarks (`header`, `main`, `footer`)
* Sufficient color contrast; avoid text in images
* `alt` text for images and `aria-label`s for icons
* Minify CSS/JS for production; compress images (WebP/AVIF)

## 🧭 Roadmap

* [ ] Rename `assests/` ➜ `assets/`
* [ ] Add 404 page
* [ ] Add active nav link highlighting
* [ ] Add success/error UI for contact form
* [ ] Add unit test for `/contact` route
* [ ] Set up CI (lint + build on PRs)

## ☁️ Deployment

* **Static front‑end:** GitHub Pages / Netlify
* **Full stack:** Render / Railway / Vercel (Node server)

> For GitHub Pages (static only), you’ll need a hosted backend for the contact form or a service like Formspree.

## 🤝 Contributing

PRs welcome! Please open an issue to discuss major changes.

## 🔒 License

No license specified yet. Consider [choosing a license](https://choosealicense.com/).

---

<div align="center">

**Made with ❤️ by <a href="https://github.com/jiyanshi622">@jiyanshi622</a>**

</div>
