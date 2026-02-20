# Audit Report: ETHJKT Phase 2 Week 3 - Frontend Advance

**Date:** 2026-02-17
**Auditor:** Claude (subagent)
**Files reviewed:** 24 .md files across study-material/, arcane-quest/, quiz/

---

## Summary

Overall the code quality is **very good**. The materials are well-written, practical, and mostly correct. Found **4 issues** that would cause real problems when students copy-paste code.

---

## Issues Found

### Issue 1: Wrong vite-plugin-svgr Import Syntax (BREAKING)

**File:** `study-material/01-vite-setup.md` (~line 320)
**Severity:** 🔴 HIGH - Code will not work

**Broken code:**
```typescript
import { ReactComponent as Logo } from '@assets/logo.svg'
```

**Problem:** This is CRA-style named import. With `vite-plugin-svgr` v4+, the default import pattern uses the `?react` URL suffix. The `ReactComponent` named export doesn't exist by default.

**Fix:**
```typescript
import Logo from '@assets/logo.svg?react'
```

**Status:** ✅ Fixed

---

### Issue 2: Missing Package Installs for TanStack Router + Zod (BREAKING)

**File:** `study-material/10-tanstack-router.md` (~line 30)
**Severity:** 🔴 HIGH - Code won't run without these packages

**Broken code:**
```bash
npm install @tanstack/react-router
# For file-based routing (optional but recommended):
npm install -D @tanstack/router-plugin @tanstack/router-devtools
```

**Problem:** The code later uses `zod`, `@tanstack/router-zod-adapter`, and `fallback`/`zodSearchValidator` imports, but these packages are never installed.

**Fix:** Added `zod` and `@tanstack/router-zod-adapter` to install command.

**Status:** ✅ Fixed

---

### Issue 3: CommonJS `require()` in Cypress TypeScript Test (BREAKING)

**File:** `study-material/14-cypress-testing.md` (~line 260)
**Severity:** 🟡 MEDIUM - Will cause error in ESM/strict TS setup

**Broken code:**
```typescript
cy.intercept('GET', '/api/products', {
  body: [
    ...require('../fixtures/products.json'),
    { id: '99', ... },
  ],
});
```

**Problem:** `require()` is CommonJS and won't work in ESM TypeScript files without special config. In Cypress with TypeScript, this may fail.

**Fix:** Changed to use a pre-imported fixture variable with `cy.fixture()` pattern.

**Status:** ✅ Fixed

---

### Issue 4: Tailwind v4 Install in TanStack Table/Form Demos (MINOR)

**Files:** `study-material/11-tanstack-table.md`, `study-material/12-tanstack-form.md`
**Severity:** 🟢 LOW - Works but may confuse students on Tailwind v3

**Code:**
```bash
npm install -D tailwindcss @tailwindcss/vite
```

**Problem:** `@tailwindcss/vite` is Tailwind v4 only. Students familiar with v3 may be confused (no `tailwind.config.js`, different CSS setup). However, since Tailwind v4 is current, this is more of a note than a bug.

**Status:** ⏭️ Not changed (v4 is current)

---

## Files Reviewed (No Issues Found)

- `study-material/02-useref-deep-dive.md` ✅
- `study-material/03-usecontext-deep-dive.md` ✅
- `study-material/04-usecallback-usememo.md` ✅
- `study-material/05-usereducer.md` ✅
- `study-material/06-advanced-patterns.md` ✅
- `study-material/07-custom-hooks.md` ✅
- `study-material/08-react-performance.md` ✅
- `study-material/09-tanstack-query.md` ✅
- `study-material/13-redux-toolkit.md` ✅
- `study-material/15-stripe-clerk.md` ✅
- `study-material/16-sk-code-review.md` ✅ (no runnable code)
- `quiz/quiz-hooks.md` ✅ (intentionally broken starter code for students to fix)
- `quiz/quiz-patterns.md` ✅ (same - starter code is intentionally incomplete)
- `quiz/quiz-performance.md` ✅ (same - intentionally buggy for students to fix)
- `arcane-quest/aq-01-dashboard.md` ✅ (skeleton/instructions only)
- `arcane-quest/aq-02-ecommerce.md` ✅ (skeleton/instructions only)
- `arcane-quest/aq-03-realtime-chat.md` ✅ (skeleton/instructions only)
- `arcane-quest/aq-04-group-project.md` ✅ (no code)
- `arcane-quest/aq-05-ujian.md` ✅ (intentionally broken starter code)

---

## Notes

- Quiz and exam files contain **intentionally broken code** for students to fix — these were not flagged as issues.
- Arcane quest files are mostly project briefs with skeleton code — no runnable snippets to validate.
- All React hooks usage patterns are correct (rules of hooks followed, proper dependency arrays).
- TanStack Query/Table/Form/Router APIs are used correctly throughout.
- TypeScript types are generally correct and well-defined.
