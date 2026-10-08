<div align="center">

# 🛡️ SafeHer

**A real-time women's safety platform — because every woman deserves to feel safe.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

### 🚨 SOS Engine
One-tap emergency alerts with a countdown modal — sends live GPS coordinates to all registered guardians via SMS, WhatsApp, and call. Automatically dispatches to emergency services.

### 🗺️ Live Safety Map
Interactive map powered by **Leaflet** showing:
- Nearby **police stations**, **hospitals**, **shelters**, and **safe hubs**
- Community-reported **incident zones** (harassment, poor lighting, suspicious activity, etc.)
- Your **live real-time location** pin

### 🚶‍♀️ SafeWalk
Start a timed walk session to any destination. If you miss a check-in, an automatic SOS is triggered. Guardians can track your location in real time via a shareable link.

### 🤖 Bilingual AI Safety Assistant
An edge-deployed AI assistant that understands **English and Hindi** (Devanagari script detection). Ask it anything:
> *"Help me!"* → Triggers SOS  
> *"Fake call"* → Starts a fake incoming call  
> *"मदद करो"* → SOS in Hindi  

Supports intents: SOS, Cancel, Fake Call, Siren, SafeWalk, Find Police, Find Hospital, Show Contacts, Safety Tips, Emergency Numbers.

### 📞 Fake Call
Instantly simulate an incoming phone call to escape uncomfortable or unsafe situations discreetly.

### 🔊 Siren / Alarm
Activates a loud device alarm to draw attention in threatening situations.

### 👥 Emergency Contacts
Manage your guardian circle with multi-channel notification preferences (WhatsApp, SMS, Call) and relationship tagging.

### 📋 Incident Reporting
Anonymously report safety incidents with category, severity, and GPS pin — contributing to a community safety heatmap.

### 🔐 Authentication
Sign up / Sign in with persistent session management powered by **Zustand**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| UI | [React 19](https://react.dev) + [Tailwind CSS 3](https://tailwindcss.com) |
| Language | [TypeScript 5.7](https://www.typescriptlang.org) |
| State Management | [Zustand 5](https://zustand-demo.pmnd.rs) |
| Map | [Leaflet 1.9](https://leafletjs.com) via `react-leaflet` |
| Animations | [Framer Motion 12](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev) + [HugeIcons](https://hugeicons.com) |
| Audio | [Howler.js 2](https://howlerjs.com) |
| AI Assistant | Next.js Edge API Routes (rule-based NLP, no external LLM cost) |
| Confetti | [canvas-confetti](https://github.com/catdad/canvas-confetti) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or pnpm / yarn)

### Installation

```bash
# Clone the repo
git clone https://github.com/SwayamRitirajDash/SafeHer.git
cd SafeHer

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in any required values

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server (with hot reload)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📁 Project Structure

```
SafeHer/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Entry page
│   │   └── api/
│   │       ├── assistant/route.ts      # Bilingual AI assistant (Edge)
│   │       ├── contacts/route.ts       # Emergency contacts API
│   │       ├── incidents/route.ts      # Incident reporting API
│   │       ├── places/route.ts         # Safe places API
│   │       └── sos/route.ts            # SOS dispatch engine
│   ├── components/
│   │   ├── auth/AuthModal.tsx          # Sign in / Sign up modal
│   │   ├── dashboard/
│   │   │   ├── MonochromeDashboard.tsx # Main dashboard layout
│   │   │   └── StatusBadgePill.tsx     # Status indicator badge
│   │   ├── map/SafetyMap.tsx           # Leaflet safety map
│   │   ├── modals/SafeHerModals.tsx    # SOS countdown, chat, etc.
│   │   └── safeher/
│   │       └── SafeHerMonochromeApp.tsx # Root app shell
│   ├── lib/
│   │   ├── audio.ts                    # Howler.js audio manager
│   │   ├── mockData.ts                 # Seed data for dev/demo
│   │   ├── speech.ts                   # Web Speech API wrapper
│   │   ├── store.ts                    # Zustand global store
│   │   └── types.ts                    # Shared TypeScript types
│   └── styles/globals.css              # Global styles
├── .env.example                        # Environment variable template
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🌐 API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/sos` | Dispatch an SOS alert with location |
| `POST` | `/api/assistant` | Query the bilingual AI assistant |
| `GET/POST` | `/api/contacts` | Manage emergency contacts |
| `GET/POST` | `/api/incidents` | Fetch / report incidents |
| `GET` | `/api/places` | Fetch nearby safe places |

---

## 🌍 Emergency Numbers (India)

| Service | Number |
|---|---|
| 🆘 National Emergency | **112** |
| 👮 Police | **100** |
| 🚒 Fire | **101** |
| 🚑 Ambulance | **102 / 108** |
| 👩 Women Helpline | **1091** |
| 💛 Childline | **1098** |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feat/your-feature`
5. Open a **Pull Request**

Please follow [Conventional Commits](https://www.conventionalcommits.org) for commit messages.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [Swayam Ritiraj Dash](https://github.com/SwayamRitirajDash)

*SafeHer — because safety is not a luxury, it's a right.*

</div>
