# ⚡ Redux Toolkit — State Management yang Gak Bikin Pusing

> **ETHJKT Phase 2 — Week 3 | Arcane Quest: The State Grimoire**

## Apa Itu Redux?

Redux adalah **predictable state container** buat JavaScript apps. Bayangin kayak database mini di frontend — semua state app kamu disimpan di satu tempat (store), dan ada aturan ketat gimana state itu bisa berubah.

**Redux Toolkit (RTK)** adalah cara modern dan official buat pake Redux. Dulu Redux itu terkenal verbose banget (banyak boilerplate), tapi RTK bikin semuanya **jauh lebih simple**.

### Kapan Pake Redux?

| Situasi | Solusi |
|---------|--------|
| State lokal 1 komponen | `useState` |
| State shared 2-3 komponen berdekatan | `useContext` |
| State medium, gak terlalu complex | Zustand |
| State complex, banyak async, perlu middleware | **Redux Toolkit** |
| Server state (API caching) | TanStack Query / RTK Query |

## Konsep Dasar Redux

```
User clicks button
    ↓
Dispatch ACTION
    ↓
REDUCER processes action → returns new STATE
    ↓
STORE updates
    ↓
Components RE-RENDER with new state
```

Tiga prinsip Redux:
1. **Single source of truth** — satu store untuk semua state
2. **State is read-only** — gak bisa mutate langsung, harus lewat action
3. **Changes via pure functions** — reducer harus pure function

## Setup Redux Toolkit

### Install

```bash
npm install @reduxjs/toolkit react-redux
```

### Project Structure

```
src/
├── app/
│   └── store.ts          # Redux store config
├── features/
│   ├── counter/
│   │   └── counterSlice.ts
│   ├── auth/
│   │   └── authSlice.ts
│   └── tokens/
│       └── tokensSlice.ts
└── main.tsx
```

## createSlice — Bikin Slice Pertama

Slice itu "sepotong" state + reducer + actions dalam satu paket.

```typescript
// src/features/counter/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
  incrementAmount: number
}

const initialState: CounterState = {
  value: 0,
  incrementAmount: 1,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // RTK pake Immer di belakang layar,
      // jadi kamu bisa "mutate" state langsung!
      state.value += state.incrementAmount
    },
    decrement: (state) => {
      state.value -= state.incrementAmount
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
    setIncrementAmount: (state, action: PayloadAction<number>) => {
      state.incrementAmount = action.payload
    },
    reset: (state) => {
      state.value = 0
    },
  },
})

// Export actions
export const {
  increment,
  decrement,
  incrementByAmount,
  setIncrementAmount,
  reset,
} = counterSlice.actions

// Export reducer
export default counterSlice.reducer
```

> 💡 **Immer Magic**: Di Redux biasa, kamu harus return object baru (`return { ...state, value: state.value + 1 }`). RTK pake library Immer, jadi kamu bisa tulis `state.value += 1` dan dia auto-generate immutable update.

## configureStore — Setup Store

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import authReducer from '../features/auth/authSlice'
import tokensReducer from '../features/tokens/tokensSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    tokens: tokensReducer,
  },
})

// Type definitions
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### Typed Hooks (Wajib untuk TypeScript!)

```typescript
// src/app/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Pake ini di seluruh app, bukan useDispatch/useSelector langsung
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### Provider Setup

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
```

## useSelector & useDispatch — Pake di Components

```tsx
// src/features/counter/Counter.tsx
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from './counterSlice'

export function Counter() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div className="p-6 rounded-lg bg-gray-800 text-white">
      <h2 className="text-2xl font-bold">Arcane Counter</h2>
      <p className="text-4xl my-4">{count}</p>

      <div className="flex gap-2">
        <button
          className="btn"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <button
          className="btn"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <button
          className="btn"
          onClick={() => dispatch(incrementByAmount(10))}
        >
          +10
        </button>
        <button
          className="btn-danger"
          onClick={() => dispatch(reset())}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
```

## createAsyncThunk — Async Operations

Real-world app pasti ada API calls. `createAsyncThunk` bikin async logic jadi clean.

```typescript
// src/features/tokens/tokensSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Token {
  id: string
  name: string
  symbol: string
  price: number
}

interface TokensState {
  items: Token[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: TokensState = {
  items: [],
  status: 'idle',
  error: null,
}

// Async thunk — fetch tokens dari API
export const fetchTokens = createAsyncThunk(
  'tokens/fetchTokens',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.example.com/tokens')
      if (!response.ok) throw new Error('Failed to fetch')
      return (await response.json()) as Token[]
    } catch (err) {
      return rejectWithValue('Gagal fetch data token')
    }
  }
)

// Async thunk dengan argument
export const fetchTokenById = createAsyncThunk(
  'tokens/fetchTokenById',
  async (tokenId: string) => {
    const response = await fetch(`https://api.example.com/tokens/${tokenId}`)
    return (await response.json()) as Token
  }
)

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    clearTokens: (state) => {
      state.items = []
      state.status = 'idle'
    },
  },
  // extraReducers handle async thunk lifecycle
  extraReducers: (builder) => {
    builder
      // fetchTokens
      .addCase(fetchTokens.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTokens.fulfilled, (state, action: PayloadAction<Token[]>) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTokens.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
      // fetchTokenById
      .addCase(fetchTokenById.fulfilled, (state, action: PayloadAction<Token>) => {
        const exists = state.items.find(t => t.id === action.payload.id)
        if (!exists) {
          state.items.push(action.payload)
        }
      })
  },
})

export const { clearTokens } = tokensSlice.actions
export default tokensSlice.reducer
```

### Pake di Component

```tsx
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchTokens } from './tokensSlice'

export function TokenList() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.tokens)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTokens())
    }
  }, [dispatch, status])

  if (status === 'loading') return <p>Loading tokens...</p>
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <div>
      <h2>Token Prices</h2>
      <ul>
        {items.map((token) => (
          <li key={token.id}>
            {token.name} ({token.symbol}): ${token.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## RTK Query — Data Fetching Built-in

RTK Query itu kayak TanStack Query tapi built-in di Redux. Auto-caching, auto-refetch, loading states — semua otomatis.

```typescript
// src/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Token {
  id: string
  name: string
  symbol: string
  price: number
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com' }),
  tagTypes: ['Token'],
  endpoints: (builder) => ({
    // GET /tokens
    getTokens: builder.query<Token[], void>({
      query: () => '/tokens',
      providesTags: ['Token'],
    }),
    // GET /tokens/:id
    getTokenById: builder.query<Token, string>({
      query: (id) => `/tokens/${id}`,
      providesTags: (result, error, id) => [{ type: 'Token', id }],
    }),
    // POST /tokens
    addToken: builder.mutation<Token, Partial<Token>>({
      query: (newToken) => ({
        url: '/tokens',
        method: 'POST',
        body: newToken,
      }),
      invalidatesTags: ['Token'], // Auto-refetch after mutation!
    }),
  }),
})

// Auto-generated hooks!
export const {
  useGetTokensQuery,
  useGetTokenByIdQuery,
  useAddTokenMutation,
} = apiSlice
```

### Tambah ke Store

```typescript
// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../features/api/apiSlice'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
```

### Pake di Component

```tsx
import { useGetTokensQuery, useAddTokenMutation } from '../api/apiSlice'

export function TokenDashboard() {
  const { data: tokens, isLoading, error } = useGetTokensQuery()
  const [addToken, { isLoading: isAdding }] = useAddTokenMutation()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

  return (
    <div>
      <button
        onClick={() => addToken({ name: 'New Token', symbol: 'NEW', price: 0 })}
        disabled={isAdding}
      >
        {isAdding ? 'Adding...' : 'Add Token'}
      </button>

      <ul>
        {tokens?.map((token) => (
          <li key={token.id}>
            {token.name}: ${token.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Redux vs Zustand vs Context — Kapan Pake Apa?

### Context API
```
✅ Simple shared state (theme, locale, auth status)
✅ Gak perlu install apa-apa
❌ Re-render semua consumer kalau state berubah
❌ Gak cocok buat state yang sering update
```

### Zustand
```
✅ Simple API, minimal boilerplate
✅ Performant (fine-grained subscriptions)
✅ Bagus buat medium complexity
❌ Gak ada built-in dev tools se-powerful Redux
❌ Kurang structured buat team besar
```

### Redux Toolkit
```
✅ Predictable, structured, scalable
✅ Amazing DevTools (time-travel debugging)
✅ RTK Query buat data fetching
✅ Middleware support (logging, analytics, etc)
✅ Best buat large team & complex apps
❌ More boilerplate dibanding Zustand
❌ Learning curve lebih tinggi
```

### Rule of Thumb

> Kalau kamu **ragu**, mulai dari **Zustand** atau **Context**. Migrate ke **Redux** kalau app makin complex dan butuh structure lebih ketat.

## Redux DevTools

Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) di Chrome. RTK otomatis connect!

Fitur keren:
- **Time Travel** — mundur-maju antar state changes
- **Action Log** — liat semua action yang di-dispatch
- **State Diff** — liat persis apa yang berubah
- **Export/Import** — share state buat debugging

## 🏋️ Latihan: Arcane Quest State Challenge

### Quest 1: Shopping Cart Slice
Bikin `cartSlice` dengan fitur:
- `addToCart(item)` — tambah item ke cart
- `removeFromCart(itemId)` — hapus item
- `updateQuantity(itemId, quantity)` — update jumlah
- `clearCart()` — kosongin cart
- Selector buat total price

### Quest 2: Auth Slice dengan Async Thunk
Bikin `authSlice` yang:
- `loginUser(credentials)` — async thunk buat login API
- Handle pending/fulfilled/rejected states
- Store user data dan token
- `logout()` — clear auth state

### Quest 3: RTK Query API
Bikin API slice buat:
- GET semua products
- GET product by ID
- POST new product
- DELETE product
- Implement proper tag invalidation

### Quest 4: Full Integration
Gabungin semua slices di atas jadi mini e-commerce app:
- Product listing (RTK Query)
- Cart management (cartSlice)
- Auth gate (authSlice)
- Redux DevTools buat debugging

## Resources

- 📖 [Redux Toolkit Official Docs](https://redux-toolkit.js.org)
- 📖 [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- 🎥 [Redux Toolkit Tutorial - Dave Gray](https://www.youtube.com/watch?v=NqzdVN2tyvQ)
- 📖 [Redux Style Guide](https://redux.js.org/style-guide/)

---

> ⚡ *"State management itu kayak mana pool — kalau gak dikelola dengan bener, spell kamu bakal chaos."* — ETHJKT Arcane Wisdom
