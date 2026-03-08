# ResumeForge AI

AI-powered resume builder with beautiful templates, ATS optimization, and intelligent content generation — all running locally and 100% private.

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)

---

## Features

### AI-Powered Writing (Local via Ollama)
- Generate professional summaries, bullet points, and cover letters using a **local LLM** (Ollama with Llama 3.2 by default)
- All AI processing runs on your machine — **no data ever leaves your computer**
- Improve existing bullet points with one click
- Smart skill suggestions based on your experience and target job

### Job Description Analyzer
- Paste a job URL or raw text and let AI extract key requirements
- Built-in web scraper (Cheerio) pulls job details from major job boards
- Automatically tailor your resume to maximize keyword match

### ATS Optimization
- Real-time ATS (Applicant Tracking System) score
- Keyword gap analysis between your resume and the target job
- Actionable suggestions to improve your score

### Smart PDF Import
- Upload an existing resume PDF — AI extracts and structures all your data automatically
- Powered by `pdf-parse` for text extraction and LLM for structuring

### 8 Professional Templates
- **Modern** · **Classic** · **Creative** · **Elegant** · **Minimalist** · **Professional** · **Bold** · **Tech**
- Customize colors, fonts, and layout per template
- Live preview as you edit

### Export
- Download as high-quality **PDF** (via `@react-pdf/renderer`) or **DOCX** (via `docx` library)
- Print-ready A4 with embedded fonts

### Resume Editor
- Canva-like drag-and-drop editor with real-time preview
- Sections: Personal Info, Summary, Experience, Education, Skills, Languages, Certifications, Projects
- Undo/redo support
- Auto-save

### Job Tracker
- Track job applications alongside your resumes
- Link resumes to specific job descriptions

### Authentication
- Email/password (bcrypt-hashed)
- OAuth with **Google** and **GitHub** (optional, configure via env vars)
- Powered by **NextAuth v5** with JWT strategy and Prisma adapter

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS, Radix UI primitives, Framer Motion |
| **State Management** | Zustand (with Immer) |
| **Data Fetching** | TanStack React Query |
| **Database** | PostgreSQL via Prisma ORM |
| **Authentication** | NextAuth v5 (Credentials + Google + GitHub) |
| **AI / LLM** | Ollama (local) — Llama 3.2 default model |
| **PDF Generation** | @react-pdf/renderer |
| **PDF Parsing** | pdf-parse |
| **DOCX Export** | docx |
| **Rich Text Editor** | Tiptap |
| **Web Scraping** | Cheerio |
| **File Storage** | Local filesystem (dev) / S3-compatible (production) |
| **Form Handling** | React Hook Form + Zod validation |
| **Testing** | Jest, React Testing Library |
| **Drag & Drop** | @dnd-kit |

---

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** database
- **Ollama** installed and running locally (for AI features)

### Install Ollama

1. Download from [ollama.com](https://ollama.com)
2. Pull the default model:
   ```bash
   ollama pull llama3.2
   ```
3. Ollama runs on `http://localhost:11434` by default

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Dominik308/resume-forge.git
cd resume-forge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/resume_forge"

# NextAuth
AUTH_SECRET="your-secret-key-here"        # Generate with: openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# Ollama (AI) — optional, these are the defaults
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Storage
USE_LOCAL_STORAGE="true"                  # Set to "false" for S3 in production
LOCAL_UPLOAD_DIR="./public/uploads"

# S3 (production only)
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AWS_REGION=""
# S3_BUCKET=""
```

### 4. Set up the database

```bash
# Push the Prisma schema to PostgreSQL and seed sample data
npm run setup
```

Or run the steps individually:

```bash
npm run db:push       # Create/update tables
npm run db:seed       # Seed test user and sample data
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test account (after seeding)

- **Email:** `test@local.dev`
- **Password:** `Test1234!`

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:unit` | Run unit tests only |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database and re-seed |
| `npm run setup` | Initial setup (push + seed) |

---

## Project Structure

```
resume-forge/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/uploads/            # Local file uploads
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── (dashboard)/       # Dashboard, Jobs, Resumes, Settings, Templates
│   │   ├── api/               # API routes (AI, auth, resumes, scraper, upload)
│   │   ├── contact/           # Contact page
│   │   ├── privacy/           # Privacy policy
│   │   └── terms/             # Terms of service
│   ├── components/
│   │   ├── editor/            # Resume editor (live preview + forms)
│   │   ├── forms/             # Section forms (Personal, Experience, etc.)
│   │   ├── jobs/              # Job tracker
│   │   ├── layout/            # Dashboard navigation
│   │   ├── resume/            # Resume preview + 8 templates
│   │   ├── resumes/           # Resume list actions (delete, duplicate)
│   │   ├── settings/          # User settings form
│   │   └── templates/         # Template gallery
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── ai/                # LLM provider, content generator, prompts
│   │   ├── pdf/               # PDF parsing & generation
│   │   ├── scraper/           # Job URL scraper (Cheerio)
│   │   ├── storage/           # File storage (local / S3)
│   │   └── utils/             # Helper functions
│   ├── stores/                # Zustand state stores
│   ├── tests/                 # Test setup, mocks, fixtures
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Auth route protection
├── jest.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

The app uses PostgreSQL with the following core models:

- **User** — accounts with email/password or OAuth
- **Resume** — full resume data stored as JSON fields (personal info, experience, education, skills, projects, certifications, languages), linked to a template and optional target job
- **ResumeVersion** — version history snapshots
- **JobDescription** — saved job postings with parsed data for ATS matching

See [prisma/schema.prisma](prisma/schema.prisma) for the full schema.

---

## Deployment

### Local / VPS

1. Set up PostgreSQL and configure `DATABASE_URL`
2. Install Ollama and pull your preferred model
3. Build and start:
   ```bash
   npm run build
   npm run start
   ```

### S3 Storage (production)

Set `USE_LOCAL_STORAGE="false"` and configure the `AWS_*` / `S3_BUCKET` environment variables. The S3 storage provider is built-in and activates automatically.

---

## License

This project is private.
