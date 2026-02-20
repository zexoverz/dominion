# Dominion Frontend Revamp V2 — Real RPG Assets

## What Changed from V1
V1 used emoji icons. V2 uses real RPG UI framework + pixel art.

## NES.css Framework
Already installed at `node_modules/nes.css/css/nes.min.css`.
Import it in globals.css: `@import 'nes.css/css/nes.min.css';`

NES.css gives us:
- `nes-container` — RPG dialog boxes with pixel borders (with-title, is-rounded, is-dark)
- `nes-btn` — pixel art buttons (is-primary, is-success, is-warning, is-error)
- `nes-progress` — HP/MP style progress bars (is-success, is-primary, is-warning, is-error)  
- `nes-badge` — status badges (is-splashed, is-dark)
- `nes-table` — pixel bordered tables
- `nes-icon` — built-in icons: star, heart, trophy, coin, like, close, etc
- `nes-avatar` — avatar containers
- `nes-balloon` — speech bubbles (from-left, from-right)
- `nes-list` — RPG style lists (is-circle, is-disc)
- `nes-text` — colored text (is-primary, is-success, is-warning, is-error)
- `nes-select` — pixel select dropdowns

## Design Strategy
1. Use NES.css for all UI components (panels, buttons, progress bars, badges)
2. Keep our warm parchment color scheme from V1 as background
3. Create pixel art character sprites using CSS (16x16 or 32x32 grid patterns)
4. Use `image-rendering: pixelated` for crisp pixel scaling
5. Add RPG decorations: swords, shields, scrolls as CSS/SVG pixel art
6. Font: "Press Start 2P" for titles (already loaded), system sans for body text

## Pixel Art Characters (CSS-based)
Create 7 general avatars as small pixel art PNGs generated via canvas in a build script,
OR use inline SVGs with pixel grid patterns. Each general has distinct look:

- THRONE: King with crown, gold cape (32x32)
- GRIMOIRE: Wizard with book, purple robe  
- ECHO: Bard with horn, blue outfit
- SEER: Oracle with crystal ball, cyan hood
- PHANTOM: Dark assassin, black cloak
- MAMMON: Merchant with gold coins, brown outfit  
- WRAITH-EYE: Hooded watcher, red eye

Alternative approach: Use NES.css built-in character icons or create simple CSS pixel avatars.

## What to Change from Current V1 Build
The V1 build at the current code is already functional. Make these upgrades:

1. **Import NES.css** in globals.css  
2. **Replace custom panels** with `nes-container` classes
3. **Replace custom progress bars** with `nes-progress`
4. **Replace custom buttons** with `nes-btn`
5. **Replace custom badges** with `nes-badge`
6. **Add pixel art character images** for each general (create as small inline SVGs or CSS)
7. **Add RPG decorations** — border ornaments, section dividers, scroll backgrounds
8. **Keep the layout/routing structure** from V1 (it works)
9. **Keep api.ts** untouched
10. **Mobile must still work** — NES.css is responsive

## Pages to Update
- Dashboard: use nes-container for panels, nes-progress for quest status
- Quests: nes-container for quest cards, nes-progress for step progress
- Intel: nes-container for report cards, keep markdown rendering
- Generals: nes-container with pixel art avatar for each general
- Command: nes-container + nes-btn for approve/reject

## Key Files
- `app/globals.css` — add NES.css import + override colors for warm theme
- All page/component files — swap CSS classes to NES.css classes
- `components/` — update to use NES.css components
- `public/assets/` — any generated pixel art sprites

## MUST DO
- `npm run build` must pass
- Test on mobile viewport
- Keep all API integrations working
- Keep react-markdown for report rendering
