# 🔐 Authentication Flows: JWT + Login/Register

> *"Auth itu kayak security system di gedung — kalau kamu nggak punya badge yang valid, nggak bisa masuk."*

## Bagaimana Auth Bekerja?

### Flow Lengkap

```
1. User REGISTER → Server bikin account → Return success
2. User LOGIN (email + password) → Server verify → Return JWT token
3. Client SIMPAN token (localStorage/memory)
4. Setiap request → ATTACH token di header Authorization
5. Server VERIFY token → Kasih akses / tolak
6. Token EXPIRED → Refresh token / redirect ke login
7. User LOGOUT → Hapus token dari client
```

### Apa itu JWT (JSON Web Token)?

JWT itu string panjang yang berisi informasi user, di-encode dan di-sign oleh server:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImV4cCI6MTcwOTI4MDAwMH0.abc123signature
```

Terdiri dari 3 bagian (dipisah titik):
1. **Header** — Algorithm yang dipake
2. **Payload** — Data user (userId, role, expiration)
3. **Signature** — Verification bahwa token belum di-tamper

**PENTING:** JWT payload bisa di-decode siapapun. JANGAN taruh data sensitif (password, secrets) di dalamnya!

## Backend: Auth API (Express + JWT)

```js
// server/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const JWT_EXPIRES = '1h';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret456';
const REFRESH_EXPIRES = '7d';

// In-memory users (gunakan database di production!)
let users = [];
let refreshTokens = [];

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: 'user',
    };
    users.push(user);

    res.status(201).json({ message: 'Register berhasil', user: { id: user.id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Generate tokens
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES }
    );

    refreshTokens.push(refreshToken);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// REFRESH TOKEN
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token invalid' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const user = users.find(u => u.id === decoded.userId);

    const newToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: 'Refresh token expired' });
  }
});

// GET ME (protected)
router.get('/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

// LOGOUT
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter(t => t !== refreshToken);
  res.json({ message: 'Logged out' });
});

// Middleware: Verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

module.exports = { router, authenticateToken };
```

## Frontend: Full Auth Implementation

### 1. Auth Service

```jsx
// src/api/services/authService.js
import api from '../axios';

export const authService = {
  register: async ({ name, email, password }) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    // Simpan tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
```

### 2. Auth Context + React Query

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // Fetch current user (runs on mount if token exists)
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    enabled: !!localStorage.getItem('token'),
    retry: false, // Don't retry auth failures
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
  });

  // Logout
  const logout = useCallback(async () => {
    await authService.logout();
    queryClient.setQueryData(['auth', 'me'], null);
    queryClient.clear(); // Clear all cached data
  }, [queryClient]);

  const value = useMemo(() => ({
    user: user || null,
    isLoading,
    isAuthenticated: !!user && !isError,

    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,

    register: registerMutation.mutateAsync,
    registerError: registerMutation.error,
    isRegistering: registerMutation.isPending,

    logout,
  }), [user, isLoading, isError, loginMutation, registerMutation, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### 3. Login Page

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by loginError
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>⚔️ Login</h1>
        <p>Masuk ke Arcane Dashboard</p>

        {loginError && (
          <div className="error-banner">
            {loginError.response?.data?.message || 'Login gagal'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="wizard@ethjkt.id"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={isLoggingIn} className="btn-primary full-width">
            {isLoggingIn ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        <p className="auth-link">
          Belum punya akun? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
```

### 4. Register Page

```jsx
// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isRegistering, registerError } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Password tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password minimal 6 karakter');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/login', { state: { message: 'Register berhasil! Silakan login.' } });
    } catch (err) {
      // Error handled by registerError
    }
  };

  const error = validationError || registerError?.response?.data?.message;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>⚔️ Register</h1>
        <p>Bergabung dengan Arcane Dashboard</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          <button type="submit" disabled={isRegistering} className="btn-primary full-width">
            {isRegistering ? '⏳ Registering...' : '✨ Register'}
          </button>
        </form>

        <p className="auth-link">
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
```

### 5. Protected Route Component

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Masih loading auth state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Memverifikasi sesi...</p>
      </div>
    );
  }

  // Belum login → redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role (optional)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### 6. App Router

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin-only route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

### 7. Navbar with Auth

```jsx
// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">⚔️ Arcane</Link>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <span className="user-info">
              👤 {user.name} ({user.role})
            </span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

## Token Storage: Dimana Simpan?

| Metode | Pro | Kontra |
|--------|-----|--------|
| localStorage | Persist across tabs/refresh | Vulnerable XSS |
| sessionStorage | Per-tab isolation | Lost on tab close |
| Memory (state) | Most secure | Lost on refresh |
| HttpOnly Cookie | Immune to XSS | Needs backend setup, CSRF risk |

**Rekomendasi untuk learning:** localStorage OK. Untuk production, pertimbangkan HttpOnly cookies.

## Redirect After Login

```jsx
// LoginPage — redirect ke halaman sebelumnya
function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login(formData);
    // Redirect ke halaman yang dituju sebelum kena redirect ke login
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };
}
```

## 🏋️ Latihan

### Exercise 1: Basic Auth
Implementasikan login/register flow lengkap:
1. Backend Express dengan JWT
2. Frontend React dengan login/register pages
3. Protected dashboard route
4. Navbar yang berubah berdasarkan auth state

### Exercise 2: Role-based Access
Tambahkan role-based routing:
- User biasa → akses dashboard, profile
- Admin → akses dashboard, profile, admin panel
- Unauthorized page kalau akses route yang nggak boleh

### Exercise 3: Token Refresh
Implementasikan auto token refresh:
- Access token expire dalam 15 menit
- Refresh token expire dalam 7 hari
- Interceptor auto refresh kalau dapet 401

### Exercise 4: Remember Me
Tambahkan "Remember me" checkbox di login:
- Checked → simpan di localStorage (persist)
- Unchecked → simpan di sessionStorage (per session)

---

> 💡 **Security reminder:** Materi ini fokus ke flow dan implementation. Untuk production, pastikan: HTTPS, HttpOnly cookies, CSRF protection, rate limiting, password hashing (bcrypt), input validation, dan CORS yang proper.

**Next:** Environment variables & error handling! 🛡️
