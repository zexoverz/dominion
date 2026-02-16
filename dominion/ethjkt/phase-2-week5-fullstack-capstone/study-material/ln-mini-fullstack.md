# ⚔️ ARCANE QUEST: Mini Fullstack App

## ETHJKT Phase 2 — Week 5: Fullstack Capstone

> 🧙‍♂️ **Quest Objective:** Build a complete Notes App (React + Express + PostgreSQL) dalam 3 jam. Ini latihan sebelum capstone — practice the full flow end-to-end.

---

## 🗺️ Quest Overview

| Item | Detail |
|------|--------|
| **App** | Arcane Notes — Simple notes app |
| **Frontend** | React + Vite + TypeScript |
| **Backend** | Express + TypeScript |
| **Database** | PostgreSQL |
| **Time** | ~3 jam |
| **Goal** | Practice full flow: setup → build → connect → run |

### Yang Akan Lo Build:

```
[React Frontend] ←→ [Express API] ←→ [PostgreSQL]
    Port 5173           Port 3001        Port 5432
```

Features:
- ✅ Create note
- ✅ List all notes
- ✅ Delete note
- ✅ Simple & clean UI

No auth — kita fokus ke **full flow**, bukan complexity.

---

## ⏱️ Hour 1: Backend Setup

### Step 1: Project Structure

```bash
# Buat project folder
mkdir arcane-notes && cd arcane-notes

# Initialize root
npm init -y

# Buat folder structure
mkdir -p server/src
mkdir -p client
```

### Step 2: Setup Backend

```bash
cd server
npm init -y

# Install dependencies
npm install express cors dotenv pg
npm install -D typescript @types/express @types/cors @types/node @types/pg tsx

# Create tsconfig
npx tsc --init
```

Edit `server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

Edit `server/package.json` — tambah scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Step 3: Database Setup

Pastikan PostgreSQL jalan. Buat database:

```bash
# Via psql
psql -U postgres

CREATE DATABASE arcane_notes;
\c arcane_notes

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO notes (title, content) VALUES
  ('Welcome', 'Selamat datang di Arcane Notes! 🧙‍♂️'),
  ('Todo', 'Build capstone project minggu ini');

\q
```

### Step 4: Environment Variables

```bash
# server/.env
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/arcane_notes
CLIENT_URL=http://localhost:5173
```

### Step 5: Backend Code

**Database connection:**

```typescript
// server/src/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log('📦 Database connected'))
  .catch((err) => console.error('❌ Database error:', err.message));

export default pool;
```

**Express app:**

```typescript
// server/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET all notes
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notes ORDER BY created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notes' });
  }
});

// POST create note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title.trim(), content || '']
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ success: false, error: 'Failed to create note' });
  }
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, error: 'Failed to delete note' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### Step 6: Test Backend

```bash
# Start server
cd server
npm run dev

# Test di terminal lain:
curl http://localhost:3001/api/health
curl http://localhost:3001/api/notes
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Hello from curl!"}'
```

Kalau semua response-nya bener, backend lo ✅ done!

---

## ⏱️ Hour 2: Frontend Setup

### Step 7: Create React App

```bash
# Dari root folder (arcane-notes/)
npm create vite@latest client -- --template react-ts
cd client
npm install
npm install axios
```

### Step 8: Frontend Code

**API service:**

```typescript
// client/src/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export const api = {
  getNotes: async (): Promise<Note[]> => {
    const { data } = await axios.get(`${API_URL}/notes`);
    return data.data;
  },

  createNote: async (title: string, content: string): Promise<Note> => {
    const { data } = await axios.post(`${API_URL}/notes`, { title, content });
    return data.data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/notes/${id}`);
  },
};
```

**Main App component:**

```tsx
// client/src/App.tsx
import { useState, useEffect } from 'react';
import { api, Note } from './api';
import './App.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await api.getNotes();
      setNotes(data);
    } catch (err) {
      setError('Gagal fetch notes. Pastikan backend jalan!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newNote = await api.createNote(title, content);
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Gagal buat note baru');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin mau hapus note ini?')) return;

    try {
      await api.deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      setError('Gagal hapus note');
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app">
      <header>
        <h1>🧙‍♂️ Arcane Notes</h1>
        <p>ETHJKT Phase 2 — Mini Fullstack Quest</p>
      </header>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          placeholder="Judul note..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Isi note (optional)..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button type="submit">✨ Tambah Note</button>
      </form>

      {loading ? (
        <p className="loading">Loading notes... ⏳</p>
      ) : notes.length === 0 ? (
        <p className="empty">Belum ada notes. Buat yang pertama! 📝</p>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
              {note.content && <p>{note.content}</p>}
              <small>{formatDate(note.created_at)}</small>
            </div>
          ))}
        </div>
      )}

      <footer>
        <p>Built with ⚡ by ETHJKT Apprentice</p>
      </footer>
    </div>
  );
}

export default App;
```

### Step 9: Styling

```css
/* client/src/App.css */
:root {
  --bg: #0f0f1a;
  --card: #1a1a2e;
  --accent: #7c3aed;
  --accent-hover: #6d28d9;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --danger: #ef4444;
  --border: #2d2d44;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, sans-serif;
}

.app {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2rem;
  background: linear-gradient(135deg, #7c3aed, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

header p {
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.error {
  background: #ef444422;
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error button {
  background: none;
  border: none;
  color: var(--danger);
  cursor: pointer;
  font-size: 1.2rem;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.note-form input,
.note-form textarea {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.note-form input:focus,
.note-form textarea:focus {
  border-color: var(--accent);
}

.note-form button {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.note-form button:hover {
  background: var(--accent-hover);
}

.loading, .empty {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem 0;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  transition: border-color 0.2s;
}

.note-card:hover {
  border-color: var(--accent);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.note-header h3 {
  font-size: 1.1rem;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

.note-card p {
  color: var(--text-muted);
  margin: 0.5rem 0;
  line-height: 1.5;
}

.note-card small {
  color: var(--text-muted);
  font-size: 0.8rem;
}

footer {
  text-align: center;
  margin-top: 3rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}
```

### Step 10: Test Frontend

```bash
# Dari client/
npm run dev
```

Buka `http://localhost:5173`. Lo harusnya bisa:
1. ✅ Lihat notes dari database
2. ✅ Tambah note baru
3. ✅ Hapus note

---

## ⏱️ Hour 3: Polish & Connect Everything

### Step 11: Root Package.json

```bash
# Dari root (arcane-notes/)
npm install -D concurrently
```

Edit root `package.json`:

```json
{
  "name": "arcane-notes",
  "private": true,
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

Sekarang cukup `npm run dev` dari root, kedua server jalan! 🎉

### Step 12: Tambah .gitignore

```bash
# .gitignore (root)
node_modules/
dist/
.env
*.env.local
```

### Step 13: Git Init & First Commit

```bash
git init
git add .
git commit -m "🧙‍♂️ Arcane Notes: initial fullstack setup"
```

### Step 14: Tambah Error Boundary (Bonus)

```typescript
// server/src/index.ts — tambah di paling bawah sebelum app.listen

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});
```

---

## ✅ Quest Completion Checklist

Pastiin semua ini ✅ sebelum lanjut:

- [ ] PostgreSQL database `arcane_notes` exists dengan tabel `notes`
- [ ] Backend jalan di `localhost:3001`
- [ ] `GET /api/notes` return list of notes
- [ ] `POST /api/notes` bisa create note baru
- [ ] `DELETE /api/notes/:id` bisa hapus note
- [ ] Frontend jalan di `localhost:5173`
- [ ] Frontend bisa display notes dari backend
- [ ] Frontend bisa tambah note baru (form works)
- [ ] Frontend bisa hapus note (with confirmation)
- [ ] Error states handled (loading, empty, error)
- [ ] Git repo initialized dengan first commit

---

## 🐛 Troubleshooting

### "CORS error" di browser console
→ Pastiin `CLIENT_URL` di `.env` match dengan frontend URL (`http://localhost:5173`)

### "Connection refused" ke PostgreSQL
→ Pastiin PostgreSQL service jalan: `sudo service postgresql status`
→ Check `DATABASE_URL` di `.env`

### "Cannot find module" error
→ Run `npm install` di folder yang error (server/ atau client/)

### Frontend nggak connect ke backend
→ Check `API_URL` di `client/src/api.ts` — harus `http://localhost:3001/api`
→ Pastiin backend udah jalan dulu sebelum buka frontend

---

## 🏋️ Bonus Challenges

Kalau selesai kurang dari 3 jam, coba tambahin:

1. **Edit note** — Tambah PUT endpoint + edit form di frontend
2. **Search** — Filter notes by title
3. **Character count** — Show berapa karakter di content
4. **Keyboard shortcut** — Ctrl+Enter buat submit form
5. **Timestamp relative** — "2 jam yang lalu" instead of tanggal

---

## 🔑 Key Takeaways

- **Fullstack flow:** Frontend → API call → Backend → Database → Response → Update UI
- **Start with backend** — Easier to test with curl before building UI
- **CORS** — Frontend dan backend di port berbeda butuh CORS config
- **Error handling** — Selalu handle errors di kedua sisi (FE + BE)
- **Environment variables** — Jangan hardcode URLs dan secrets

> 🧙‍♂️ **Quest Complete!** Lo baru aja build fullstack app end-to-end. Skill ini yang akan lo pakai buat capstone. The Arcane path continues... ⚔️

---

*App ini akan kita pakai lagi di quest berikutnya: Deploy & Test. Jangan hapus!*
