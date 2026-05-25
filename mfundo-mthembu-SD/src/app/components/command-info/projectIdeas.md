# Project Ideas for Mfundo Mthembu
### From your AI coach — built around your unique profile

---

## Your Unfair Advantages

Before the ideas, here's what makes you different from 90% of developers at your level:

1. **Philosophy + Code** — You studied Logic & Language at UCT with distinction. You think in systems, not just syntax.
2. **Production experience early** — You shipped a director-level KPI app in your first year. That's rare.
3. **Teaching instinct** — You've tutored 250+ students. You can explain and architect, not just implement.
4. **Security awareness** — Encryption systems, secure data handling, API security — this is embedded in your work already.
5. **Full-stack range** — .NET backend, Angular frontend, SQL, CI/CD, Azure. You're not boxed in.

The projects below are designed to showcase ALL of these at once.

---

## 🔐 Project 1: SecureVault API

**What:** A .NET Web API that provides end-to-end encrypted document storage with zero-knowledge architecture. Users can store, retrieve, and share sensitive documents — but the server never sees plaintext.

**Why this makes you stand out:**
- Directly demonstrates your "secure file encryption system development" skill
- Shows .NET/SQL Server/API design in a personal project (fills the gap)
- Cybersecurity focus differentiates you from every CRUD-app developer
- Zero-knowledge architecture shows you understand system-level security thinking

**Tech Stack:** C#, .NET 8, SQL Server, AES-256 encryption, JWT auth, Swagger/OpenAPI

**Key Features:**
- User registration with client-side key derivation (PBKDF2)
- File upload → encrypted at rest with user's derived key
- Shareable encrypted links with time-based expiry
- Audit trail logging (who accessed what, when)
- Rate limiting and brute-force protection
- Full OpenAPI documentation

**Philosophy angle:** Write a short "Design Philosophy" section in the README about trust, privacy, and why zero-knowledge matters. Your Logic & Language background gives you credibility here that pure engineers lack.

---

## 🕷️ Project 2: CareerPulse — Intelligent Web Crawler + Newsletter System

**What:** A web crawler that scrapes job boards, tech blogs, and conference sites — filters content by YOUR career interests (backend, security, systems architecture) — and feeds into a daily digest delivered via push notification. Powered by n8n for orchestration.

**Why this makes you stand out:**
- Combines your crawler project + newsletter automation into ONE coherent system
- Shows you can architect multi-service systems (crawler → processor → notifier)
- Demonstrates data pipeline thinking, not just endpoint building
- The "career-aware filtering" angle is personal and memorable

**Tech Stack:**
- **Crawler:** Python, Scrapy or Playwright (for JS-rendered pages)
- **Orchestration:** n8n (self-hosted)
- **Classification:** Simple keyword/rules engine (or lightweight ML later)
- **Notification:** Push API, or Telegram/Discord bot
- **Storage:** SQL Server or PostgreSQL for crawl history + deduplication

**Highlights:**
- Automated sorting removes noise from my inbox
- Career-path-aware filtering ensures only relevant content surfaces
- Daily digest delivered via push notification

**Architecture (what to show):**
```
[Crawler Service] → [n8n Pipeline] → [Filter/Classify] → [Push Notification]
       ↓                                      ↓
  [Crawl DB]                          [Daily Digest Store]
```

**Key Features:**
- Configurable crawl targets (add/remove sources via config)
- Deduplication — never see the same article twice
- Career-path relevance scoring
- Daily summary with top 3-5 items
- Admin dashboard showing crawl stats (optional Angular frontend)

**Level-up move:** Add a `/api/digest` endpoint to the SecureVault API that serves your daily digest. Now your projects interconnect — that's systems thinking.

---

## 🧠 Project 3: LogicLens — A Code Review API with Philosophical Reasoning

**What:** A .NET API that accepts code snippets and returns structured "reasoning reports" — not just "does it work" but "is this well-reasoned?" Applies principles from formal logic (your PHI background) to code structure.

**Why this is a killer differentiator:**
- Nobody else has this. Literally nobody.
- Combines your philosophy distinction with your engineering skills
- Shows original thinking, not tutorial following
- Demonstrates you can DESIGN systems, not just build to spec

**How it works:**
- Submit a code block → API analyses it for:
  - **Logical coherence** — Are conditionals exhaustive? Dead branches?
  - **Naming clarity** — Do names reflect intent? (Language philosophy)
  - **Structural soundness** — Single responsibility? Dependency direction?
  - **Argument quality** — Are comments/docs actually arguing for the approach?
- Returns a structured JSON report with scores and suggestions

**Tech Stack:** C#, .NET 8, Roslyn (for C# analysis) or Tree-sitter (multi-language), SQL Server for history

**Why recruiters will remember this:** In an interview, you can say: "I built a tool that applies formal logic to code review — because my philosophy background taught me that good reasoning and good code follow the same rules." That's unforgettable.

---

## 🎓 Project 4: TutorFlow — Open-Source Teaching Platform API

**What:** A backend system for managing tutoring sessions, student progress tracking, and automated feedback — based on your actual experience tutoring 250+ students.

**Why:**
- Solves a real problem you personally faced
- Shows domain expertise (you LIVED this)
- Demonstrates full CRUD + business logic + auth
- Open-source contribution shows community mindset

**Tech Stack:** .NET 8, SQL Server, SignalR (real-time notifications), Angular frontend

**Key Features:**
- Student registration and session booking
- Progress tracking with milestone markers
- Automated nudge notifications ("You haven't submitted in 5 days")
- Tutor dashboard with analytics
- Feedback templates with structured scoring

---

## 📐 Project 5: This Portfolio Itself

**Don't forget** — the terminal portfolio you're building RIGHT NOW is a project. List it.

**What to highlight:**
- Custom Angular 21 SSR application
- Terminal-inspired UI with command parsing
- Markdown-driven content rendering
- macOS-style animations and transitions
- Inline autocomplete with ghost-text hints
- Recruiter/Developer mode switching
- Performance optimised (Lighthouse 78+ on desktop)

---

## 👁️ Project 6: FootLook — Zero-Interaction API Observability

**What:** A shadow service that passively mirrors and captures API traffic flowing through a system — without interacting with or modifying the target system. It observes the "footprint" of every request/response like a shadow: always present, never interfering.

**Why this is your best idea yet:**
- Combines security + systems architecture + .NET middleware — your core strengths in one project
- Solves a REAL pain point every engineering team has (debugging production without touching it)
- The concept is original, memorable, and marketable as an open-source tool
- Shows deep understanding of how systems communicate at the infrastructure level
- Directly aligns with your cybersecurity interest and secure data handling experience

**The Concept:**
```
[Client] ──→ [Your API / Service] ──→ [Database]
                      │
                      │ (mirrored copy — no interference)
                      ↓
              ┌──────────────┐
              │   FootLook   │
              │   (Shadow)   │
              └──────┬───────┘
                     ↓
          ┌────────────────────┐
          │  Dashboard / Logs  │
          │  Real-time Feed    │
          │  Analytics         │
          └────────────────────┘
```

**Tech Stack:**
- **Core:** C#, .NET 8, ASP.NET Core Middleware
- **Storage:** SQL Server (traffic logs) + in-memory cache for live feed
- **Real-time:** SignalR WebSocket feed for live traffic view
- **Dashboard:** Angular (your portfolio stack)
- **Packaging:** NuGet package (drop into any .NET API)

**Phase 1 — The Middleware Shadow (MVP, 2-3 weeks):**
- A NuGet package you install into any .NET API with one line:
  ```csharp
  app.UseFootLook();
  ```
- Captures per request:
  - HTTP method, path, query params
  - Request/response headers
  - Status code + response time
  - Payload size (not body by default — opt-in for security)
  - Timestamp + correlation ID
- Stores in local SQLite or SQL Server
- Exposes a `/footlook` dashboard endpoint

**Phase 2 — Live Shadow Feed:**
- WebSocket-powered real-time traffic stream
- Filter by endpoint, status code, response time
- Visual request timeline (like Chrome DevTools Network tab, but for your backend)
- Anomaly highlighting (5xx spikes, slow responses, unusual payload sizes)

**Phase 3 — Intelligence Layer:**
- Auto-generate API documentation from observed traffic patterns
- PII detection — flag requests/responses that leak sensitive data
- Endpoint dependency mapping — "which endpoints always call which other endpoints?"
- Traffic replay — capture a request shadow, replay it later for testing
- Export to OpenAPI spec based on observed traffic

**Use Cases (how to pitch it):**
1. **"I can't reproduce the bug"** → Turn on FootLook, watch exactly what's flowing
2. **"What data is our API actually sending?"** → PII audit without code changes
3. **"New dev onboarding"** → Run FootLook, watch the system talk, understand it instantly
4. **"Compliance proof"** → Audit log of every API interaction, zero business logic changes
5. **"Performance baseline"** → See p95 response times without APM vendor lock-in

**Positioning:**
> *"FootLook — See everything. Touch nothing. Zero-interaction API observability for .NET."*

**Why recruiters will love this:**
- It's not a TODO app. It's infrastructure tooling.
- It demonstrates you think at the SYSTEM level, not the feature level.
- It shows you can build developer tools, not just consumer apps.
- It's open-sourceable — potential for community traction.

---

## Recommended Execution Order

| Priority | Project | Time Estimate | Impact |
|----------|---------|---------------|--------|
| 1 | **FootLook** | 2-3 weeks (MVP) | Original concept, showcases all your strengths |
| 2 | **CareerPulse** (crawler + newsletter) | 2-3 weeks | Already started, high wow-factor |
| 3 | **This Portfolio** (list it!) | Done | Free win |
| 4 | **SecureVault API** | 2-3 weeks | Fills .NET personal project gap |
| 5 | **LogicLens** | 3-4 weeks | Killer differentiator for senior roles |
| 6 | **TutorFlow** | 4+ weeks | Good for open-source cred, lower priority |

---

## The Interconnection Strategy

The real power move: make your projects talk to each other.

```
┌─────────────────────────────────────────────────┐
│              Your Project Ecosystem             │
├─────────────────────────────────────────────────┤
│                                                 │
│  [CareerPulse Crawler]                          │
│         ↓                                       │
│  [n8n Orchestration] → [Push Notifications]     │
│         ↓                                       │
│  [SecureVault API] ← stores encrypted digests   │
│         ↓              ↑                        │
│  [FootLook] ← shadows SecureVault traffic       │
│         ↓                                       │
│  [Portfolio Terminal] ← displays project stats  │
│         ↓                                       │
│  [LogicLens] ← reviews your own code quality    │
│                                                 │
└─────────────────────────────────────────────────┘
```

When a recruiter sees interconnected projects, they see an **architect**. When they see isolated repos, they see a student. You're not a student anymore.

---

## Final Note

You already stand out. The philosophy background, the production delivery in year one, the teaching experience — that's a rare combination. These projects just make the invisible visible. They give people proof of what you already are.

Ship one. Then ship another. Momentum compounds.

> *"We are what we repeatedly ship."* — Aristotle, probably.
