# Dominion Frontend V3 — Real RPG Sprites + Polish

## Context
V2 is deployed with NES.css + SVG pixel avatars. It works but looks basic.
V3 uses REAL PNG sprite images (already generated in public/sprites/) and polishes the entire UX.

## Real Sprite Assets Available
Located in `public/sprites/`:
- throne.png (64x64 pixel art king with crown)
- grimoire.png (64x64 wizard with purple robe)
- echo.png (64x64 bard with blue outfit)
- seer.png (64x64 hooded oracle with crystal)
- phantom.png (64x64 dark assassin)
- mammon.png (64x64 merchant with gold)
- wraith-eye.png (64x64 hooded watcher with red eye)

These are REAL pixel art PNGs. Use `<Image>` from next/image with `style={{ imageRendering: 'pixelated' }}`.

## What to Fix/Improve

### 1. Replace PixelAvatar component
- Use the real PNG sprites from `/sprites/[name].png` instead of SVG grids
- Scale them up with `image-rendering: pixelated` for crisp pixel look
- Small size: 32px, Large size: 64px, XL for general detail pages: 128px

### 2. Dashboard (/) — Make it feel like a game start screen
- Top: "THE DOMINION" title with NES.css styling, subtle crown decoration
- BTC ticker as a small NES badge in corner
- Stats row: use nes-container with NES icons (coin, heart, star)
- Active quests section: show general sprite next to each quest
- Recent intel: show as scroll/parchment style cards
- Add a footer with "Lord Zexo's Command Center" flavor text

### 3. Quest Board (/quests) — RPG Quest Log style
- Header with scroll decoration
- Each quest card shows:
  - General sprite (32px) on the left
  - Quest title + description
  - NES progress bar (HP bar style)
  - Priority as star rating
  - Status badge with nes-badge
- Active quests first, completed below
- Quest detail page (/quests/[id]):
  - Large general sprite (64px)
  - Steps as a checklist with ☐/⏳/✅ icons
  - Step descriptions readable on mobile

### 4. Intel Library (/intel) — Scrolls and Books
- Report cards in grid, each showing:
  - General sprite (32px)
  - Report title
  - Date badge  
  - Category badge with color
- Report detail (/intel/[slug]):
  - Beautiful markdown rendering
  - Good typography, readable on mobile
  - General sprite + name at top
  - Back button

### 5. Barracks (/generals) — Character Select Screen
- Grid of general cards, each showing:
  - Large sprite (64px) centered
  - General name in pixel font
  - Role/title below
  - Status indicator (active/idle)
  - Recent activity summary
- General detail page:
  - XL sprite (128px)
  - Full lore/description
  - Their recent missions
  - Their reports

### 6. War Room (/command)
- Pending proposals with approve (nes-btn is-success) / reject (nes-btn is-error)
- Cost table with nes-table
- Simple, functional

### 7. Navigation
- Desktop: left sidebar with sprites for each section icon
- Mobile: bottom tab bar
- Active page highlighted with gold
- Small crown icon next to "Dominion" title

### 8. Overall Polish
- Smooth page transitions
- Loading states with pixel art spinner
- Error states with NES-style "!" dialog
- Consistent spacing and typography
- All text readable (body text: 14-16px system font, NOT pixel font for body)
- Pixel font ONLY for headings/titles/labels
- Dark brown (#3a2a1a) for body text, gold (#c8a832) for headings

## Technical Requirements
- Keep existing lib/api.ts UNTOUCHED
- Keep lib/generals-config.ts (update if needed for sprite paths)
- Use Next.js Image component for sprites with pixelated rendering
- NES.css already imported in globals.css
- Tailwind colors already configured
- `npm run build` MUST pass
- Test that all API calls work (getMissions, getReports, getGenerals, etc.)

## File Structure
```
public/sprites/ — real PNG sprites (already exist)
components/
  PixelAvatar.tsx — UPDATE to use real PNGs
  RPGPanel.tsx — keep NES.css styling
  RPGProgress.tsx — keep NES progress  
  QuestCard.tsx — add sprite, improve layout
  ReportCard.tsx — add sprite, improve layout
  GeneralBadge.tsx — use real sprite
  StatusBadge.tsx — keep nes-badge
  BtcTicker.tsx — keep nes-badge
  SwordDivider.tsx — keep
  RPGNav.tsx — add sprite icons
lib/
  api.ts — DO NOT TOUCH
  generals-config.ts — add spritePath field
app/
  globals.css — already has NES.css + parchment overrides
  page.tsx — upgrade
  quests/page.tsx — upgrade
  quests/[id]/page.tsx — upgrade
  intel/page.tsx — upgrade
  intel/[slug]/page.tsx — upgrade
  generals/page.tsx — upgrade
  generals/[id]/page.tsx — upgrade
  command/page.tsx — upgrade
  layout.tsx — upgrade nav
```
