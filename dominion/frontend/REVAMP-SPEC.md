# Dominion Frontend Revamp — RPG Game UI

## Vision
Transform from dark-techy dashboard into a warm, colorful RPG game interface like classic RPG Maker / SNES / GBA games. Think: Final Fantasy menu systems, Chrono Trigger overworld, Pokemon UI simplicity.

## Design Principles
1. **Warm, colorful RPG palette** — NO more dark purple/black. Use warm browns, golds, greens, blues
2. **RPG UI patterns** — dialog boxes, menu panels, HP/MP bars, quest logs, item screens
3. **Pixel art aesthetic** — but readable and functional, not just decoration
4. **Mobile-first** — must work great on phone
5. **Simple to use** — a non-technical person should understand what to do next

## Color Palette (RPG Warm)
- Background: warm parchment (#f4e8c1), light tan (#e8dcc8)
- Panels: warm brown borders (#8b6914), dark brown (#5a3e1b)
- Text: dark brown (#3a2a1a), gold (#c8a832) for titles
- Accents: forest green (#2d8b4e), royal blue (#3465a4), crimson (#c03030)
- Status: green HP, blue MP, gold EXP (classic RPG)

## Asset Strategy
Use CSS pixel art borders + simple emoji/unicode characters for generals instead of complex sprite components.
Each general gets a themed icon:
- THRONE 👑 Crown (gold)
- GRIMOIRE 📖 Book (purple)  
- ECHO 🔊 Horn (blue)
- SEER 🔮 Crystal ball (cyan)
- PHANTOM 👻 Ghost (dark)
- MAMMON 💰 Coins (gold)
- WRAITH-EYE 👁️ Eye (red)

Use CSS for RPG-style panel borders (double-line, rounded corners with pixel-art look).

## Pages (simplified from 9 → 5)

### 1. Dashboard (/) — "Town Square"
- Welcome banner with BTC ticker (small, top)
- **Active Quests** panel — show 2-3 active missions as quest cards
- **Recent Reports** — last 3 reports, clickable
- **Quick Stats** — missions active/completed, costs today
- Clean, scannable, mobile-friendly grid

### 2. Quests (/quests) — "Quest Board"  
- Replaces /missions
- Tab: Active | Completed
- Each quest = card with: title, assigned general (icon+name), status bar, priority badge
- Click → quest detail with steps as checklist
- Steps show: ☐ pending, ⏳ running, ✅ completed

### 3. Intel (/intel) — "Library"
- Replaces /reports
- Grid of report cards with: title, general icon, date, category badge
- Click → full report page with good markdown rendering
- **Mobile: full-width readable text**, proper font size, no overflow

### 4. Generals (/generals) — "Barracks"  
- Grid of 7 general cards
- Each shows: icon, name, role description, status (active/idle), last activity
- Click → general detail with their recent missions + reports

### 5. Command (/command) — "War Room"
- Replaces /admin + /roundtable
- Pending proposals to approve/reject
- Create new proposal form
- Cost overview
- Simple and functional

## Component Architecture

### RPGPanel — base container
```
┌─────────────────────┐
│ ═══ PANEL TITLE ═══ │  
├─────────────────────┤
│                     │
│  Content here       │
│                     │
└─────────────────────┘
```
Warm brown border, parchment bg, pixel font for title

### QuestCard — mission display
Shows: general icon, quest title, progress bar, priority tag

### ReportCard — intel item
Shows: general icon, title, date, category

### GeneralBadge — inline general display  
Small: icon + name. Used in cards.

### StatusBadge — active/completed/pending
Color-coded RPG style badges

### RPGProgress — HP-bar style progress
Green fill, pixel art borders

## Technical
- Keep Next.js 14, Tailwind, TypeScript
- Remove ALL sprite/avatar components (characters/, sprites/, throne-room/)
- Remove mock-data.ts — use real API only
- Keep api.ts (it works)
- Responsive: mobile-first breakpoints
- Test: `npm run build` must succeed before any deploy

## API Endpoints Used
- GET /api/missions (+ /:id with steps)
- GET /api/proposals (+ PATCH for approve/reject)
- GET /api/reports (+ /:slug for content)
- GET /api/generals
- GET /api/costs/daily
- GET /api/events

## File Structure (new)
```
app/
  layout.tsx          — RPG layout with nav
  page.tsx            — Dashboard "Town Square"
  globals.css         — RPG theme styles
  quests/
    page.tsx          — Quest Board
    [id]/page.tsx     — Quest Detail
  intel/
    page.tsx          — Library (reports list)
    [slug]/page.tsx   — Report reader
  generals/
    page.tsx          — Barracks
    [id]/page.tsx     — General profile
  command/
    page.tsx          — War Room
components/
  RPGPanel.tsx
  RPGNav.tsx          — top nav bar (mobile) or sidebar (desktop)
  QuestCard.tsx
  ReportCard.tsx
  GeneralBadge.tsx
  StatusBadge.tsx
  RPGProgress.tsx
  BtcTicker.tsx       — simplified
lib/
  api.ts              — keep as-is
  generals-config.ts  — general metadata (name, icon, color, role)
```
