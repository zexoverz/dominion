# 🌐 React Context Deep Dive

> *"Context itu kayak WiFi rumah — semua device bisa konek tanpa perlu kabel satu-satu."*

## Kenapa Context?

Di materi sebelumnya kita udah bahas masalah **props drilling**. Context adalah solusi bawaan React untuk masalah itu. Nggak perlu install library tambahan — udah built-in.

## Cara Kerja Context

Context punya 3 bagian utama:

1. **`createContext()`** — Bikin context-nya
2. **`Provider`** — Sediakan data ke tree di bawahnya
3. **`useContext()`** — Ambil data dari context terdekat

```
    App (Provider: value={data})
     |
   Layout          ← nggak perlu tau soal data
     |
   Header          ← nggak perlu tau soal data
     |
   UserMenu        ← useContext() → langsung dapet data!
```

## Step by Step: Bikin Context

### Step 1: Create Context

```jsx
// contexts/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

// Bikin context dengan default value
const AuthContext = createContext(null);
```

### Step 2: Bikin Provider Component

```jsx
// contexts/AuthContext.jsx (lanjutan)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Step 3: Custom Hook (Best Practice!)

```jsx
// contexts/AuthContext.jsx (lanjutan)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipake di dalam AuthProvider!');
  }
  return context;
}
```

Kenapa bikin custom hook?
- **Error handling** — Langsung ketahuan kalau lupa wrap Provider
- **Autocomplete** — IDE bisa suggest properties
- **Encapsulation** — Consumer nggak perlu tau internal context

### Step 4: Wrap App dengan Provider

```jsx
// App.jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

### Step 5: Consume di Component Manapun

```jsx
// components/Navbar.jsx
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      <Logo />
      {isAuthenticated ? (
        <>
          <span>Halo, {user.name}!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
```

## Multiple Contexts

Bisa dong punya lebih dari satu context! Bahkan **disarankan** untuk split per concern.

```jsx
// contexts/ThemeContext.jsx
const ThemeContext = createContext('light');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

```jsx
// contexts/NotificationContext.jsx
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
```

### Nesting Providers

```jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

Urutan nesting penting! Provider yang di luar bisa diakses oleh yang di dalam, tapi nggak sebaliknya. Biasanya Auth paling luar karena theme/notification mungkin butuh auth info.

### Anti-Pattern: Provider Hell

```jsx
// 😱 Jangan sampe kayak gini
<AuthProvider>
  <ThemeProvider>
    <NotificationProvider>
      <CartProvider>
        <ModalProvider>
          <ToastProvider>
            <SidebarProvider>
              <App />
            </SidebarProvider>
          </ToastProvider>
        </ModalProvider>
      </CartProvider>
    </NotificationProvider>
  </ThemeProvider>
</AuthProvider>
```

Kalau udah kayak gini, saatnya pakai Zustand untuk beberapa di antaranya! Atau bikin helper:

```jsx
function composeProviders(...providers) {
  return ({ children }) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
}

const AllProviders = composeProviders(
  AuthProvider,
  ThemeProvider,
  NotificationProvider
);

// Clean!
<AllProviders>
  <App />
</AllProviders>
```

## ⚠️ Performance Pitfall: Re-render Semua Consumer!

Ini bagian PALING PENTING yang banyak developer nggak tau. **Ketika value di Provider berubah, SEMUA component yang pake `useContext` untuk context itu akan re-render.** Even kalau mereka cuma pake sebagian data.

```jsx
// ❌ MASALAH: Satu context gede
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Setiap kali APAPUN berubah, SEMUA consumer re-render!
  return (
    <AppContext.Provider value={{
      user, setUser,
      theme, setTheme,
      cart, setCart,
      notifications, setNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ThemeToggle re-render ketika CART berubah! 😱
function ThemeToggle() {
  const { theme, setTheme } = useContext(AppContext);
  console.log('ThemeToggle re-rendered!'); // Keprint tiap cart update
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>🌙</button>;
}
```

### Solusi 1: Split Context Per Concern

```jsx
// ✅ SPLIT: Setiap concern punya context sendiri
const ThemeContext = createContext();
const CartContext = createContext();
const AuthContext = createContext();

// ThemeToggle CUMA re-render ketika theme berubah
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>🌙</button>;
}
```

### Solusi 2: Pisah State dan Dispatch Context

```jsx
// ✅ Pisah read dan write
const CountStateContext = createContext();
const CountDispatchContext = createContext();

function CountProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <CountStateContext.Provider value={count}>
      <CountDispatchContext.Provider value={setCount}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}

// Component yang cuma NULIS nggak re-render ketika count berubah!
function IncrementButton() {
  const setCount = useContext(CountDispatchContext);
  console.log('IncrementButton rendered'); // Cuma render sekali!
  return <button onClick={() => setCount(c => c + 1)}>+1</button>;
}

// Component yang BACA count re-render sesuai expectations
function CountDisplay() {
  const count = useContext(CountStateContext);
  return <span>{count}</span>;
}
```

### Solusi 3: Memoize Provider Value

```jsx
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ useMemo biar object reference stabil
  const value = useMemo(() => ({
    user,
    login: async (email, pw) => { /* ... */ },
    logout: () => setUser(null),
    isAuthenticated: !!user,
  }), [user]); // Cuma bikin object baru kalau user berubah

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

Tanpa `useMemo`, setiap kali `AuthProvider` re-render (misalnya parent-nya re-render), dia bikin object `value` baru → semua consumer ikut re-render meskipun data-nya sama!

## Context vs Zustand — Kapan Pake Apa?

| Kriteria | Context | Zustand |
|----------|---------|---------|
| Bundle size | 0 (built-in) | ~1KB |
| Setup | Lumayan (Provider, custom hook) | Minimal |
| Performance | ⚠️ Re-render semua consumer | ✅ Selector-based, granular |
| DevTools | ❌ Nggak ada | ✅ Redux DevTools |
| Persist | Manual (localStorage) | ✅ Built-in middleware |
| Learning curve | Rendah | Rendah |
| Async | Manual | Built-in support |

### Pake Context Kalau:
- Data **jarang berubah** (theme, locale, auth status)
- **Sedikit consumer** yang butuh
- Nggak mau nambah dependency
- Simple value passing (nggak butuh complex logic)

### Pake Zustand Kalau:
- Data **sering berubah** (cart items, form state, real-time data)
- **Banyak consumer** dan butuh granular re-render
- Butuh **persistence** (save ke localStorage)
- Butuh **devtools** untuk debugging
- State logic complex (async, derived state)

## Real-world Pattern: Auth Context

Ini pattern yang sering dipake di production:

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check token on mount
  useEffect(() => {
    if (token) {
      fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, token, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Protected Route dengan Context

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 🏋️ Latihan

### Exercise 1: Theme Context
Bikin `ThemeContext` yang support:
- Toggle dark/light mode
- Persist ke localStorage
- Custom hook `useTheme()`
- Wrap seluruh app

### Exercise 2: Language Context
Bikin `LanguageContext` untuk i18n sederhana:
- Support 'id' (Indonesia) dan 'en' (English)
- Object translations: `{ greeting: { id: 'Halo', en: 'Hello' } }`
- Hook `useTranslation()` yang return function `t('greeting')`

### Exercise 3: Performance Audit
Ambil kode "satu context gede" di atas. Split jadi beberapa context yang proper. Tambahin `console.log` di setiap consumer dan buktikan bahwa re-render berkurang.

### Exercise 4: Notification System
Bikin notification context yang bisa:
- `addNotification(message, type)` — type: success/error/warning/info
- Auto-dismiss setelah 5 detik
- Stack notifications (bisa multiple)
- Render toast di corner layar

---

> 💡 **Golden rule:** Context itu bagus untuk data yang **jarang berubah** dan dibaca **banyak component**. Untuk state yang sering update, pertimbangkan Zustand. Jangan pake palu buat semua masalah — pilih tool yang tepat!

**Next:** Zustand — state management yang ringan tapi powerful! 🐻
