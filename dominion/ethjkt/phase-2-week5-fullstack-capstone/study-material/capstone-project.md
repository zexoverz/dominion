# ⚔️ Arcane Quest Phase 2 — Week 5: CAPSTONE PROJECT

## 🏰 "The Final Boss" — Buktikan Dirimu, Knight!

> *"Ini dia. Pertempuran terakhir. Semua spell yang kau pelajari, semua dungeon yang kau taklukkan, semua party member yang membantumu — semuanya berujung di sini. Taklukkan Final Boss ini, dan kau resmi menjadi Arcane Knight."*

🎓 **Selamat datang di Capstone Project — ujian akhir Arcane Quest Phase 2!**

Ini bukan exercise biasa. Ini adalah **graduation project** — bukti nyata bahwa kamu sudah siap terjun ke dunia nyata sebagai Fullstack Developer. Project ini akan menjadi **crown jewel** di portfolio-mu, project yang kamu tunjukkan pertama kali ke recruiter.

Take a deep breath. Kamu sudah siap. Let's go! 🚀

---

## 📋 Overview

| Item | Detail |
|------|--------|
| **Durasi** | 7 hari |
| **Tipe** | Individual project |
| **Deliverables** | Working app + GitHub repo + Presentation |
| **Deployment** | Wajib deployed & accessible online |
| **Presentasi** | 10 menit demo + 5 menit Q&A |

---

## 🎯 Pilih Quest-mu

Kamu boleh pilih **salah satu** dari 5 quest berikut, atau propose custom quest (harus di-approve mentor):

### ⚔️ Quest A: E-Commerce Platform — "The Merchant's Guild"

Bangun platform jual-beli online dengan fitur lengkap.

#### MVP Features (Wajib)
- User registration & login (JWT auth)
- Product catalog dengan search & filter
- Shopping cart (add, update quantity, remove)
- Checkout flow dengan order summary
- Order history untuk buyer
- Admin panel: CRUD products, view orders
- Responsive design

#### Nice-to-have Features
- Payment gateway integration (Midtrans sandbox)
- Product categories & tags
- Product image upload (Cloudinary/S3)
- Wishlist
- Product reviews & ratings
- Email notification (order confirmation)

#### Stretch Features
- Real-time stock tracking
- Recommendation engine ("Customers also bought...")
- Discount codes & promotions
- Multi-vendor support
- Analytics dashboard untuk admin

#### Database Schema

```sql
-- Users
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(100) NOT NULL,
  role        VARCHAR(20) DEFAULT 'buyer', -- buyer, admin
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  price       DECIMAL(12,2) NOT NULL,
  stock       INTEGER DEFAULT 0,
  image_url   TEXT,
  category_id INTEGER REFERENCES categories(id),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  slug  VARCHAR(100) UNIQUE NOT NULL
);

-- Orders
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  total       DECIMAL(12,2) NOT NULL,
  status      VARCHAR(20) DEFAULT 'pending', -- pending, paid, shipped, done, cancelled
  address     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER REFERENCES orders(id),
  product_id  INTEGER REFERENCES products(id),
  quantity    INTEGER NOT NULL,
  price       DECIMAL(12,2) NOT NULL -- price at time of purchase
);

-- Cart Items
CREATE TABLE cart_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  product_id  INTEGER REFERENCES products(id),
  quantity    INTEGER DEFAULT 1,
  UNIQUE(user_id, product_id)
);
```

#### API Endpoints

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me

PRODUCTS
  GET    /api/products              — List (with search, filter, pagination)
  GET    /api/products/:id          — Detail
  POST   /api/products              — Create (admin)
  PUT    /api/products/:id          — Update (admin)
  DELETE /api/products/:id          — Delete (admin)

CATEGORIES
  GET    /api/categories
  POST   /api/categories            — (admin)

CART
  GET    /api/cart
  POST   /api/cart                  — Add item
  PUT    /api/cart/:id              — Update quantity
  DELETE /api/cart/:id              — Remove item

ORDERS
  POST   /api/orders                — Checkout (create from cart)
  GET    /api/orders                — My orders / All orders (admin)
  GET    /api/orders/:id            — Order detail
  PUT    /api/orders/:id/status     — Update status (admin)
```

---

### ⚔️ Quest B: Social Media App — "The Tavern Board"

Bangun social media platform untuk developer community.

#### MVP Features (Wajib)
- User registration, login, profile page
- Create, edit, delete posts (text + optional image)
- Like & comment on posts
- Follow/unfollow users
- News feed (posts from followed users)
- User search
- Responsive design

#### Nice-to-have Features
- Image upload untuk posts dan avatar
- Infinite scroll pada feed
- Notifications (someone liked/commented/followed)
- Hashtags dengan trending topics
- Bookmarks/saved posts
- Rich text editor untuk posts

#### Stretch Features
- Real-time notifications (WebSocket)
- Direct messaging
- Post sharing/repost
- Content moderation (report system)
- Activity analytics

#### Database Schema

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(50) UNIQUE NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  bio         TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE likes (
  id          SERIAL PRIMARY KEY,
  post_id     INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

CREATE TABLE follows (
  id            SERIAL PRIMARY KEY,
  follower_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  following_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(follower_id, following_id)
);
```

#### API Endpoints

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  GET    /api/auth/me

USERS
  GET    /api/users/:username       — Profile
  PUT    /api/users/profile         — Update profile
  GET    /api/users/search?q=       — Search users

POSTS
  GET    /api/posts/feed            — Feed (from followed users)
  GET    /api/posts                 — Explore (all/trending)
  POST   /api/posts                 — Create
  PUT    /api/posts/:id             — Edit
  DELETE /api/posts/:id             — Delete
  GET    /api/posts/:id             — Detail + comments

INTERACTIONS
  POST   /api/posts/:id/like        — Toggle like
  POST   /api/posts/:id/comments    — Add comment
  DELETE /api/comments/:id          — Delete comment

FOLLOWS
  POST   /api/users/:id/follow      — Toggle follow
  GET    /api/users/:id/followers
  GET    /api/users/:id/following
```

---

### ⚔️ Quest C: Project Management Tool — "The War Room"

Bangun project management app ala Trello/Asana simplified.

#### MVP Features (Wajib)
- User auth + team/workspace creation
- Create projects with multiple boards/lists
- Create, edit, delete, reorder tasks (drag-and-drop jadi bonus)
- Task assignment ke team members
- Task status (To Do → In Progress → Done)
- Due dates dan priority levels
- Basic dashboard per project
- Responsive design

#### Nice-to-have Features
- Drag-and-drop task reordering
- Task labels/tags (color-coded)
- Task comments & activity log
- File attachments pada tasks
- Invite members via email
- Filter & sort tasks

#### Stretch Features
- Real-time collaboration (WebSocket)
- Gantt chart atau calendar view
- Time tracking per task
- Sprint/milestone management
- Export ke CSV

#### Database Schema

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(100) NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workspaces (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  owner_id    INTEGER REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workspace_members (
  id            SERIAL PRIMARY KEY,
  workspace_id  INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role          VARCHAR(20) DEFAULT 'member', -- owner, admin, member
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE projects (
  id            SERIAL PRIMARY KEY,
  workspace_id  INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  description   TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lists (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  position    INTEGER DEFAULT 0
);

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  list_id     INTEGER REFERENCES lists(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INTEGER REFERENCES users(id),
  priority    VARCHAR(10) DEFAULT 'medium', -- low, medium, high, urgent
  due_date    DATE,
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_comments (
  id          SERIAL PRIMARY KEY,
  task_id     INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  user_id     INTEGER REFERENCES users(id),
  content     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

### ⚔️ Quest D: Content Management System — "The Scribe's Tower"

Bangun CMS/blogging platform dengan admin dashboard.

#### MVP Features (Wajib)
- Admin auth (writer & admin roles)
- Rich text editor untuk articles (Tiptap/Quill)
- CRUD articles dengan draft/published status
- Categories & tags
- Public-facing blog dengan article listing & detail
- Search articles
- Responsive design

#### Nice-to-have Features
- Image upload & media library
- SEO metadata per article (title, description, OG image)
- Article scheduling (publish at future date)
- Comments system untuk readers
- Analytics (view count per article)
- Multiple authors with bylines

#### Stretch Features
- Markdown support + live preview
- Custom pages (About, Contact)
- Newsletter subscription
- RSS feed
- Content versioning (revision history)

#### Database Schema

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  name        VARCHAR(100) NOT NULL,
  role        VARCHAR(20) DEFAULT 'writer', -- writer, editor, admin
  bio         TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE articles (
  id            SERIAL PRIMARY KEY,
  author_id     INTEGER REFERENCES users(id),
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) UNIQUE NOT NULL,
  content       TEXT NOT NULL,
  excerpt       TEXT,
  cover_image   TEXT,
  status        VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
  published_at  TIMESTAMP,
  view_count    INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL,
  slug  VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE article_categories (
  article_id   INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  category_id  INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id     INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);
```

---

### ⚔️ Quest E: Custom Project — "The Rogue's Path"

Punya ide sendiri? Boleh banget! Tapi harus memenuhi **minimum requirements** berikut:

#### Minimum Requirements
- ✅ Fullstack (frontend + backend + database)
- ✅ User authentication & authorization
- ✅ Minimum 4 database tables dengan relasi
- ✅ Full CRUD operations pada minimal 2 entities
- ✅ Input validation (frontend + backend)
- ✅ Error handling yang proper
- ✅ Responsive design
- ✅ Deployed & accessible online

#### Proposal Submission
Sebelum mulai, submit proposal ke mentor yang berisi:
1. Nama project & deskripsi singkat
2. Problem yang di-solve
3. Feature list (MVP + Nice-to-have)
4. Tech stack yang akan digunakan
5. Database schema (minimal draft)
6. Wireframe/mockup (bisa hand-drawn)

**Deadline proposal: Day 1, end of day.**

---

## 📅 Timeline — 7 Hari Pertempuran

### 🗓️ Day 1-2: Planning & Setup — "Menyusun Strategi"

**Day 1:**
- [ ] Pilih quest dan finalisasi scope
- [ ] Buat wireframe/mockup (Figma, Excalidraw, atau kertas)
- [ ] Design database schema
- [ ] List semua API endpoints
- [ ] Setup repository dengan README awal
- [ ] Setup project structure (frontend + backend)
- [ ] Setup database & initial migration
- [ ] Setup CI (GitHub Actions — minimal linting)

**Day 2:**
- [ ] Implement authentication (register, login, middleware)
- [ ] Setup base layout & routing (frontend)
- [ ] Implement basic CRUD untuk entity utama
- [ ] Seed database dengan sample data
- [ ] Pastikan frontend bisa connect ke backend

**Checkpoint Day 2:** Auth works ✅ | Basic CRUD works ✅ | Frontend-Backend connected ✅

### 🗓️ Day 3-5: Building — "Pertempuran Utama"

**Day 3:**
- [ ] Implement remaining CRUD operations
- [ ] Build main feature pages (listing, detail, forms)
- [ ] Add input validation (Zod/Joi + frontend validation)
- [ ] Implement authorization (role-based access)

**Day 4:**
- [ ] Implement secondary features (search, filter, pagination)
- [ ] Polish UI/UX (loading states, error states, empty states)
- [ ] Add nice-to-have features kalau ahead of schedule
- [ ] Write unit tests untuk critical paths

**Day 5:**
- [ ] Complete all MVP features
- [ ] Responsive design check (mobile, tablet, desktop)
- [ ] Error handling audit — no unhandled errors
- [ ] Polish, polish, polish

**Checkpoint Day 5:** All MVP features complete ✅ | App looks good ✅ | No major bugs ✅

### 🗓️ Day 6: Testing & Deployment — "Mengasah Pedang"

- [ ] Final testing — manual walkthrough semua features
- [ ] Fix remaining bugs
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy database (Supabase/Neon/Railway)
- [ ] Test deployed version thoroughly
- [ ] Environment variables configured correctly
- [ ] Write/finalize README dengan screenshots
- [ ] Setup .env.example

**Checkpoint Day 6:** App deployed & working ✅ | README complete ✅

### 🗓️ Day 7: Presentation Prep — "Sebelum Memasuki Arena"

- [ ] Prepare demo script (10 menit)
- [ ] Take screenshots untuk README & presentasi
- [ ] Record backup demo video (kalau live demo fails)
- [ ] Prepare slide deck (optional tapi recommended)
- [ ] Practice presentation 2-3 kali
- [ ] Final push ke GitHub — clean commit history
- [ ] Double-check live URL works

---

## 📊 Grading Rubric

### Technical Implementation (40 points)

| Criteria | Poor (0-3) | Good (4-7) | Excellent (8-10) |
|----------|-----------|------------|-------------------|
| **Backend Architecture** | Messy routes, no separation of concerns | Clear structure, proper middleware | Clean architecture, reusable services, proper error handling |
| **Database Design** | Missing relations, no validation | Proper schema with relations | Normalized, indexed, with migrations & seeds |
| **Frontend Quality** | Basic HTML, no component structure | Component-based, decent state management | Clean components, custom hooks, proper state management |
| **Authentication & Security** | Basic or broken auth | JWT auth works, basic validation | Secure auth, input sanitization, proper authorization |

### Code Quality (20 points)

| Criteria | Poor (0-3) | Good (4-7) | Excellent (8-10) |
|----------|-----------|------------|-------------------|
| **Clean Code** | Inconsistent style, no structure | Consistent formatting, decent naming | Linted, well-structured, meaningful names, DRY |
| **Git Practices** | Few large commits, unclear messages | Regular commits, decent messages | Conventional commits, meaningful history, branches |

### User Experience (20 points)

| Criteria | Poor (0-3) | Good (4-7) | Excellent (8-10) |
|----------|-----------|------------|-------------------|
| **UI/UX Design** | Looks broken, hard to use | Clean and functional | Polished, intuitive, delightful details |
| **Responsiveness** | Desktop only | Works on mobile with issues | Fully responsive, great on all devices |

### Deployment & Documentation (10 points)

| Criteria | Poor (0-2) | Good (3-4) | Excellent (5) |
|----------|-----------|------------|---------------|
| **Deployment** | Not deployed or broken | Deployed but unstable | Stable deployment, proper env config |
| **README** | Minimal or missing | Has setup guide and description | Full README with badges, screenshots, setup guide |

### Presentation (10 points)

| Criteria | Poor (0-2) | Good (3-4) | Excellent (5) |
|----------|-----------|------------|---------------|
| **Demo** | Can't demo, broken | Shows main features | Smooth demo, handles edge cases |
| **Communication** | Can't explain decisions | Explains what was built | Articulates technical decisions and trade-offs |

### Bonus Points (up to +10)

- **Testing:** Unit/integration tests (+3)
- **Extra Features:** Beyond MVP with quality (+3)
- **Performance:** Lighthouse 90+, optimized queries (+2)
- **Innovation:** Creative solution or unique feature (+2)

**Total: 100 points + 10 bonus**

| Grade | Points | Title |
|-------|--------|-------|
| S | 95+ | 🏆 **Arcane Grandmaster** — Legendary! |
| A | 85-94 | ⚔️ **Arcane Knight** — Exceptional |
| B | 70-84 | 🛡️ **Arcane Guardian** — Solid |
| C | 55-69 | 📜 **Arcane Apprentice** — Acceptable |
| D | < 55 | 💀 **Fallen Knight** — Needs Improvement |

---

## 🛠️ Technical Requirements Checklist

```markdown
## Backend
- [ ] Node.js + Express (atau framework lain yang di-approve)
- [ ] PostgreSQL database
- [ ] Prisma ORM (recommended) atau Sequelize/Knex
- [ ] JWT authentication
- [ ] Input validation (Zod/Joi)
- [ ] Error handling middleware
- [ ] Environment variables (.env)
- [ ] Proper HTTP status codes
- [ ] CORS configuration

## Frontend
- [ ] React (CRA, Vite, atau Next.js)
- [ ] React Router (kalau bukan Next.js)
- [ ] State management (Context API / Zustand / Redux — pick one)
- [ ] Form handling & validation
- [ ] Loading & error states
- [ ] Responsive design
- [ ] Clean component architecture

## DevOps
- [ ] Git dengan meaningful commits
- [ ] GitHub repository (public)
- [ ] Deployed frontend
- [ ] Deployed backend
- [ ] Deployed database
- [ ] README.md yang comprehensive
- [ ] .env.example file

## Nice-to-have
- [ ] TypeScript
- [ ] Unit tests
- [ ] GitHub Actions CI
- [ ] API documentation (Swagger/Postman collection)
```

---

## 💡 Pro Tips dari Senior Knights

### 1. Start Small, Ship Fast
Jangan langsung build semua fitur. Selesaikan MVP dulu, deploy dulu, baru iterate. Lebih baik punya app sederhana yang works dan deployed daripada app complex yang setengah jadi.

### 2. Seed Your Database
Bikin seed file yang generate data realistis. App yang kosong pas demo itu sad. Bikin minimal 20-30 records yang keliatan real:

```javascript
// prisma/seed.js
const products = [
  {
    name: "Mechanical Keyboard Phantom RGB",
    description: "Hot-swappable switches, per-key RGB lighting...",
    price: 1299000,
    stock: 45,
    image_url: "https://picsum.photos/seed/kb1/400/400"
  },
  // ... 20+ more realistic products
];
```

### 3. Handle Edge Cases
Recruiter dan mentor WILL try to break your app. Handle:
- Empty states ("No products found")
- Loading states (skeleton loaders > spinners)
- Error states ("Something went wrong, try again")
- Unauthorized access (redirect ke login)
- Invalid input (show helpful error messages)

### 4. Git Like a Pro

```bash
# Branch strategy
main          → production (deployed)
develop       → integration
feat/auth     → feature branch
fix/cart-bug  → bugfix branch

# Workflow
git checkout -b feat/shopping-cart
# ... code ...
git add .
git commit -m "feat(cart): implement add to cart functionality"
git push origin feat/shopping-cart
# Create PR → merge to develop → merge to main
```

### 5. Deploy Early, Deploy Often
Jangan tunggu Day 6 baru deploy! Deploy di Day 2 begitu auth dan basic CRUD jalan. Ini menghindari "deploy panic" di menit-menit terakhir.

---

## 🎤 Presentation Guide

### Structure (10 menit)

1. **Intro (1 menit)** — Nama, project name, problem statement
2. **Tech Stack (1 menit)** — Apa yang dipakai dan kenapa
3. **Live Demo (5 menit)** — Walkthrough main features
4. **Technical Deep Dive (2 menit)** — Satu hal yang kamu bangga secara teknis (auth flow, database design, etc.)
5. **Lessons Learned (1 menit)** — Challenges dan bagaimana kamu solve

### Demo Tips
- Buka app yang sudah pre-loaded dengan data
- Jangan ketik password live — prepare semuanya
- Punya **backup recorded demo** kalau internet mati
- Show mobile responsiveness (buka DevTools, toggle device)
- Prepare "wow moment" — satu fitur yang paling impressive

### Q&A Preparation
Expect pertanyaan seperti:
- "Kenapa pilih [tech X] daripada [tech Y]?"
- "Bagaimana kamu handle [security concern]?"
- "Apa yang akan kamu improve kalau punya lebih banyak waktu?"
- "Bagaimana database schema-mu handle [edge case]?"
- "Apa challenge terbesar dan gimana kamu solve?"

---

## 🏆 Penutup — The Final Words

> *"Knight, ini bukan akhir dari perjalananmu. Ini adalah awal. Capstone Project ini adalah bukti bahwa kamu bisa belajar, build, dan deliver. Itu adalah skill paling berharga di industri ini."*
>
> *"Bertempurlah dengan segenap kemampuanmu. Bukan untuk grade, bukan untuk pujian — tapi untuk membuktikan pada dirimu sendiri bahwa kamu mampu."*
>
> *"Kami percaya padamu. Sekarang, tunjukkan pada dunia siapa dirimu."*

**⚔️ Go forth, Arcane Knight. Your quest awaits. ⚔️**

---

*Arcane Quest Phase 2 — Week 5 | ETHJKT Bootcamp*
*"From Apprentice to Knight — The Final Chapter"*
