# ⚔️ ARCANE QUEST: Deploy & Test

## ETHJKT Phase 2 — Week 5: Fullstack Capstone

> 🧙‍♂️ **Quest Objective:** Ambil Arcane Notes app dari quest sebelumnya, tulis 8 tests, setup CI/CD, dan deploy ke production. End-to-end — dari code ke live URL.

---

## 🗺️ Quest Overview

| Step | Task | Waktu |
|------|------|-------|
| 1 | Tulis 8 tests (4 unit + 4 integration) | 45 menit |
| 2 | Setup GitHub Actions CI | 20 menit |
| 3 | Deploy backend ke Railway | 30 menit |
| 4 | Deploy frontend ke Vercel | 20 menit |
| 5 | Verify production | 15 menit |

**Prerequisites:**
- Arcane Notes app dari quest sebelumnya (`ln-mini-fullstack.md`)
- GitHub account
- Vercel account (free)
- Railway account (free)

---

## ⚔️ Step 1: Tulis 8 Tests

### Setup Testing (kalau belum)

```bash
# Frontend testing
cd client
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Backend testing
cd ../server
npm install -D vitest
```

**Frontend config:**

```typescript
// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

```typescript
// client/src/test/setup.ts
import '@testing-library/jest-dom';
```

**Backend config:**

```typescript
// server/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

**Package.json scripts (kedua folder):**

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

---

### Test 1 & 2: Backend Unit Tests

Buat utility functions dan test-nya:

```typescript
// server/src/utils/validation.ts
export function validateNoteTitle(title: string): { valid: boolean; error?: string } {
  if (!title || title.trim() === '') {
    return { valid: false, error: 'Title tidak boleh kosong' };
  }
  if (title.trim().length > 255) {
    return { valid: false, error: 'Title maksimal 255 karakter' };
  }
  return { valid: true };
}

export function sanitizeContent(content: string): string {
  return content.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function paginationParams(query: { page?: string; limit?: string }) {
  const page = Math.max(1, parseInt(query.page || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
```

```typescript
// server/src/utils/__tests__/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateNoteTitle, sanitizeContent, paginationParams } from '../validation';

// ===== TEST 1: validateNoteTitle =====
describe('validateNoteTitle', () => {
  it('should accept valid title', () => {
    const result = validateNoteTitle('My Arcane Note');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty title', () => {
    const result = validateNoteTitle('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Title tidak boleh kosong');
  });

  it('should reject whitespace-only title', () => {
    const result = validateNoteTitle('   ');
    expect(result.valid).toBe(false);
  });

  it('should reject title longer than 255 chars', () => {
    const longTitle = 'a'.repeat(256);
    const result = validateNoteTitle(longTitle);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('255');
  });
});

// ===== TEST 2: sanitizeContent & paginationParams =====
describe('sanitizeContent', () => {
  it('should remove script tags', () => {
    const dirty = 'Hello <script>alert("xss")</script> World';
    expect(sanitizeContent(dirty)).toBe('Hello  World');
  });

  it('should trim whitespace', () => {
    expect(sanitizeContent('  hello  ')).toBe('hello');
  });

  it('should keep normal content intact', () => {
    expect(sanitizeContent('Normal note content')).toBe('Normal note content');
  });
});

describe('paginationParams', () => {
  it('should return default values', () => {
    const result = paginationParams({});
    expect(result).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it('should calculate correct offset', () => {
    const result = paginationParams({ page: '3', limit: '20' });
    expect(result).toEqual({ page: 3, limit: 20, offset: 40 });
  });

  it('should clamp negative page to 1', () => {
    const result = paginationParams({ page: '-5' });
    expect(result.page).toBe(1);
  });

  it('should clamp limit to max 100', () => {
    const result = paginationParams({ limit: '999' });
    expect(result.limit).toBe(100);
  });
});
```

### Test 3 & 4: Frontend Unit Tests

```typescript
// client/src/utils/helpers.ts
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Tanggal tidak valid';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + '...';
}

export function noteCountLabel(count: number): string {
  if (count === 0) return 'Belum ada notes';
  if (count === 1) return '1 note';
  return `${count} notes`;
}
```

```typescript
// client/src/utils/__tests__/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, truncate, noteCountLabel } from '../helpers';

// ===== TEST 3: formatDate & truncate =====
describe('formatDate', () => {
  it('should format valid date', () => {
    const result = formatDate('2026-02-16T10:00:00Z');
    expect(result).toContain('2026');
  });

  it('should handle invalid date', () => {
    expect(formatDate('not-a-date')).toBe('Tanggal tidak valid');
  });
});

describe('truncate', () => {
  it('should not truncate short strings', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('should truncate long strings with ellipsis', () => {
    expect(truncate('hello world foo bar', 11)).toBe('hello world...');
  });

  it('should handle empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});

// ===== TEST 4: noteCountLabel =====
describe('noteCountLabel', () => {
  it('should return empty message for 0', () => {
    expect(noteCountLabel(0)).toBe('Belum ada notes');
  });

  it('should return singular for 1', () => {
    expect(noteCountLabel(1)).toBe('1 note');
  });

  it('should return plural for many', () => {
    expect(noteCountLabel(5)).toBe('5 notes');
  });
});
```

### Test 5 & 6: Frontend Component Tests (Integration)

```tsx
// client/src/components/NoteCard.tsx
interface NoteCardProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  onDelete: (id: number) => void;
}

export function NoteCard({ id, title, content, createdAt, onDelete }: NoteCardProps) {
  return (
    <div className="note-card" data-testid={`note-${id}`}>
      <div className="note-header">
        <h3>{title}</h3>
        <button onClick={() => onDelete(id)} aria-label={`Hapus ${title}`}>
          🗑️
        </button>
      </div>
      {content && <p>{content}</p>}
      <small>{new Date(createdAt).toLocaleDateString('id-ID')}</small>
    </div>
  );
}
```

```tsx
// client/src/components/__tests__/NoteCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteCard } from '../NoteCard';

// ===== TEST 5: NoteCard rendering =====
describe('NoteCard', () => {
  const props = {
    id: 1,
    title: 'Arcane Note',
    content: 'This is magical content',
    createdAt: '2026-02-16T10:00:00Z',
    onDelete: vi.fn(),
  };

  it('should render title and content', () => {
    render(<NoteCard {...props} />);
    expect(screen.getByText('Arcane Note')).toBeInTheDocument();
    expect(screen.getByText('This is magical content')).toBeInTheDocument();
  });

  it('should not render content paragraph when empty', () => {
    render(<NoteCard {...props} content="" />);
    expect(screen.getByText('Arcane Note')).toBeInTheDocument();
    expect(screen.queryByText('This is magical content')).not.toBeInTheDocument();
  });

  // ===== TEST 6: NoteCard interaction =====
  it('should call onDelete with correct id when delete clicked', async () => {
    const onDelete = vi.fn();
    render(<NoteCard {...props} onDelete={onDelete} />);
    
    const deleteBtn = screen.getByLabelText('Hapus Arcane Note');
    await userEvent.click(deleteBtn);
    
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('should have correct test id', () => {
    render(<NoteCard {...props} />);
    expect(screen.getByTestId('note-1')).toBeInTheDocument();
  });
});
```

### Test 7 & 8: Frontend Integration Tests (with API mocking)

```tsx
// client/src/components/NoteForm.tsx
import { useState } from 'react';

interface NoteFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
}

export function NoteForm({ onSubmit }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    
    setSubmitting(true);
    try {
      await onSubmit(title, content);
      setTitle('');
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="note-form">
      <input
        type="text"
        placeholder="Judul note..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Isi note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Menyimpan...' : '✨ Tambah Note'}
      </button>
    </form>
  );
}
```

```tsx
// client/src/components/__tests__/NoteForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteForm } from '../NoteForm';

// ===== TEST 7: NoteForm submission =====
describe('NoteForm', () => {
  it('should call onSubmit with title and content', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<NoteForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByPlaceholderText(/judul/i), 'Test Title');
    await userEvent.type(screen.getByPlaceholderText(/isi/i), 'Test Content');
    await userEvent.click(screen.getByText(/tambah/i));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Test Title', 'Test Content');
    });
  });

  it('should clear form after successful submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<NoteForm onSubmit={onSubmit} />);

    const titleInput = screen.getByPlaceholderText(/judul/i);
    const contentInput = screen.getByPlaceholderText(/isi/i);

    await userEvent.type(titleInput, 'Test');
    await userEvent.type(contentInput, 'Content');
    await userEvent.click(screen.getByText(/tambah/i));

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(contentInput).toHaveValue('');
    });
  });

  // ===== TEST 8: NoteForm validation & states =====
  it('should not submit with empty title', async () => {
    const onSubmit = vi.fn();
    render(<NoteForm onSubmit={onSubmit} />);

    // Only type content, leave title empty
    await userEvent.type(screen.getByPlaceholderText(/isi/i), 'Content only');
    await userEvent.click(screen.getByText(/tambah/i));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show submitting state', async () => {
    // Make onSubmit hang (never resolve)
    const onSubmit = vi.fn().mockImplementation(() => new Promise(() => {}));
    render(<NoteForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByPlaceholderText(/judul/i), 'Test');
    await userEvent.click(screen.getByText(/tambah/i));

    await waitFor(() => {
      expect(screen.getByText(/menyimpan/i)).toBeInTheDocument();
    });
  });
});
```

### Run All Tests:

```bash
# Frontend tests
cd client
npm run test:run
# Expected: 4 test files, all passing ✅

# Backend tests
cd ../server
npm run test:run
# Expected: 1 test file, all passing ✅
```

**Total: 8 test groups across 5 files.** ✅

---

## ⚔️ Step 2: Setup GitHub Actions

```bash
# Dari root project
mkdir -p .github/workflows
```

```yaml
# .github/workflows/ci.yml
name: 🧪 CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-client:
    name: Frontend Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: npm ci
      - run: npm run test:run
      - run: npm run build
        env:
          VITE_API_URL: https://placeholder.api.com

  test-server:
    name: Backend Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./server
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      - run: npm ci
      - run: npm run test:run
```

```bash
# Commit & push
git add .
git commit -m "🧪 add tests + CI pipeline"
git push origin main
```

Buka GitHub → Actions tab → lihat workflow running. Harusnya all green ✅.

---

## ⚔️ Step 3: Deploy Backend ke Railway

1. **Login** ke [railway.app](https://railway.app) dengan GitHub

2. **New Project** → Deploy from GitHub → pilih repo

3. **Configure service:**
   - Root Directory: `server`
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Add PostgreSQL:**
   - Klik "+" → Database → PostgreSQL

5. **Set environment variables:**
   ```
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=[generate random string]
   CLIENT_URL=[fill after Vercel deploy]
   ```

6. **Run migration** (via Railway CLI atau dashboard shell):
   ```sql
   CREATE TABLE notes (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

7. **Get URL** — Railway generates URL like: `arcane-notes-server-production.up.railway.app`

8. **Test:**
   ```bash
   curl https://arcane-notes-server-production.up.railway.app/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

---

## ⚔️ Step 4: Deploy Frontend ke Vercel

1. **Login** ke [vercel.com](https://vercel.com) dengan GitHub

2. **Add New Project** → Import repo

3. **Configure:**
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://arcane-notes-server-production.up.railway.app/api
   ```

5. **Deploy!**

6. **Get URL** — Vercel gives: `arcane-notes-client.vercel.app`

7. **Update Railway** — Balik ke Railway, update `CLIENT_URL`:
   ```
   CLIENT_URL=https://arcane-notes-client.vercel.app
   ```

---

## ⚔️ Step 5: Verify Production

### Checklist Verification:

```bash
# 1. Backend health check
curl https://YOUR-RAILWAY-URL/api/health
# ✅ Expected: {"status":"ok"}

# 2. Backend can read from DB
curl https://YOUR-RAILWAY-URL/api/notes
# ✅ Expected: {"success":true,"data":[]}

# 3. Backend can write to DB
curl -X POST https://YOUR-RAILWAY-URL/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Production Test","content":"Hello from production!"}'
# ✅ Expected: {"success":true,"data":{...}}

# 4. Frontend loads
# Open https://YOUR-VERCEL-URL in browser
# ✅ Expected: App loads, shows notes

# 5. Frontend connects to backend
# Create a note via the UI
# ✅ Expected: Note appears in the list

# 6. Frontend delete works
# Delete the test note
# ✅ Expected: Note disappears

# 7. GitHub Actions passing
# Check GitHub → Actions tab
# ✅ Expected: Latest run is green
```

---

## ✅ Quest Completion Checklist

- [ ] **8 tests written** (4 unit + 4 integration-ish)
- [ ] **All tests pass locally** (`npm run test:run`)
- [ ] **GitHub Actions workflow created** (`.github/workflows/ci.yml`)
- [ ] **CI runs on push** (check Actions tab)
- [ ] **Backend deployed to Railway** (health check passes)
- [ ] **PostgreSQL running on Railway** (can read/write)
- [ ] **Frontend deployed to Vercel** (page loads)
- [ ] **Frontend connects to backend** (can CRUD notes)
- [ ] **Both URLs are live** and accessible

---

## 🐛 Troubleshooting

### Tests fail in CI but pass locally
→ Check Node version (CI uses v20, make sure local matches)
→ Check if tests depend on local env vars

### Railway deploy fails
→ Check build logs in Railway dashboard
→ Common: missing `build` script or TypeScript errors

### Vercel shows blank page
→ Check browser console for errors
→ Check `VITE_API_URL` is set correctly
→ Make sure Root Directory is `client`

### CORS error in production
→ Update `CLIENT_URL` in Railway to exact Vercel URL
→ Include `https://` prefix

### Database connection error
→ Check `DATABASE_URL` variable reference in Railway
→ Make sure PostgreSQL service is running

---

## 🎉 Quest Complete!

Lo baru aja:
1. ✅ Wrote automated tests
2. ✅ Set up CI/CD pipeline
3. ✅ Deployed fullstack app to production
4. ✅ Verified everything works end-to-end

**Ini skill yang dipakai every single day di professional development.** Recruiters will be impressed.

> 🧙‍♂️ "An Arcane developer doesn't just write code — they ship it to the world." — ETHJKT Wisdom

Save kedua URLs lo. Lo akan butuh mereka buat capstone dan Demo Day! 🚀

---

*Next up: Persiapan Demo Day dan Portfolio. Almost there, Arcane apprentice!*
