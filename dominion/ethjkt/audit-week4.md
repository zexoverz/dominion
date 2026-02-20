# Audit Report — ETHJKT Phase 2 Week 4: State & API

**Audited:** 2026-02-17
**Files reviewed:** 23 (.md files across study-material/, arcane-quest/, quiz/)
**Total lines:** ~13,500

## Summary

The course materials are **well-written overall**. Code examples are mostly correct, well-structured, and follow modern React/TypeScript patterns. A few issues were found and fixed.

## Issues Found & Fixed

### 1. Missing `immer` package install instruction
**File:** `study-material/02-zustand.md`
**Impact:** 🔴 High — students using the immer middleware examples would get a runtime error
**Problem:** The file shows `import { immer } from 'zustand/middleware/immer'` but never instructs students to install the `immer` peer dependency.
**Fix:** Added install note before the immer middleware section: `npm install immer`

### 2. Missing `CartItem` type definition (persist example)
**File:** `study-material/02-zustand.md`
**Impact:** 🟡 Medium — TypeScript compilation error if copied verbatim
**Problem:** `CartItem` type used in `CartState` interface but never defined in the persist middleware code block.
**Fix:** Added `CartItem` interface definition before the `CartState` interface.

### 3. Missing `Todo` type definition (immer example)
**File:** `study-material/02-zustand.md`
**Impact:** 🟡 Medium — TypeScript compilation error if copied verbatim
**Problem:** `Todo` type used in `TodoState` interface at line ~279 but only defined later at line ~550 in the full build section.
**Fix:** Added `Todo` interface definition in the immer middleware code block.

### 4. Missing `CartItem` type definition (slices example)
**File:** `study-material/02-zustand.md`
**Impact:** 🟡 Medium — TypeScript compilation error if copied verbatim
**Problem:** `CartSlice` in the slices pattern uses `CartItem` without defining it.
**Fix:** Added `CartItem` interface definition in the cartSlice code block.

### 5. Toast library inconsistency across files
**Files:** `study-material/10-error-handling-ux.md` (uses `sonner`), `study-material/12-websocket-intro.md` (uses `react-hot-toast`)
**Impact:** 🟢 Low — could confuse students about which library to use
**Problem:** Two different toast libraries used across the curriculum without acknowledgment.
**Fix:** Added a note in file 12 alerting students to the difference and explaining that either library works.

## Items Reviewed — No Issues Found

The following were checked across all files and found to be correct:

- ✅ All `npm install` package names are valid
- ✅ All import paths match their respective packages
- ✅ React hooks usage follows rules of hooks
- ✅ Zustand `create`, `set`, `get` patterns are correct
- ✅ React Query v5 API usage (`useQuery`, `useMutation`, `useQueryClient`) is correct
- ✅ Axios interceptor patterns are correct
- ✅ Express.js server code is syntactically correct
- ✅ JWT auth flow (sign, verify, refresh) is logically sound
- ✅ Protected route patterns work correctly
- ✅ Socket.IO client/server patterns are correct
- ✅ MSW v2 API (`http.get`, `HttpResponse.json`) is correct
- ✅ Vitest + RTL test patterns are correct
- ✅ Vite env variable patterns (`import.meta.env.VITE_*`) are correct
- ✅ Shell commands and CLI flags are correct
- ✅ Mermaid diagrams render correctly
- ✅ Quiz challenges have intentional bugs (by design) — not flagged

## Notes

- Code snippets are educational and often partial (missing React imports, etc.). This is standard practice for teaching materials and not flagged as issues.
- The `satisfies` keyword used in `05-axios-service-layer.md` requires TypeScript 4.9+ — this is fine for modern projects.
- File 04's custom `useSWRCustom` hook has missing ESLint deps in `useEffect` — acceptable for a simplified educational example.
