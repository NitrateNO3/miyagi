# Miyagi — The Communication Champ

React + Vite site with a client-editable admin panel.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Before launch
- **Music:** put the Miyagi track at `public/audio/miyagi-theme.mp3`. The "Sound" toggle in the nav plays it, and the hero waveform reacts to it live.
- **Payments:** copy `.env.example` to `.env` and set `VITE_RAZORPAY_KEY_ID`. Without a key, checkout runs in demo mode. In production, create Razorpay orders and verify payments on a backend.
- **Admin:** `/admin` (link in the footer: "Team login"). The demo password is in `.env.example`. Data is stored in the browser's localStorage for now; swap the actions in `src/store/Store.jsx` for API calls when the backend is ready.
- **Content:** programs, team, testimonials and seed events/posts are placeholders in `src/data/`.

## Structure
- `src/pages`: Home, About, Team, Programs, Program detail (×8), Corporate, Events, Event detail + checkout, Journal, Post, Contact, Admin, 404
- `src/components`: nav, footer, page transitions, preloader, cursor, waveform, posters, cards
- `src/styles`: design tokens (`global.css`), components, pages
