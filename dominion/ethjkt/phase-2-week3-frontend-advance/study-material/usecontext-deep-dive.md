# 🌐 useContext Deep Dive

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Problem: Prop Drilling 😫

Pernah nggak kalian harus passing props melewati 5-6 level component tree? Itu namanya **prop drilling** dan itu painful banget:

```tsx
// Level 1
<App user={user}>
  // Level 2
  <Layout user={user}>
    // Level 3
    <Sidebar user={user}>
      // Level 4
      <UserMenu user={user}>
        // Level 5 — FINALLY uses it
        <Avatar name={user.name} />
```

`useContext` solve masalah ini dengan bikin data accessible di mana aja tanpa passing props manual.

---

## 🎨 Step-by-Step: Creating Context

### Step 1: Create Context

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

// 1. Define types
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// 2. Create context dengan default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
```

### Step 2: Create Provider

```tsx
// Masih di ThemeContext.tsx

// 3. Provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### Step 3: Create Custom Hook

```tsx
// Masih di ThemeContext.tsx

// 4. Custom hook untuk consume context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

**PENTING:** Always buat custom hook dan validate context! Kalau nggak, error-nya bakal cryptic banget.

### Step 4: Wrap App dengan Provider

```tsx
// src/main.tsx
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  )
}
```

### Step 5: Consume di Mana Aja!

```tsx
// Bisa di component manapun di dalam ThemeProvider
function Header() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className={`header-${theme}`}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  )
}

function Card({ title, content }: { title: string; content: string }) {
  const { theme } = useTheme()
  
  return (
    <div className={`card card-${theme}`}>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  )
}
```

---

## 🔐 Real World: Auth Context

Ini pattern yang kalian pasti pakai di hampir setiap project:

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsLoading(false)
          return
        }
        
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])
  
  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Login failed')
    }
    
    const { user, token } = await res.json()
    localStorage.setItem('token', token)
    setUser(user)
  }
  
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    localStorage.removeItem('token')
    setUser(null)
  }
  
  const register = async (data: RegisterData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!res.ok) throw new Error('Registration failed')
    
    const { user, token } = await res.json()
    localStorage.setItem('token', token)
    setUser(user)
  }
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### Protected Route Component

```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="loading">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Admin-Only Route

```tsx
function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/unauthorized" replace />
  
  return <>{children}</>
}
```

---

## ⚡ Avoiding Unnecessary Re-renders

Ini trap paling common dengan Context. Setiap kali context value berubah, **SEMUA consumer re-render**. Bahkan yang cuma pakai sebagian value!

### Problem

```tsx
// ❌ BAD — setiap kali theme ATAU user berubah, SEMUA consumer re-render
const AppContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  user: null,
  login: () => {},
  logout: () => {},
  notifications: [],
  addNotification: () => {},
})
```

### Solution 1: Split Contexts

```tsx
// ✅ GOOD — pisahkan context berdasarkan concern
<ThemeProvider>
  <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>
</ThemeProvider>
```

### Solution 2: Memoize Provider Value

```tsx
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [])
  
  // ✅ Memoize value object supaya referencenya stable
  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  )
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### Solution 3: Split State and Dispatch Context

Pattern advanced yang sangat efektif:

```tsx
const CountStateContext = createContext<number | undefined>(undefined)
const CountDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined)

type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' }

function countReducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1
    case 'decrement': return state - 1
    case 'reset': return 0
  }
}

function CountProvider({ children }: { children: ReactNode }) {
  const [count, dispatch] = useReducer(countReducer, 0)
  
  return (
    <CountStateContext.Provider value={count}>
      <CountDispatchContext.Provider value={dispatch}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  )
}

// Components yang cuma baca count nggak re-render waktu dispatch berubah
function CountDisplay() {
  const count = useContext(CountStateContext)
  return <div>Count: {count}</div>
}

// Components yang cuma dispatch nggak re-render waktu count berubah
function CountButtons() {
  const dispatch = useContext(CountDispatchContext)!
  return (
    <div>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  )
}
```

---

## 🏗️ Multiple Providers Pattern

Real-world apps biasanya punya banyak providers. Biar nggak jadi "Provider Hell", buat utility:

```tsx
// src/providers/AppProviders.tsx
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

// Atau bikin compose utility
function composeProviders(...providers: React.FC<{ children: ReactNode }>[]) {
  return ({ children }: { children: ReactNode }) =>
    providers.reduceRight(
      (child, Provider) => <Provider>{child}</Provider>,
      children
    )
}

const AppProviders = composeProviders(
  ThemeProvider,
  AuthProvider,
  NotificationProvider,
  ModalProvider,
)

// main.tsx
<AppProviders>
  <App />
</AppProviders>
```

---

## ❌ Kapan NGGAK Pakai Context

1. **Frequently changing values** (mouse position, scroll position, animation frames) — pakai state management library
2. **Large objects yang sering partial update** — pakai Zustand atau Redux
3. **Simple parent-child data** — just use props! Nggak semua butuh context
4. **Server state** — pakai TanStack Query (nanti dibahas)

---

## 🎯 Practice Exercises

### Exercise 1: Theme Context
Buat ThemeContext lengkap yang support `light`, `dark`, dan `system` mode. Persist pilihan user ke localStorage.

### Exercise 2: Language/i18n Context
Buat LanguageContext yang bisa switch antara `id` (Bahasa Indonesia) dan `en` (English). Buat hook `useTranslation` yang return translated strings.

### Exercise 3: Shopping Cart Context
Buat CartContext dengan:
- `items` array
- `addItem(product)`
- `removeItem(productId)`
- `updateQuantity(productId, qty)`
- `clearCart()`
- `totalPrice` (computed)

### Exercise 4: Notification Context
Buat NotificationContext yang bisa:
- Show notification (success, error, warning, info)
- Auto-dismiss setelah 5 detik
- Stack multiple notifications
- Manual dismiss

### Bonus Challenge 🏆
Combine semua context di atas ke dalam satu app. Buat mini e-commerce yang pakai Theme, Auth, Cart, dan Notification context sekaligus. Optimasi supaya nggak ada unnecessary re-render.

---

> 💡 **Pro tip:** Context itu powerful tapi bukan silver bullet. Untuk state management yang complex, pertimbangkan Zustand (simple) atau Redux Toolkit (robust). Context paling cocok untuk "low-frequency updates" kayak theme, auth, dan locale.
