# 💼 10 — Portfolio & GitHub: Make Your Work Shine

```
╔═══════════════════════════════════════════════════════╗
║  "Your GitHub profile is your resume. Your README    ║
║   is your cover letter."                             ║
╚═══════════════════════════════════════════════════════╝
```

## 🎯 Tujuan Pembelajaran

Setelah materi ini, kalian bakal bisa:

- Bikin killer README.md yang recruiter actually read
- Pakai shields.io badges biar keliatan pro
- Bikin Mermaid architecture diagram di README
- Tech stack table yang clean
- Setup GitHub Profile README
- LinkedIn showcase strategy

## 🤔 Kenapa README Penting?

Recruiter dan hiring manager spend rata-rata **30 detik** lihat repo kalian. Kalau README kosong atau cuma "# my-project", they move on.

README yang bagus = first impression yang kuat. Ini bedanya antara "oh another bootcamp project" dan "this person is production-ready."

```mermaid
graph LR
    A["Recruiter visits\nyour GitHub"] --> B{"README\nexists?"}
    B -->|"No"| C["❌ Closes tab\n(3 seconds)"]
    B -->|"Yes"| D{"README\nquality?"}
    D -->|"Low"| E["❌ Skims, leaves\n(10 seconds)"]
    D -->|"High"| F["✅ Reads, impressed\n(2+ minutes)"]
    F --> G["🎉 Interview!"]
    
    style C fill:#E53E3E,stroke:#fff,color:#fff
    style E fill:#ED8936,stroke:#fff,color:#fff
    style F fill:#48BB78,stroke:#fff,color:#fff
    style G fill:#5A67D8,stroke:#fff,color:#fff
```

---

## 📝 Part 1: Killer README Template

Ini template lengkap yang bisa kalian pakai buat capstone:

```markdown
# 🛍️ Arcane Marketplace

![CI/CD](https://github.com/username/arcane-marketplace/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)

> A full-stack e-commerce platform built with React, Express, and PostgreSQL.
> Features authentication, product management, shopping cart, and order processing.

**🌐 [Live Demo](https://arcane-marketplace.vercel.app)** |
**📖 [API Docs](https://api-arcane.railway.app/docs)** |
**🎥 [Demo Video](https://youtube.com/watch?v=xxx)**

![Screenshot](./docs/screenshots/hero.png)

---

## ✨ Features

- 🔐 **Authentication** — Register, login, JWT with refresh tokens
- 🛍️ **Product Catalog** — Browse, search, filter by category
- 🛒 **Shopping Cart** — Add, remove, update quantities, persistent
- 📦 **Order Management** — Place orders, track status, order history
- ⭐ **Reviews** — Rate and review products
- 👨‍💼 **Admin Panel** — Manage products, orders, users
- 📱 **Responsive** — Mobile-first design
- 🧪 **Tested** — 25+ unit/integration tests, E2E with Playwright
- 🚀 **CI/CD** — GitHub Actions pipeline, auto-deploy
- 📊 **Monitoring** — Sentry error tracking

## 🏗️ Architecture

\```mermaid
graph TB
    subgraph "Frontend (Vercel)"
        A["React + TypeScript"]
        B["Zustand (State)"]
        C["React Query (Server State)"]
        D["Tailwind CSS"]
    end
    
    subgraph "Backend (Railway)"
        E["Express.js"]
        F["Prisma ORM"]
        G["JWT Auth"]
    end
    
    subgraph "Database (Railway)"
        H[(PostgreSQL)]
    end
    
    subgraph "Services"
        I["Sentry (Monitoring)"]
        J["GitHub Actions (CI/CD)"]
    end
    
    A --> E
    E --> H
    A --> I
    E --> I
\```

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| TypeScript 5 | Type safety |
| Zustand | Client state management |
| TanStack Query | Server state & caching |
| Tailwind CSS | Styling |
| React Router 6 | Routing |
| Axios | HTTP client |
| React Hook Form | Form handling |
| Zod | Schema validation |

### Backend
| Technology | Purpose |
|-----------|---------|
| Express.js | HTTP server |
| TypeScript 5 | Type safety |
| Prisma | ORM & migrations |
| PostgreSQL 16 | Database |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Zod | Request validation |
| Morgan | Request logging |

### DevOps & Testing
| Technology | Purpose |
|-----------|---------|
| Vitest | Unit & integration testing |
| React Testing Library | Component testing |
| Playwright | E2E testing |
| GitHub Actions | CI/CD pipeline |
| Vercel | Frontend deployment |
| Railway | Backend + DB deployment |
| Sentry | Error monitoring |

## 📊 Database Schema

\```mermaid
erDiagram
    users ||--o{ orders : places
    users ||--o{ reviews : writes
    users ||--o{ cart_items : has
    categories ||--o{ products : contains
    products ||--o{ order_items : includes
    products ||--o{ reviews : has
    orders ||--o{ order_items : contains
    
    users {
        int id PK
        varchar email UK
        varchar name
        text password
        enum role
    }
    products {
        int id PK
        varchar name
        decimal price
        int stock
        int category_id FK
    }
    orders {
        int id PK
        int user_id FK
        decimal total
        enum status
    }
\```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

\```bash
# Clone the repo
git clone https://github.com/username/arcane-marketplace.git
cd arcane-marketplace

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start development servers
npm run dev        # Frontend: http://localhost:5173
npm run dev:api    # Backend:  http://localhost:3000
\```

### Environment Variables

\```bash
# .env.example
DATABASE_URL=postgresql://user:pass@localhost:5432/arcane
JWT_SECRET=your-secret-key
VITE_API_URL=http://localhost:3000/api
\```

## 🧪 Testing

\```bash
# Unit & Integration tests
npm run test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
\```

## 📁 Project Structure

\```
├── src/
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-based modules
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities, API client
│   ├── pages/          # Route pages
│   ├── stores/         # Zustand stores
│   └── test/           # Test utilities
├── server/
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── middleware/  # Express middleware
│   │   ├── services/   # Business logic
│   │   └── lib/        # Utilities
│   └── prisma/
│       ├── schema.prisma
│       ├── seed.ts
│       └── migrations/
├── e2e/                # Playwright tests
└── .github/workflows/  # CI/CD
\```

## 📸 Screenshots

| Home Page | Product Detail | Cart |
|-----------|---------------|------|
| ![Home](./docs/screenshots/home.png) | ![Product](./docs/screenshots/product.png) | ![Cart](./docs/screenshots/cart.png) |

| Admin Dashboard | Mobile View |
|----------------|-------------|
| ![Admin](./docs/screenshots/admin.png) | ![Mobile](./docs/screenshots/mobile.png) |

## 🤝 API Endpoints

<details>
<summary>Click to expand API documentation</summary>

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/auth/me | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products |
| GET | /api/products/:id | Get product |
| POST | /api/products | Create (admin) |
| PUT | /api/products/:id | Update (admin) |
| DELETE | /api/products/:id | Delete (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/orders | List user orders |
| POST | /api/orders | Create order |
| GET | /api/orders/:id | Get order detail |
| PATCH | /api/orders/:id/status | Update status (admin) |

</details>

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ by [Your Name](https://github.com/username)
```

---

## 🛡️ Part 2: Shields.io Badges

Badges bikin README keliatan professional. Format:

```markdown
![Label](https://img.shields.io/badge/LABEL-VALUE-COLOR?logo=LOGO)
```

### Commonly Used Badges

```markdown
<!-- Build Status (from GitHub Actions) -->
![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)

<!-- Tech Stack -->
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

<!-- Testing -->
![Tests](https://img.shields.io/badge/Tests-25%20passed-48BB78)
![Coverage](https://img.shields.io/badge/Coverage-82%25-48BB78)

<!-- Deployment -->
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?logo=railway)

<!-- License -->
![License](https://img.shields.io/badge/License-MIT-blue)
```

### Dynamic Badges

Ini update otomatis dari repo kalian:

```markdown
<!-- GitHub stars -->
![Stars](https://img.shields.io/github/stars/USER/REPO)

<!-- Last commit -->
![Last Commit](https://img.shields.io/github/last-commit/USER/REPO)

<!-- Repo size -->
![Size](https://img.shields.io/github/repo-size/USER/REPO)

<!-- Open issues -->
![Issues](https://img.shields.io/github/issues/USER/REPO)
```

---

## 🏠 Part 3: GitHub Profile README

GitHub Profile README muncul di profile page kalian. Ini kayak bio / landing page.

### Setup

1. Create repo dengan nama SAMA kayak username kalian (e.g., `github.com/johndoe/johndoe`)
2. Add `README.md`
3. This README appears on your profile!

### Template

```markdown
# Hi! 👋 I'm [Your Name]

🚀 Full-stack developer specializing in TypeScript, React, and Node.js

## 🔭 What I'm Working On

- 🛍️ [Arcane Marketplace](https://github.com/username/arcane-marketplace) — Full-stack e-commerce with React + Express + PostgreSQL
- 📝 [Task Board](https://github.com/username/task-board) — Kanban-style project management

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Zustand, React Query
**Backend:** Express.js, Node.js, Prisma, PostgreSQL
**DevOps:** GitHub Actions, Vercel, Railway, Docker
**Testing:** Vitest, Playwright, React Testing Library

## 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=USERNAME&show_icons=true&theme=dark)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=USERNAME&layout=compact&theme=dark)

## 📫 Reach Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/username)
[![Email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:your@email.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-000?logo=vercel&logoColor=white)](https://yoursite.com)
```

### Pro Tips

- **Pin your best repos** — Go to profile → "Customize your pins" → select capstone + best projects
- **Green contribution graph** — Commit regularly, even small changes
- **Star your own project** — Self-star is fine, shows you care
- **Add topics** — Repo → About → Add topics: `react`, `typescript`, `fullstack`, etc.

---

## 💼 Part 4: LinkedIn Showcase

### Project Post Template

```
🚀 Excited to share my latest project: Arcane Marketplace!

A full-stack e-commerce platform built from scratch with:
⚛️ React + TypeScript (frontend)
🟢 Express.js + Prisma (backend)
🐘 PostgreSQL (database)
🧪 25+ automated tests
🔄 CI/CD with GitHub Actions
📊 Error monitoring with Sentry

Key features:
✅ JWT authentication with refresh tokens
✅ Product catalog with search & filters
✅ Shopping cart & order management
✅ Admin panel for product management
✅ Responsive design (mobile-first)

🌐 Live: https://arcane-marketplace.vercel.app
💻 Code: https://github.com/username/arcane-marketplace

Built as my capstone project at ETHJKT. Special thanks to the amazing instructors and fellow students!

#WebDevelopment #React #TypeScript #FullStack #NodeJS #PostgreSQL
```

### LinkedIn Profile Tips

1. **Headline:** "Full-Stack Developer | React | TypeScript | Node.js" (bukan cuma "Student")
2. **Featured section:** Pin capstone project link + live demo link
3. **Experience:** Add ETHJKT as education, list capstone as a project
4. **Skills:** Add: TypeScript, React, Node.js, PostgreSQL, Express.js, Git
5. **About:** Brief paragraph about your journey + what you're looking for

---

## 📸 Part 5: Screenshots That Sell

### Tools

- **Full-page screenshots:** Browser DevTools → Ctrl+Shift+P → "Capture full size screenshot"
- **Device mockups:** [shots.so](https://shots.so) — free, beautiful device frames
- **Screen recording → GIF:** [Kap](https://getkap.co/) (Mac) or [ShareX](https://getsharex.com/) (Windows)

### What to Screenshot

1. **Hero/Landing page** — first impression
2. **Product listing** — shows data, UI components
3. **Product detail** — shows complexity
4. **Cart/Checkout** — shows real functionality
5. **Admin panel** — shows different user roles
6. **Mobile view** — shows responsiveness
7. **Login page** — shows auth awareness

### GIF Demo

Animated GIF > static screenshot. Record a 15-30 second flow:

1. Login → Browse → Add to Cart → Checkout

Embed di README:

```markdown
## Demo

![Demo GIF](./docs/demo.gif)
```

---

## ✅ Part 6: Repository Best Practices

### Commit History

```bash
# ✅ Good commits
feat: add product search functionality
fix: resolve cart total calculation bug
test: add unit tests for auth middleware
docs: update README with deployment instructions
style: format code with prettier
refactor: extract product card component

# ❌ Bad commits
update
fix stuff
asdfgh
WIP
final version
final version 2
final version FINAL
```

Pakai [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — new feature
- `fix:` — bug fix
- `test:` — testing
- `docs:` — documentation
- `style:` — formatting
- `refactor:` — code restructure
- `chore:` — maintenance

### Essential Files

```
├── README.md           # Project documentation
├── .env.example        # Environment template (NO secrets!)
├── .gitignore          # Ignore node_modules, .env, dist, etc.
├── LICENSE             # MIT recommended
├── .eslintrc.json      # Linting rules
├── .prettierrc         # Formatting rules
└── tsconfig.json       # TypeScript config
```

### .gitignore

```gitignore
# Dependencies
node_modules/

# Build
dist/
build/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Test
coverage/
playwright-report/
test-results/

# Prisma
prisma/*.db
```

---

## 📋 Portfolio Checklist

```markdown
## GitHub Repo
- [ ] README.md with all sections (badges, features, architecture, tech stack)
- [ ] Screenshots / GIF demo
- [ ] .env.example (no real secrets!)
- [ ] Clean commit history
- [ ] LICENSE file
- [ ] Topics/tags on repo
- [ ] Pinned on profile

## GitHub Profile
- [ ] Profile README exists
- [ ] Bio filled in
- [ ] Profile picture
- [ ] Location (city/country)
- [ ] Best repos pinned
- [ ] Contribution graph green

## LinkedIn
- [ ] Headline updated
- [ ] Featured section with project links
- [ ] Skills added (TypeScript, React, Node.js, etc.)
- [ ] Project post published

## Live Links
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Railway
- [ ] Both links in README
- [ ] Links work (test in incognito!)
```

---

## 📝 Summary

| Konsep | Key Takeaway |
|--------|-------------|
| README | Your project's resume — make it count |
| Badges | shields.io for professional look |
| Mermaid | Architecture + ERD diagrams in README |
| Screenshots | Show, don't tell — 5+ screenshots minimum |
| Profile README | Your GitHub landing page |
| LinkedIn | Post your project, update your profile |
| Commits | Conventional commits = clean history |

**Gua serius: README yang bagus bisa bikin perbedaan antara dapet interview atau engga. Invest 2-3 jam buat bikin README yang bener. Future you will thank you.**

---

**Next up:** Demo Day preparation — time to present like a pro. 🎤
