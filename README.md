# AI UX Designer

<div align="center">
<img width="800" alt="AI UX Designer Dashboard" src="./screenshots/dashboard.png" />
</div>

An AI-powered application that transforms a simple app idea into a complete product blueprint. Describe your app concept, and the AI generates everything you need to move from idea to implementation.

🔗 **Live Demo:** [ai-ux-designer-app.vercel.app](https://ai-ux-designer-app.vercel.app/)

## Features

- **Product Summary** — a clear overview of the app concept
- **Feature List** — core and supporting features
- **User Personas** — target user profiles
- **User Journeys** — key flows through the product
- **Information Architecture** — how content and screens are structured
- **Dashboard Suggestions** — layout and widget recommendations, generated asynchronously for richer detail
- **Wireframes & UI Mockups** — consistent visual concepts for key screens
- **Design System** — color palettes, typography, and style direction
- **Database Schema** — suggested data models
- **API Recommendations** — endpoints and integration suggestions
- **Technology Stack** — recommended tools and frameworks
- **Development Roadmap** — a phased plan to build the product
- **Optimized AI Prompts** — ready-to-use prompts for AI development tools (like Claude, Cursor, or Bolt)

## Tech Stack

- **Frontend:** React + Vite (TypeScript)
- **Backend:** Express (Node.js), bundled with esbuild for production
- **AI:** Google Gemini API
- **Deployment:** Vercel (serverless functions for the API, static hosting for the frontend)

## Getting Started

```bash
# Install dependencies
npm install

# Add your Gemini API key
cp .env.example .env
# then set GEMINI_API_KEY in .env

# Run locally
npm run dev
```

## Deployment

This project is configured for Vercel with a `vercel.json` that routes `/api/*` requests to the Express backend and serves the built frontend as static assets. Set `GEMINI_API_KEY` as an environment variable in your Vercel project settings before deploying.

## About

Built by [Sana Fatima](https://github.com/SanaFatima99) using Google AI Studio (vibe coding).
