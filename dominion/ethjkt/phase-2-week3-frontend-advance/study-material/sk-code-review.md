# 🤝 Code Review & Collaboration — Soft Skills yang Bikin Kamu Standout

> **ETHJKT Phase 2 — Week 3 | Arcane Quest: The Council Chamber**

## Kenapa Code Review Penting?

Kamu bisa jadi programmer paling jago sedunia, tapi kalau gak bisa kolaborasi sama tim, career kamu bakal stuck. **Code review** adalah salah satu skill paling penting di professional software development.

**Manfaat code review:**
- 🐛 **Catch bugs** sebelum masuk production
- 📚 **Knowledge sharing** — semua orang belajar dari satu sama lain
- 📏 **Consistency** — code style dan patterns tetap seragam
- 🛡️ **Security** — extra pair of eyes buat spot vulnerabilities
- 🌱 **Mentorship** — senior bisa guide junior lewat review

## Cara Review Pull Request (PR)

### Step 1: Understand the Context

Sebelum liat code, baca dulu:
- **PR title & description** — apa yang di-change dan kenapa?
- **Related issue/ticket** — ada Jira/Linear ticket gak?
- **Screenshots/recordings** — kalau ada UI changes

> 💡 Kalau PR gak ada description yang jelas, itu udah red flag pertama. Minta author tambahin context.

### Step 2: Big Picture Review

Jangan langsung zoom ke detail code. Liat dulu:
- Apakah **approach**-nya makes sense?
- Apakah ada **alternative** yang lebih simple?
- Apakah **scope**-nya sesuai? (gak terlalu besar, gak nyampur feature)
- Apakah ada **test**?

### Step 3: Line-by-Line Review

Sekarang baru dive deep:

```
✅ Check list:
□ Logic correctness — ada edge case yang ke-miss?
□ Error handling — gimana kalau API fail? Input invalid?
□ Performance — ada N+1 query? Unnecessary re-render?
□ Security — ada XSS, injection, exposed secrets?
□ Naming — variable/function names descriptive?
□ DRY — ada code duplication yang bisa di-extract?
□ Types — TypeScript types correct dan useful?
□ Tests — ada test buat happy path DAN edge cases?
```

### Step 4: Leave Comments

Ada 3 level feedback:

**🔴 Blocker (Must Fix)**
```
Bug yang bisa crash app atau security issue.
Contoh: "This will cause a null reference error when user hasn't loaded yet."
```

**🟡 Suggestion (Should Consider)**
```
Improvement yang significant tapi gak blocking.
Contoh: "Consider extracting this into a custom hook for reusability."
```

**🟢 Nit (Nice to Have)**
```
Style preferences, minor naming things.
Contoh: "nit: prefer `isLoading` over `loading` for boolean naming convention"
```

### Prefix Convention

Tim profesional sering pake prefix di comments:

| Prefix | Arti |
|--------|------|
| `blocker:` | Must fix sebelum merge |
| `suggestion:` | Strong recommendation |
| `question:` | Minta penjelasan |
| `nit:` | Minor, gak blocking |
| `praise:` | Good job! |
| `thought:` | Just thinking out loud |

## Giving Constructive Feedback

### ❌ Toxic Review

```
"This code is terrible."
"Why would you do it this way?"
"This is wrong." (tanpa penjelasan)
"Just rewrite the whole thing."
```

### ✅ Constructive Review

```
"This approach works, but I think we could simplify it by using
useReducer instead of multiple useState calls. Here's what I mean:
[code example]. What do you think?"
```

### Framework: Observation → Impact → Suggestion

1. **Observation**: "I notice this function handles both fetching and formatting data."
2. **Impact**: "This makes it harder to test and reuse each piece separately."
3. **Suggestion**: "What if we split it into `fetchUsers()` and `formatUserList()`?"

### Tips Giving Feedback

- **Use "we" instead of "you"** — "We might want to..." vs "You should..."
- **Ask questions instead of commands** — "Have you considered...?" vs "Do this."
- **Explain the why** — jangan cuma bilang "change this", jelasin alasannya
- **Give praise too!** — "Nice pattern here! I'll use this in my next PR too."
- **Be specific** — kasih code example kalau bisa
- **Assume good intent** — maybe they had a reason you don't know about

### Review Example: Good vs Bad

**Code being reviewed:**
```typescript
const getData = async () => {
  const res = await fetch('/api/users')
  const data = await res.json()
  setUsers(data)
}
```

**❌ Bad review:**
> "No error handling. Fix this."

**✅ Good review:**
> "suggestion: This fetch call doesn't have error handling. If the API is down or returns an error status, `res.json()` might throw or we'd set invalid data into state. Consider wrapping in try/catch:
> ```typescript
> try {
>   const res = await fetch('/api/users')
>   if (!res.ok) throw new Error(`HTTP ${res.status}`)
>   const data = await res.json()
>   setUsers(data)
> } catch (err) {
>   setError('Failed to load users')
>   console.error(err)
> }
> ```
> This way users see a friendly error message instead of a broken page."

## Responding to Reviews

Kamu juga bakal di-review! Here's how to handle it:

### DO ✅

- **Say thanks** — reviewer spent time helping you improve
- **Ask for clarification** — "Could you elaborate on what you mean by...?"
- **Explain your reasoning** — kalau kamu punya alasan, share it
- **Be open to change** — ego down, learning up
- **Respond to every comment** — even just "Done!" or "Good point, updated"

### DON'T ❌

- **Take it personally** — feedback is about code, not you
- **Get defensive** — "It works, what's the problem?" is never a good response
- **Ignore comments** — kalau gak setuju, discuss, jangan diem aja
- **Make excuses** — "I was in a rush" → just fix it and move on

### Common Responses

```
✅ "Good catch! Fixed in the latest commit."
✅ "Interesting suggestion! I went with X because [reason], but I see the benefit of Y. Wanna discuss?"
✅ "TIL! Didn't know about this pattern. Updated."
✅ "I disagree on this one because [reason], but happy to discuss further."
```

## Git Branching Strategies

Code review gak bisa dipisahin dari branching strategy. Tim harus align soal gimana manage branches.

### 1. GitFlow

```
main ──────────────────────────────────► (production)
  │
  └── develop ─────────────────────────► (integration)
        │         │         │
        └── feature/auth    └── feature/cart
              │
              └── PR → develop → PR → main (release)
```

**Branches:**
- `main` — production code, always stable
- `develop` — integration branch
- `feature/*` — new features, branch from develop
- `release/*` — prepare release, branch from develop
- `hotfix/*` — urgent fixes, branch from main

**Kapan pake GitFlow:**
- Team besar (5+ devs)
- Release cycle yang structured (versioned releases)
- Need staging/QA environment

### 2. Trunk-Based Development

```
main ──●──●──●──●──●──●──●──●──●──► (production)
       │  │     │        │
       └──┘     └────────┘
    short-lived feature branches
    (< 1-2 days)
```

**Rules:**
- Branch dari `main`, merge balik ke `main`
- Feature branches harus **short-lived** (max 1-2 hari)
- Pake **feature flags** buat hide incomplete features
- CI/CD harus solid

**Kapan pake Trunk-Based:**
- Team kecil-medium
- Continuous deployment
- Strong CI/CD pipeline
- Experienced team

### 3. GitHub Flow (Simplified)

```
main ──────────────────────────────────►
  │              │              │
  └── feature/x  └── fix/bug-y  └── feature/z
       │              │              │
       └── PR ────────└── PR ────────└── PR
```

**Simple rules:**
1. `main` is always deployable
2. Branch from `main` for any work
3. Open PR when ready for review
4. After review & CI pass, merge to `main`
5. Deploy from `main`

**Ini yang paling umum buat open source dan small-medium teams.**

### Perbandingan

| | GitFlow | Trunk-Based | GitHub Flow |
|---|---------|-------------|-------------|
| Complexity | High | Low | Low |
| Release cycle | Structured | Continuous | Continuous |
| Team size | Large | Any | Small-Medium |
| Branch lifespan | Long | Very short | Medium |
| Best for | Enterprise | Experienced teams | Most projects |

## PR Best Practices

### Bikin PR yang Good

1. **Small & focused** — 1 PR = 1 concern. Max 400 lines changed.
2. **Descriptive title** — `feat: add wallet connect button` bukan `update stuff`
3. **Good description** — what, why, how, screenshots
4. **Self-review first** — review code kamu sendiri sebelum request review
5. **Link related issues** — `Closes #42` di description

### PR Template

```markdown
## What
Brief description of changes.

## Why
Why is this change needed? Link to issue/ticket.

## How
Technical approach taken.

## Screenshots
(if UI changes)

## Checklist
- [ ] Self-reviewed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.logs left
- [ ] Types are correct
```

### Commit Messages

Pake [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication with Clerk
fix: resolve cart total calculation bug
refactor: extract payment logic into custom hook
docs: update README with setup instructions
test: add E2E tests for checkout flow
chore: update dependencies
```

## Collaboration Tools & Tips

### Code Owners

```
# .github/CODEOWNERS
# Format: path pattern → owner

*.ts        @frontend-team
/server/    @backend-team
/contracts/ @solidity-team
*.md        @docs-team
```

### Review Etiquette

1. **Review within 24 hours** — jangan biarin PR nganggur berhari-hari
2. **Batch comments** — review sekali yang thorough, bukan comment satu-satu sepanjang hari
3. **Approve with comments** — kalau cuma nit/minor, approve aja dan note "approve with nits"
4. **Don't be a gatekeeper** — kalau gak ada blocker, merge. Perfect is the enemy of good.
5. **Rotate reviewers** — jangan cuma 1 orang yang selalu review

## 🏋️ Latihan: Arcane Quest Collaboration Challenge

### Quest 1: Review a PR
Partner sama temen. Masing-masing bikin PR sederhana (misalnya add a component), terus review PR satu sama lain. Practice:
- Kasih minimal 1 praise, 1 suggestion, 1 nit
- Pake prefix convention
- Respond ke semua comments

### Quest 2: Branching Strategy
Discuss sama team:
- Pilih branching strategy buat group project
- Setup branch protection rules di GitHub
- Bikin PR template
- Setup CODEOWNERS

### Quest 3: Conflict Resolution
Intentionally bikin merge conflict:
1. Dua orang edit file yang sama
2. Practice resolve conflict
3. Discuss gimana prevent conflicts di masa depan

### Quest 4: Write PR Description
Ambil salah satu code kamu dari Week 1-2, pretend it's a new feature, dan tulis PR description yang lengkap dengan:
- What/Why/How sections
- Screenshots (kalau applicable)
- Checklist
- Linked "issue"

## Resources

- 📖 [Google Engineering Practices - Code Review](https://google.github.io/eng-practices/review/)
- 📖 [Conventional Commits](https://www.conventionalcommits.org/)
- 📖 [Trunk-Based Development](https://trunkbaseddevelopment.com/)
- 📖 [GitHub Flow Guide](https://docs.github.com/en/get-started/quickstart/github-flow)
- 🎥 [How to Do Code Review - The Primeagen](https://www.youtube.com/watch?v=1Ge__2Yx_XQ)

---

> 🤝 *"Di guild manapun, archer yang paling jago tapi gak bisa kerja sama tim bakal kalah sama party yang solid. Code review itu ritual bonding antar developer."* — ETHJKT Arcane Wisdom
