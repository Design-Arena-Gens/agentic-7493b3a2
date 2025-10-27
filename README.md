# Atlas Agent — Real Estate AI Copilot

Atlas Agent is a Next.js application that combines Google Maps visualization with GPT-powered conversations to help buyers and agents evaluate real-world properties in San Francisco.

## ✨ Core Capabilities

- Interactive Google Maps canvas with tracked luxury condo + single-family listings
- Rich property cards with highlights, pricing, and status signals
- GPT-driven instant messaging that blends market intelligence, comps, and negotiation tips
- Tailwind-crafted dark UI tuned for Vercel deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Google Maps JavaScript API key with Maps JavaScript enabled
- OpenAI API key with access to GPT-4o models

### Installation

```bash
npm install
```

Create a `.env.local` file using the template below:

```bash
cp .env.example .env.local
```

Populate both `OPENAI_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to explore the agent.

### Production Build

```bash
npm run build
npm start
```

## 🗂️ Project Structure

```
src/
  app/
    api/chat/route.ts      # Streaming GPT responder
    components/            # Map, chat, property cards
    data/properties.ts     # Seeded SF property inventory
    page.tsx               # Main experience shell
```

## 🔌 Environment Variables

| Variable | Description |
| --- | --- |
| `OPENAI_API_KEY` | Server-side key used for GPT completions |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Exposed Maps JS key for visualization |

## 📦 Scripts

- `npm run dev` — Launch development server with hot reload
- `npm run build` — Compile for production
- `npm run start` — Serve production build
- `npm run lint` — Execute Next.js ESLint bundle

## 🧭 Roadmap Ideas

- Plug in live MLS data feeds or Supabase storage
- Layer in affordability calculators and lender integrations
- Enable saved searches + SMS/WhatsApp handoff

## 📝 License

MIT
