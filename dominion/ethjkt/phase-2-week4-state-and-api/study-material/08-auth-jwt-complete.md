# 08 — Auth JWT Complete: Dari Register Sampe Auto-Logout

> *"Lo masuk mall. Security kasih lo visitor badge (access token). Badge berlaku 15 menit. Mau perpanjang? Tunjukin KTP (refresh token) ke meja info. KTP dipake sekali buat dapet badge baru + KTP baru (rotation). Kalau KTP expired? Balik ke pintu masuk, daftar ulang (login). Ini persis cara JWT auth bekerja."*

## 🎯 Yang Bakal Lo Pelajarin

- JWT anatomy — apa isinya
- Register → Login → Store Token flow
- localStorage vs httpOnly Cookie (pros/cons REAL)
- Axios interceptor auto-attach token
- Protected routes (preview — detail di chapter 09)
- Refresh token rotation
- Auto-logout on expiry
- Build: Complete auth system (backend + frontend)

## 🔬 JWT Anatomy

JWT (JSON Web Token) itu string yang terdiri dari 3 bagian:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzA4MDAwMDAwfQ.abc123signature
|___ Header ___|.___________ Payload _______________|.___ Signature ___|
```

**Header:** Algorithm info
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload:** Data (claims). JANGAN taruh password/sensitif di sini — bisa di-decode!
```json
{
  "userId": "1",
  "role": "admin",
  "email": "budi@eth.jkt",
  "exp": 1708000000,
  "iat": 1707999100
}
```

**Signature:** Proof bahwa token gak di-tamper. Butuh secret key buat verify.

⚠️ **PENTING:** JWT payload itu cuma base64 encoded, BUKAN encrypted. Siapapun bisa decode dan baca isinya. Jangan masukin data sensitif!

## 🏗️ Complete Auth Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB

    Note over User,DB: === REGISTER ===
    User->>Frontend: Isi form register
    Frontend->>Backend: POST /auth/register {name, email, password}
    Backend->>DB: Hash password, simpan user
    DB-->>Backend: User created
    Backend-->>Frontend: { user, accessToken, refreshToken }
    Frontend->>Frontend: Simpan tokens

    Note over User,DB: === LOGIN ===
    User->>Frontend: Isi form login
    Frontend->>Backend: POST /auth/login {email, password}
    Backend->>DB: Cari user, verify password
    DB-->>Backend: User found ✅
    Backend-->>Frontend: { user, accessToken (15m), refreshToken (7d) }
    Frontend->>Frontend: Simpan tokens

    Note over User,DB: === AUTHENTICATED REQUEST ===
    Frontend->>Backend: GET /api/users (Authorization: Bearer <accessToken>)
    Backend->>Backend: Verify JWT, check exp
    Backend-->>Frontend: 200 OK {data}

    Note over User,DB: === TOKEN EXPIRED ===
    Frontend->>Backend: GET /api/users (expired token)
    Backend-->>Frontend: 401 Unauthorized
    Frontend->>Backend: POST /auth/refresh {refreshToken}
    Backend->>DB: Verify refresh token, create new pair
    Backend-->>Frontend: { newAccessToken, newRefreshToken }
    Frontend->>Frontend: Update stored tokens
    Frontend->>Backend: RETRY original request with new token
    Backend-->>Frontend: 200 OK {data} ✅
```

## 🔐 Token Storage: localStorage vs httpOnly Cookie

Ini debat yang PANAS di dunia web dev. Gue kasih pros/cons yang jujur:

### localStorage

```tsx
// Simpan
localStorage.setItem('access_token', token);

// Ambil
const token = localStorage.getItem('access_token');

// Hapus
localStorage.removeItem('access_token');
```

| Pros | Cons |
|---|---|
| ✅ Simple, JavaScript bisa akses | ❌ Vulnerable XSS (script jahat bisa baca) |
| ✅ Gampang buat SPA | ❌ Gak auto-attach ke request |
| ✅ Gak dikirim otomatis ke server | ❌ Lo harus manage sendiri |
| ✅ Works cross-origin | |

### httpOnly Cookie

```tsx
// Backend SET cookie (client gak bisa akses via JS)
res.cookie('access_token', token, {
  httpOnly: true,      // JavaScript GAK BISA baca
  secure: true,        // HTTPS only
  sameSite: 'strict',  // Anti CSRF
  maxAge: 15 * 60 * 1000, // 15 menit
});
```

| Pros | Cons |
|---|---|
| ✅ JavaScript GAK BISA baca (anti XSS) | ❌ Complex CORS setup |
| ✅ Auto-attach ke setiap request | ❌ Vulnerable CSRF (mitigated by sameSite) |
| ✅ Browser manage lifecycle | ❌ Gak works cross-origin tanpa config |
| ✅ Industry standard buat production | ❌ Server harus handle cookie |

### Rekomendasi Gue

| Situation | Use |
|---|---|
| Learning / prototype | localStorage (simple) |
| Production SPA + same-domain API | httpOnly cookie |
| Production SPA + different-domain API | localStorage + short expiry + refresh rotation |
| Mobile app (React Native) | Secure storage (bukan cookie/localStorage) |

**Buat course ini, kita pake localStorage karena lebih gampang buat belajar. Tapi di production, pertimbangin httpOnly cookie.**

## 🏗️ Build: Complete Auth Backend

```tsx
// server/auth.ts
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

const JWT_SECRET = 'ethjkt-super-secret-key-2025'; // ← di production pake env var!
const JWT_REFRESH_SECRET = 'ethjkt-refresh-secret-2025';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// In-memory database
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'user';
}

interface StoredRefreshToken {
  token: string;
  userId: string;
  expiresAt: Date;
}

const users: User[] = [];
let refreshTokens: StoredRefreshToken[] = [];

// ============ HELPERS ============
function generateTokens(user: User) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // Simpan refresh token di DB
  refreshTokens.push({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}

function sanitizeUser(user: User) {
  const { password, ...safe } = user;
  return safe;
}

// ============ MIDDLEWARE ============
export function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function roleMiddleware(...roles: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}

// ============ ROUTES ============

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: {
        ...(!name && { name: ['Name is required'] }),
        ...(!email && { email: ['Email is required'] }),
        ...(!password && { password: ['Password is required'] }),
      },
    });
  }

  // Check duplicate
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: users.length === 0 ? 'admin' : 'user', // first user = admin
  };

  users.push(user);
  const tokens = generateTokens(user);

  res.status(201).json({
    user: sanitizeUser(user),
    ...tokens,
  });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const tokens = generateTokens(user);

  res.json({
    user: sanitizeUser(user),
    ...tokens,
  });
});

// POST /auth/refresh — REFRESH TOKEN ROTATION
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  // Cari di stored tokens
  const storedIndex = refreshTokens.findIndex(t => t.token === refreshToken);
  if (storedIndex === -1) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    const user = users.find(u => u.id === decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 🔄 ROTATION: hapus token lama, bikin baru
    refreshTokens.splice(storedIndex, 1);
    const tokens = generateTokens(user);

    res.json({
      user: sanitizeUser(user),
      ...tokens,
    });
  } catch (err) {
    // Token invalid/expired — hapus dari store
    refreshTokens.splice(storedIndex, 1);
    return res.status(401).json({ message: 'Refresh token expired' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  
  // Hapus refresh token dari store
  refreshTokens = refreshTokens.filter(t => t.token !== refreshToken);
  
  res.json({ message: 'Logged out successfully' });
});

// GET /auth/me
router.get('/me', authMiddleware, (req, res) => {
  const decoded = (req as any).user;
  const user = users.find(u => u.id === decoded.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(sanitizeUser(user));
});

export default router;
```

### Server Entry Point

```tsx
// server/index.ts
import express from 'express';
import cors from 'cors';
import authRouter, { authMiddleware, roleMiddleware } from './auth';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ message: 'This is protected!', user: (req as any).user });
});

// Admin only route
app.get('/api/admin/users', authMiddleware, roleMiddleware('admin'), (req, res) => {
  res.json({ message: 'Admin area', role: (req as any).user.role });
});

app.listen(3001, () => console.log('🚀 Auth server on http://localhost:3001'));
```

### Install dependencies:

```bash
cd server
npm init -y
npm install express cors jsonwebtoken bcryptjs
npm install -D @types/express @types/cors @types/jsonwebtoken @types/bcryptjs tsx
npx tsx index.ts
```

## 🖥️ Build: Frontend Auth System

### Auth Store (Zustand)

```tsx
// src/stores/authStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true by default — check token on mount
  
  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isLoading: false,
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
```

### Auth Service (Axios)

```tsx
// src/services/authService.ts
import api from '../lib/api';
import { useAuthStore } from '../stores/authStore';

interface LoginDTO { email: string; password: string }
interface RegisterDTO { name: string; email: string; password: string }

interface AuthResponse {
  user: { id: string; name: string; email: string; role: 'admin' | 'user' };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    useAuthStore.getState().setUser(data.user);
    return data;
  },

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    useAuthStore.getState().setUser(data.user);
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      useAuthStore.getState().logout();
    }
  },

  async checkAuth(): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      useAuthStore.getState().setUser(null);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      useAuthStore.getState().setUser(data);
    } catch {
      useAuthStore.getState().setUser(null);
    }
  },
};
```

### Auth Pages

```tsx
// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', fontFamily: 'system-ui' }}>
      <h1>🔐 Login</h1>
      
      {error && (
        <div style={{ background: '#fee2e2', padding: 12, borderRadius: 8, color: '#dc2626', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: 12, fontSize: 16,
            background: '#3b82f6', color: '#fff', border: 'none',
            borderRadius: 8, cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: 16 }}>
        Belum punya akun? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
```

```tsx
// src/pages/RegisterPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(form);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', fontFamily: 'system-ui' }}>
      <h1>📝 Register</h1>
      
      {error && (
        <div style={{ background: '#fee2e2', padding: 12, borderRadius: 8, color: '#dc2626', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            style={{ display: 'block', width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            style={{ display: 'block', width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            minLength={6}
            style={{ display: 'block', width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: 12, fontSize: 16,
            background: '#22c55e', color: '#fff', border: 'none',
            borderRadius: 8, cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        Udah punya akun? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
```

### Auto-Logout on Token Expiry

```tsx
// src/hooks/useAutoLogout.ts
import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';

function parseJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // convert to ms
  } catch {
    return null;
  }
}

export function useAutoLogout() {
  const logout = useAuthStore(state => state.logout);

  const scheduleLogout = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const expMs = parseJwtExp(token);
    if (!expMs) return;

    const timeUntilExpiry = expMs - Date.now();

    if (timeUntilExpiry <= 0) {
      logout();
      return;
    }

    // Set timer buat auto-logout 30 detik sebelum expiry
    const warningTime = Math.max(timeUntilExpiry - 30000, 0);
    const timer = setTimeout(() => {
      // Coba refresh dulu sebelum logout
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // Refresh akan di-handle oleh interceptor
        // Kalau gagal, interceptor redirect ke /login
        console.log('⏰ Token expiring soon, refresh will handle it');
      } else {
        logout();
      }
    }, warningTime);

    return () => clearTimeout(timer);
  }, [logout]);

  useEffect(() => {
    return scheduleLogout();
  }, [scheduleLogout]);
}
```

### App with Auth Check on Mount

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { authService } from './services/authService';
import { useAutoLogout } from './hooks/useAutoLogout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  useAutoLogout();

  // Check auth on mount
  useEffect(() => {
    authService.checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>🔄 Checking authentication...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
      } />
      <Route path="/dashboard" element={
        isAuthenticated ? (
          <div style={{ padding: 20 }}>
            <h1>🎉 Dashboard</h1>
            <p>Welcome, {user?.name}! (Role: {user?.role})</p>
            <button onClick={() => authService.logout()}>Logout</button>
          </div>
        ) : <Navigate to="/login" />
      } />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
```

## 🔄 Refresh Token Rotation — Kenapa Penting?

```mermaid
sequenceDiagram
    participant Attacker
    participant Client
    participant Server

    Note over Client,Server: Normal flow
    Client->>Server: POST /refresh {token_A}
    Server->>Server: Invalidate token_A<br/>Generate token_B
    Server-->>Client: {accessToken, refreshToken: token_B}

    Note over Attacker,Server: Attacker steals token_A
    Attacker->>Server: POST /refresh {token_A}
    Server-->>Attacker: ❌ 401 (token_A already used!)
    Note over Server: ALERT: Token reuse detected!<br/>Invalidate ALL tokens for this user
    
    Note over Client: Next request also fails<br/>User must re-login
    Note over Client,Server: This is GOOD — we detected the theft!
```

**Kenapa rotation penting:**
1. Refresh token cuma bisa dipake SEKALI
2. Kalau attacker curi dan pake → server detect reuse → invalidate semua
3. Worst case: user harus login ulang (bukan account compromised)

## 🗺️ Navigasi

| Prev | Next |
|---|---|
| [07 — React Query Advanced](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/07-react-query-advanced.md) | [09 — Protected Routes](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/09-protected-routes.md) |
