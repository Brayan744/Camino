# 📖 Camino de la Palabra

> Bible-study web app for couples: read the Bible together, chapter by chapter.
> App de estudio bíblico en pareja: recorran la Biblia juntos, capítulo a capítulo.

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

## ✨ Features
- 📖 **One book at a time** — mark chapters as read and unlock the next book (starting with the Pentateuch).
- 💬 **A chat per chapter** — share messages, photos and voice notes while reading.
- 🔥 **Streaks** — keep a daily reading habit together.
- 🗺️ **Maps & timelines** — place each story in its location and historical moment.
- 🔔 **Web push notifications** to remind each other to read.
- 📱 **Installable** as a PWA (web app manifest and icons).

## 🛠️ Tech stack
- **Frontend / Backend:** Next.js 14 (App Router, API routes), React 18
- **Styling:** Tailwind CSS, lucide-react icons
- **Database:** PostgreSQL (`pg`)
- **Notifications:** `web-push`
- **Deployment:** Docker

## 📁 Structure
```
src/
├── app/          # Pages, auth (/entrar) and API routes
├── components/   # UI components
├── data/         # Books, chapters, outlines, places, timeline, recaps
└── lib/          # Auth and database helpers
```

## 🚀 Run locally
```bash
npm install
npm run dev
```
Environment variables (`.env.local`):
```
DATABASE_URL=postgres://user:password@host:5432/camino
SESSION_SECRET=change-me
UPLOAD_DIR=./uploads
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:you@example.com
```
Or with Docker:
```bash
docker build -t camino .
docker run -p 3000:3000 --env-file .env camino
```

## 👤 Author
**Brayan Muñoz** — Systems Engineer · [LinkedIn](https://www.linkedin.com/in/brayan-de-jesus-mu%C3%B1oz-acu%C3%B1a-335444349/)
