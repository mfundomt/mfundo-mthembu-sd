Projects
---

## 👣 FootLook — Zero-Interaction API Observability

A shadow service that passively mirrors and captures API traffic flowing through a system — without interacting with or modifying the target system. It observes the "footprint" of every request/response like a shadow: always present, never interfering.

**Tech Stack:**
- **Core:** C#, .NET 8, ASP.NET Core Middleware
- **Storage:** SQL Server (traffic logs) + in-memory cache for live feed
- **Real-time:** SignalR WebSocket feed for live traffic view
- **Dashboard:** Angular
- **Packaging:** NuGet package (drop into any .NET API) 

**Links:**
- **Live:** <a href="https://www.footlook.co.za" target="_blank" rel="noopener noreferrer">footlook.co.za</a>
- **Code:** <a href="https://github.com/mfundomt/FootLook--Zero-Interaction-API-Observability" target="_blank" rel="noopener noreferrer">API (GitHub)</a> · <a href="https://github.com/mfundomt/footlook-ui" target="_blank" rel="noopener noreferrer">UI (GitHub)</a>

---

## 📈 CareerPulse — Intelligent Web Crawler + Newsletter System

An automation pipeline built with **n8n** that monitors my email inbox for incoming newsletters, filters and categorises them based on relevance to my career path (software engineering, architecture, cybersecurity), and sends a daily push notification summarising what's worth reading.

**Tech Stack:** Scrapy, n8n, Email IMAP/API, Push Notifications  
- **Orchestration:** n8n (self-hosted)
- **Notification:** Push API
- **Storage:** SQL Server for crawl history + deduplication

**Links:**
- **Live:** Coming soon
- **Code:** Coming soon

---

## 🔧 Personal Portfolio (This Site)

A terminal-themed portfolio website designed to stand out from traditional CV sites. Recruiters and developers interact with a command-line interface to explore sections like skills, experience, and projects — complete with autocomplete hints, command history, and recruiter/developer mode switching.

**Tech Stack:**
- **Framework:** Angular 21 with Server-Side Rendering (SSR)
- **Language:** TypeScript
- **UI:** Angular Material (Dialog), custom terminal CSS
- **Markdown Rendering:** marked.js (dynamic content loading)
- **Server:** Express 5 + @angular/ssr
- **Build:** esbuild via @angular/build
- **Styling:** SCSS + CSS animations (custom modal transitions)
- **Performance:** Lazy-loaded images, client hydration with event replay, requestIdleCallback scheduling

**Features:**
- Command-based navigation (`git checkout <section>`)
- Ghost-text autocomplete and input history (↑/↓)
- Recruiter Mode / Developer Mode content switching
- Animated modal system with next/prev navigation
- Fully server-side rendered for SEO and fast first paint

**Links:**
- **Live:** You're looking at it
- **Code:** <a href="https://github.com/mfundomt/mfundo-mthembu-sd" target="_blank" rel="noopener noreferrer">github.com/mfundomt/mfundo-mthembu-sd</a>

---

> *"Every project starts with a question worth answering."*

- `git checkout skills` — Technologies & tools <a class="cmd-link" data-command="git checkout skills">↗</a>
- `git checkout experience` — Professional background <a class="cmd-link" data-command="git checkout experience">↗</a>
