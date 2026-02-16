# 🧪 Testing Fundamentals

## ETHJKT Phase 2 — Week 5: Fullstack Capstone

> "Code without tests is broken by design." — Jacob Kaplan-Moss
>
> Lo nggak akan deploy kode ke production tanpa testing. Titik. Minggu ini kita belajar kenapa testing penting, dan gimana ngelakuinnya.

---

## 🎯 Kenapa Harus Testing?

### Cerita Horror Tanpa Testing:

Lo push code jam 11 malam. "Ah kayaknya bener." Deploy ke production. Tidur. Bangun pagi, Slack penuh: "App-nya error!" Ternyata lo nggak sengaja break fitur login karena refactor function yang dipake di mana-mana.

**Kalau ada test**, test bakal gagal **sebelum** code sampai ke production. Lo fix di local, push lagi, aman.

### Alasan Testing Penting:

1. **Catch bugs early** — Lebih murah fix bug di development daripada di production
2. **Confidence to refactor** — Lo bisa ubah code tanpa takut break yang lain
3. **Documentation** — Tests menjelaskan *apa yang seharusnya terjadi*
4. **Professional standard** — Company mana pun expect developers bisa nulis test

---

## 🔺 Testing Pyramid

```
        /\
       /  \      E2E Tests (sedikit)
      /    \     — Full user flow di browser
     /------\
    /        \   Integration Tests (sedang)
   /          \  — Multiple units working together
  /------------\
 /              \ Unit Tests (banyak)
/                \— Single function/component
──────────────────
```

| Level | Apa yang di-test | Speed | Jumlah |
|-------|-----------------|-------|--------|
| **Unit** | Satu function atau component | ⚡ Fast | Banyak |
| **Integration** | Beberapa unit kerja bareng | 🔄 Medium | Sedang |
| **E2E** | Full user flow (browser) | 🐌 Slow | Sedikit |

**Buat capstone**, fokus ke **unit + integration tests**. E2E itu nice-to-have.

---

## 🔧 Setup Vitest

Vitest itu test runner yang **native support Vite**. Cepet, modern, dan API-nya mirip Jest.

### Install:

```bash
# Di client/ folder
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Di server/ folder
npm install -D vitest
```

### Config — Frontend:

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
    css: true,
  },
});
```

```typescript
// client/src/test/setup.ts
import '@testing-library/jest-dom';
```

```json
// client/tsconfig.json — tambah di compilerOptions
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### Config — Backend:

```typescript
// server/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

### Package.json scripts:

```json
// client/package.json & server/package.json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 📝 Unit Tests — Utility Functions

Unit test = test **satu function** secara isolated.

### Contoh: Test utility functions

```typescript
// client/src/utils/formatDate.ts
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(dateStr);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
```

```typescript
// client/src/utils/__tests__/formatDate.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatDate, timeAgo, truncate } from '../formatDate';

describe('formatDate', () => {
  it('should format date in Indonesian locale', () => {
    const result = formatDate('2026-02-16T10:00:00Z');
    expect(result).toContain('2026');
    expect(result).toContain('16');
  });

  it('should handle invalid date gracefully', () => {
    const result = formatDate('invalid');
    expect(result).toBe('Invalid Date');
  });
});

describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-16T12:00:00Z'));
  });

  it('should return "baru saja" for < 1 minute ago', () => {
    expect(timeAgo('2026-02-16T11:59:30Z')).toBe('baru saja');
  });

  it('should return minutes for < 1 hour', () => {
    expect(timeAgo('2026-02-16T11:30:00Z')).toBe('30 menit lalu');
  });

  it('should return hours for < 24 hours', () => {
    expect(timeAgo('2026-02-16T07:00:00Z')).toBe('5 jam lalu');
  });

  it('should return days for < 7 days', () => {
    expect(timeAgo('2026-02-14T12:00:00Z')).toBe('2 hari lalu');
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});

describe('truncate', () => {
  it('should return original string if shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('should truncate and add ... if longer', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
  });

  it('should handle exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('should handle empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});
```

### Run tests:

```bash
cd client
npm test
# atau untuk run sekali (CI mode):
npm run test:run
```

---

## 🧩 Unit Tests — Backend

```typescript
// server/src/utils/validation.ts
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Minimum 8 karakter');
  if (!/[A-Z]/.test(password)) errors.push('Harus ada huruf besar');
  if (!/[0-9]/.test(password)) errors.push('Harus ada angka');
  return { valid: errors.length === 0, errors };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
```

```typescript
// server/src/utils/__tests__/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, sanitizeInput } from '../validation';

describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('wizard@ethjkt.id')).toBe(true);
  });

  it('should reject email without @', () => {
    expect(validateEmail('wizard-ethjkt.id')).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(validateEmail('wizard@')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should accept valid password', () => {
    const result = validatePassword('Arcane123');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject short password', () => {
    const result = validatePassword('Ab1');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Minimum 8 karakter');
  });

  it('should reject password without uppercase', () => {
    const result = validatePassword('arcane123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Harus ada huruf besar');
  });

  it('should reject password without number', () => {
    const result = validatePassword('ArcaneSpell');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Harus ada angka');
  });

  it('should return multiple errors', () => {
    const result = validatePassword('abc');
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe('sanitizeInput', () => {
  it('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('should remove angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
  });

  it('should handle normal input', () => {
    expect(sanitizeInput('Arcane Notes')).toBe('Arcane Notes');
  });
});
```

---

## ⚛️ Component Tests — React Testing Library

React Testing Library (RTL) bikin lo test components **seperti cara user berinteraksi** — bukan test implementation details.

### Prinsip RTL:

> "The more your tests resemble the way your software is used, the more confidence they can give you."

**DO:** Test apa yang user lihat dan lakukan (click button, type text, see result)
**DON'T:** Test state internal, class names, atau implementation details

### Contoh: Test NoteCard Component

```tsx
// client/src/components/NoteCard.tsx
interface NoteCardProps {
  title: string;
  content: string;
  createdAt: string;
  onDelete: () => void;
}

export function NoteCard({ title, content, createdAt, onDelete }: NoteCardProps) {
  return (
    <div className="note-card" role="article">
      <div className="note-header">
        <h3>{title}</h3>
        <button onClick={onDelete} aria-label="Hapus note">
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

describe('NoteCard', () => {
  const defaultProps = {
    title: 'Test Note',
    content: 'This is a test note',
    createdAt: '2026-02-16T10:00:00Z',
    onDelete: vi.fn(),
  };

  it('should render title and content', () => {
    render(<NoteCard {...defaultProps} />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('This is a test note')).toBeInTheDocument();
  });

  it('should not render content paragraph if content is empty', () => {
    render(<NoteCard {...defaultProps} content="" />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<NoteCard {...defaultProps} onDelete={onDelete} />);
    
    const deleteBtn = screen.getByLabelText('Hapus note');
    await userEvent.click(deleteBtn);
    
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('should display formatted date', () => {
    render(<NoteCard {...defaultProps} />);
    
    // Check that some date is rendered (format depends on locale)
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
```

---

## 🌐 Testing Async Code & API Mocking

### Mock API calls dengan vi.mock:

```tsx
// client/src/components/__tests__/NotesList.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { api } from '../../api';

// Mock the api module
vi.mock('../../api', () => ({
  api: {
    getNotes: vi.fn(),
    createNote: vi.fn(),
    deleteNote: vi.fn(),
  },
}));

const mockNotes = [
  { id: 1, title: 'Note 1', content: 'Content 1', created_at: '2026-02-16T10:00:00Z' },
  { id: 2, title: 'Note 2', content: 'Content 2', created_at: '2026-02-15T10:00:00Z' },
];

describe('App - Notes List', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display notes after loading', async () => {
    vi.mocked(api.getNotes).mockResolvedValue(mockNotes);
    
    render(<App />);
    
    // Should show loading first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Then show notes
    await waitFor(() => {
      expect(screen.getByText('Note 1')).toBeInTheDocument();
      expect(screen.getByText('Note 2')).toBeInTheDocument();
    });
  });

  it('should show empty state when no notes', async () => {
    vi.mocked(api.getNotes).mockResolvedValue([]);
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/belum ada notes/i)).toBeInTheDocument();
    });
  });

  it('should show error when API fails', async () => {
    vi.mocked(api.getNotes).mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/gagal/i)).toBeInTheDocument();
    });
  });

  it('should create a new note', async () => {
    vi.mocked(api.getNotes).mockResolvedValue([]);
    vi.mocked(api.createNote).mockResolvedValue({
      id: 3,
      title: 'New Note',
      content: 'New content',
      created_at: '2026-02-16T12:00:00Z',
    });

    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/belum ada notes/i)).toBeInTheDocument();
    });

    // Fill form
    const titleInput = screen.getByPlaceholderText(/judul/i);
    const contentInput = screen.getByPlaceholderText(/isi/i);
    const submitBtn = screen.getByText(/tambah/i);

    await userEvent.type(titleInput, 'New Note');
    await userEvent.type(contentInput, 'New content');
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.createNote).toHaveBeenCalledWith('New Note', 'New content');
      expect(screen.getByText('New Note')).toBeInTheDocument();
    });
  });
});
```

---

## 🔑 Testing Patterns Cheatsheet

### Common Matchers:

```typescript
// Equality
expect(value).toBe(42);              // Strict equality
expect(obj).toEqual({ a: 1 });       // Deep equality

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThanOrEqual(10);

// Strings
expect(str).toContain('hello');
expect(str).toMatch(/pattern/);

// Arrays
expect(arr).toHaveLength(3);
expect(arr).toContain('item');

// DOM (with jest-dom)
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('hello');
expect(element).toBeDisabled();
expect(input).toHaveValue('text');
```

### Mocking:

```typescript
// Mock function
const mockFn = vi.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: 'async' });

// Check calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(1);

// Mock module
vi.mock('./module', () => ({
  myFunction: vi.fn().mockReturnValue('mocked'),
}));

// Spy on existing function
const spy = vi.spyOn(console, 'log');
// ... do stuff
expect(spy).toHaveBeenCalledWith('expected log');
spy.mockRestore();
```

### Async testing:

```typescript
// waitFor — polls until assertion passes
await waitFor(() => {
  expect(screen.getByText('Loaded!')).toBeInTheDocument();
});

// findBy — built-in waitFor
const element = await screen.findByText('Loaded!');
expect(element).toBeInTheDocument();
```

---

## 🏋️ Latihan

### Exercise 1: Unit Tests
1. Tulis 3 utility functions buat capstone lo (contoh: validation, formatting, calculation)
2. Tulis minimal **5 unit tests** buat function-function itu
3. Run `npm run test:run` — pastiin semua pass ✅

### Exercise 2: Component Tests
1. Buat satu reusable component (Button, Card, atau Modal)
2. Tulis **3 test** buat component itu:
   - Render with default props
   - Render with different props
   - User interaction (click, type)
3. Run tests — pastiin pass ✅

### Exercise 3: Async & Mock Tests
1. Buat component yang fetch data dari API
2. Mock API call-nya
3. Test: loading state, success state, error state
4. Minimal **3 tests** ✅

---

## 🔑 Key Takeaways

- **Testing pyramid** — Banyak unit tests, sedikit E2E tests
- **Vitest** — Fast, modern, Vite-native test runner
- **React Testing Library** — Test seperti cara user pakai app, bukan implementation details
- **Mocking** — Isolasi unit yang di-test dari dependencies external
- **Async testing** — Pakai `waitFor` atau `findBy` buat handle async operations
- **vi.fn()** — Best friend lo buat mock functions

> 🧙‍♂️ "Tests itu bukan beban — itu armor lo sebelum deploy ke production battlefield." — ETHJKT Wisdom

Write tests, sleep better. Capstone yang punya tests = capstone yang siap demo day! 💪
