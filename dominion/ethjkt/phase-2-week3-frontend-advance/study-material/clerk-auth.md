# 🔐 Clerk Authentication — Auth yang Gampang Banget

> **ETHJKT Phase 2 — Week 3 | Arcane Quest: The Identity Ward**

## Kenapa Clerk?

Authentication itu salah satu bagian paling tricky di web dev. Kamu harus handle:
- Sign up / Sign in flows
- Password hashing & security
- Email verification
- OAuth (Google, GitHub, etc.)
- Session management
- Protected routes

**Clerk** handle semua itu buat kamu. Tinggal plug and play. Beda sama Auth0 atau Firebase Auth, Clerk punya UI components yang udah jadi dan developer experience yang jauh lebih smooth.

## Setup Clerk

### 1. Buat Clerk Application

1. Pergi ke [clerk.com](https://clerk.com), sign up
2. Create new application
3. Pilih sign-in methods (Email, Google, GitHub, dll)
4. Copy API keys

### 2. Install

```bash
npm install @clerk/clerk-react
```

### 3. Environment Variables

```bash
# .env (Vite)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

### 4. Setup ClerkProvider

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
)
```

## Sign In & Sign Up Components

Clerk kasih pre-built components yang udah styled dan functional. Tinggal drop aja.

### Dedicated Pages

```tsx
// src/pages/SignInPage.tsx
import { SignIn } from '@clerk/clerk-react'

export function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-gray-800 border-gray-700',
          },
        }}
      />
    </div>
  )
}

// src/pages/SignUpPage.tsx
import { SignUp } from '@clerk/clerk-react'

export function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  )
}
```

### User Button (Avatar + Menu)

```tsx
import { UserButton } from '@clerk/clerk-react'

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <h1 className="text-xl font-bold">ETHJKT App</h1>
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: 'w-10 h-10',
          },
        }}
      />
    </nav>
  )
}
```

## Hooks: useUser & useAuth

### useUser — Ambil Data User

```tsx
import { useUser } from '@clerk/clerk-react'

export function Profile() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return <p>Loading...</p>
  if (!isSignedIn) return <p>Please sign in</p>

  return (
    <div className="p-6">
      <img
        src={user.imageUrl}
        alt={user.fullName ?? 'Avatar'}
        className="w-20 h-20 rounded-full"
      />
      <h2 className="text-xl font-bold mt-2">{user.fullName}</h2>
      <p className="text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
      <p className="text-gray-500">
        Joined: {user.createdAt?.toLocaleDateString()}
      </p>

      {/* Update user metadata */}
      <button
        onClick={() => user.update({ firstName: 'Arcane' })}
        className="btn mt-4"
      >
        Update Name
      </button>
    </div>
  )
}
```

### useAuth — Auth State & Token

```tsx
import { useAuth } from '@clerk/clerk-react'

export function ApiExample() {
  const { isSignedIn, getToken, userId } = useAuth()

  const fetchProtectedData = async () => {
    // Dapet JWT token buat kirim ke backend
    const token = await getToken()

    const response = await fetch('/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    console.log(data)
  }

  if (!isSignedIn) return <p>Sign in to access API</p>

  return (
    <div>
      <p>User ID: {userId}</p>
      <button onClick={fetchProtectedData}>Fetch Data</button>
    </div>
  )
}
```

## Protected Routes

### Dengan React Router

```tsx
// src/components/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-react'
import { Navigate, Outlet } from 'react-router-dom'

export function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return <Outlet />
}
```

### Router Setup

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { HomePage } from './pages/HomePage'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### SignedIn & SignedOut Components

Clerk juga kasih declarative components:

```tsx
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

export function Dashboard() {
  return (
    <>
      <SignedIn>
        <h1>Welcome to Dashboard!</h1>
        {/* Protected content */}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
```

## Backend Middleware (Express)

Kalau kamu punya backend Express, Clerk kasih middleware buat verify JWT tokens.

### Install Backend SDK

```bash
npm install @clerk/express
```

### Setup Middleware

```typescript
// server/index.ts
import express from 'express'
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express'

const app = express()

// Global Clerk middleware — adds auth info to all requests
app.use(clerkMiddleware())

// Public route
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is public' })
})

// Protected route
app.get('/api/protected', requireAuth(), (req, res) => {
  const { userId } = getAuth(req)
  res.json({
    message: 'This is protected',
    userId,
  })
})

// Protected route with manual check
app.get('/api/profile', (req, res) => {
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  res.json({ userId })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

### Environment Variables Backend

```bash
# .env (backend)
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
```

## Customization & Appearance

Clerk components bisa di-customize supaya match sama design app kamu.

```tsx
<ClerkProvider
  publishableKey={PUBLISHABLE_KEY}
  appearance={{
    // Global theme
    baseTheme: undefined, // atau import { dark } from '@clerk/themes'
    variables: {
      colorPrimary: '#7c3aed',     // Purple
      colorBackground: '#1f2937',   // Dark gray
      colorText: '#f9fafb',         // Light text
      colorInputBackground: '#374151',
      borderRadius: '0.5rem',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    elements: {
      card: 'shadow-xl',
      headerTitle: 'text-2xl',
      socialButtonsBlockButton: 'border-gray-600',
    },
  }}
>
  <App />
</ClerkProvider>
```

### Dark Theme

```bash
npm install @clerk/themes
```

```tsx
import { dark } from '@clerk/themes'

<ClerkProvider
  publishableKey={PUBLISHABLE_KEY}
  appearance={{
    baseTheme: dark,
  }}
>
```

## OAuth Setup

Di Clerk Dashboard:
1. **User & Authentication** → **Social Connections**
2. Enable Google, GitHub, Discord, dll
3. Untuk production, tambahin OAuth credentials kamu sendiri

Components otomatis nampilin OAuth buttons — gak perlu code tambahan!

## Conditional Rendering Pattern

```tsx
import { useUser } from '@clerk/clerk-react'

export function ConditionalContent() {
  const { isSignedIn, user } = useUser()

  return (
    <div>
      <h1>ETHJKT Portal</h1>

      {isSignedIn ? (
        <div>
          <p>GM, {user.firstName}! 🌅</p>
          <p>Role: {user.publicMetadata?.role as string ?? 'Member'}</p>
        </div>
      ) : (
        <div>
          <p>Sign in untuk akses full features</p>
          <a href="/sign-in" className="btn-primary">Sign In</a>
        </div>
      )}
    </div>
  )
}
```

## 🏋️ Latihan: Arcane Quest Identity Challenge

### Quest 1: Basic Auth Setup
Setup Clerk di project Vite kamu:
- ClerkProvider di main.tsx
- Sign in & sign up pages
- UserButton di navbar
- Dark theme

### Quest 2: Protected Dashboard
Bikin protected route yang:
- Redirect ke sign-in kalau belum login
- Tampil user info (nama, email, avatar)
- Punya button sign out
- Loading state yang proper

### Quest 3: Role-Based Access
Implement role-based access:
- Admin bisa akses `/admin` route
- Regular user di-redirect ke `/dashboard`
- Pake `user.publicMetadata.role` buat check

### Quest 4: Backend Integration
Setup Express backend dengan Clerk middleware:
- Public endpoint `/api/health`
- Protected endpoint `/api/me` yang return user info
- Frontend fetch data dari protected endpoint pake `getToken()`

## Tips & Gotchas

1. **`isLoaded` check** — selalu handle loading state, jangan assume auth udah ready
2. **SSR** — kalau pake Next.js, pake `@clerk/nextjs` bukan `@clerk/clerk-react`
3. **Token refresh** — Clerk auto-refresh tokens, gak perlu handle manual
4. **Metadata** — pake `publicMetadata` buat data yang bisa dilihat client, `privateMetadata` buat server-only
5. **Webhooks** — Clerk juga support webhooks buat sync user data ke database kamu

## Resources

- 📖 [Clerk Docs](https://clerk.com/docs)
- 📖 [Clerk + React](https://clerk.com/docs/quickstarts/react)
- 📖 [Clerk + Express](https://clerk.com/docs/quickstarts/express)
- 📖 [Clerk Customization](https://clerk.com/docs/customization/overview)
- 🎥 [Clerk in 10 Minutes](https://www.youtube.com/watch?v=RHFmsoiVtKE)

---

> 🔐 *"Identity verification itu ward pertama sebelum masuk dungeon. Gak ada auth = pintu terbuka buat semua monster."* — ETHJKT Arcane Wisdom
