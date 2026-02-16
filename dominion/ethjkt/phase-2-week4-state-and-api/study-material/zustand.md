# 🐻 Zustand — Lightweight State Management

> *"Zustand itu bahasa Jerman artinya 'state'. Simpel namanya, simpel juga pakenya."*

## Kenapa Zustand?

Kamu udah belajar Context dan tau kelemahannya — re-render semua consumer. Zustand hadir sebagai solusi yang:

- **Tiny** — ~1KB gzipped
- **No boilerplate** — Nggak perlu Provider, reducer, action creator
- **Selector-based** — Component cuma re-render kalau data yang dia subscribe berubah
- **Middleware** — Persist, devtools, immer, dll built-in
- **Works outside React** — Bisa dipake di vanilla JS, testing, dll

## Install

```bash
npm install zustand
```

## Basic Store

```jsx
// stores/useCounterStore.js
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  // State
  count: 0,

  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (value) => set({ count: value }),
}));

export default useCounterStore;
```

Pake di component:

```jsx
function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const reset = useCounterStore((state) => state.reset);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

**Nggak ada Provider!** Langsung pake di component manapun. Zustand store itu global by default.

## Selectors — Kunci Performance

Ini yang bikin Zustand unggul dari Context. Dengan selector, component **cuma re-render kalau slice yang di-subscribe berubah**.

```jsx
// stores/useTodoStore.js
const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all',

  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, done: false }],
  })),

  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ),
  })),

  setFilter: (filter) => set({ filter }),

  // Derived state using get()
  getFilteredTodos: () => {
    const { todos, filter } = get();
    if (filter === 'active') return todos.filter(t => !t.done);
    if (filter === 'completed') return todos.filter(t => t.done);
    return todos;
  },
}));
```

```jsx
// ✅ HANYA re-render ketika todos berubah
function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
          {todo.done ? '✅' : '⬜'} {todo.text}
        </li>
      ))}
    </ul>
  );
}

// ✅ HANYA re-render ketika filter berubah
function FilterButtons() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  return (
    <div>
      {['all', 'active', 'completed'].map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          style={{ fontWeight: filter === f ? 'bold' : 'normal' }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
```

### Multiple Selectors dalam Satu Call

```jsx
// Bisa destructure, tapi HATI-HATI
// ❌ Ini bikin re-render kalau APAPUN di store berubah
const { todos, filter } = useTodoStore();

// ✅ Pake shallow comparison untuk multiple values
import { useShallow } from 'zustand/react/shallow';

const { todos, filter } = useTodoStore(
  useShallow((state) => ({ todos: state.todos, filter: state.filter }))
);
```

## Async Actions

Zustand support async actions secara natural:

```jsx
const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const newProduct = await res.json();

      // Add to existing list
      set((state) => ({
        products: [...state.products, newProduct],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteProduct: async (id) => {
    // Optimistic delete
    const previousProducts = get().products;
    set((state) => ({
      products: state.products.filter(p => p.id !== id),
    }));

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (error) {
      // Rollback on error
      set({ products: previousProducts, error: error.message });
    }
  },
}));
```

## Middleware

### Persist — Simpan ke localStorage

```jsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id),
      })),
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: 'cart-storage', // Key di localStorage
      // Optional: pilih state mana yang di-persist
      partialize: (state) => ({ items: state.items }),
    }
  )
);
```

Sekarang cart items otomatis tersimpan di localStorage dan survive page refresh!

### DevTools — Debug pake Redux DevTools

```jsx
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      bears: 0,
      increasePopulation: () => set(
        (state) => ({ bears: state.bears + 1 }),
        false,
        'increasePopulation' // Action name di DevTools
      ),
    }),
    { name: 'BearStore' } // Store name di DevTools
  )
);
```

Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/) di browser, dan kamu bisa lihat semua state changes, time travel debug, dll!

### Combine Middleware

```jsx
const useStore = create(
  devtools(
    persist(
      (set) => ({
        // ... your store
      }),
      { name: 'my-storage' }
    ),
    { name: 'MyStore' }
  )
);
```

Urutan: devtools paling luar, persist di dalamnya.

## Slices Pattern — Organize Store Besar

Kalau store mulai gede, pecah jadi slices:

```jsx
// stores/slices/authSlice.js
export const createAuthSlice = (set) => ({
  user: null,
  token: null,
  login: async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    set({ user: data.user, token: data.token });
  },
  logout: () => set({ user: null, token: null }),
});

// stores/slices/cartSlice.js
export const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),
  clearCart: () => set({ items: [] }),
});

// stores/slices/uiSlice.js
export const createUiSlice = (set) => ({
  theme: 'light',
  sidebarOpen: false,
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen,
  })),
});
```

```jsx
// stores/useStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { createCartSlice } from './slices/cartSlice';
import { createUiSlice } from './slices/uiSlice';

const useStore = create(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createCartSlice(...a),
        ...createUiSlice(...a),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          token: state.token,
          items: state.items,
          theme: state.theme,
        }),
      }
    )
  )
);

export default useStore;
```

Alternatif: bikin separate stores kalau slice-nya benar-benar independent.

```jsx
// Separate stores — lebih isolated
const useAuthStore = create(/* ... */);
const useCartStore = create(/* ... */);
const useUiStore = create(/* ... */);
```

## Zustand vs Redux Toolkit

| Fitur | Zustand | Redux Toolkit |
|-------|---------|--------------|
| Bundle size | ~1KB | ~12KB |
| Boilerplate | Minimal | Medium (slice, store, provider) |
| Provider | ❌ Nggak perlu | ✅ Harus wrap `<Provider>` |
| Selectors | Built-in | Built-in (createSelector) |
| DevTools | Via middleware | Built-in |
| Middleware | Composable | Built-in (thunk, etc) |
| Learning curve | 📗 Rendah | 📘 Medium |
| TypeScript | Great support | Great support |
| Ecosystem | Minimal | Huge (RTK Query, etc) |
| Best for | Small-large apps | Large apps, big teams |

### Kapan pake Zustand?
- Butuh state management yang simpel dan quick
- Nggak mau banyak boilerplate
- App kecil-menengah
- Udah pake React Query untuk server state

### Kapan pake Redux?
- Tim besar yang butuh strict conventions
- App enterprise yang sangat besar
- Butuh RTK Query
- Udah invested di Redux ecosystem

## Real-world Example: E-commerce Cart

```jsx
// stores/useCartStore.js
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        isOpen: false,

        // Actions
        addItem: (product, quantity = 1) => {
          set((state) => {
            const existing = state.items.find(i => i.id === product.id);

            if (existing) {
              return {
                items: state.items.map(i =>
                  i.id === product.id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                ),
              };
            }

            return {
              items: [...state.items, { ...product, quantity }],
            };
          });
        },

        removeItem: (id) => set((state) => ({
          items: state.items.filter(i => i.id !== id),
        })),

        updateQuantity: (id, quantity) => set((state) => ({
          items: quantity <= 0
            ? state.items.filter(i => i.id !== id)
            : state.items.map(i =>
                i.id === id ? { ...i, quantity } : i
              ),
        })),

        clearCart: () => set({ items: [] }),
        toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

        // Computed values
        getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
        getTotalPrice: () => get().items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
      }),
      {
        name: 'shopping-cart',
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: 'CartStore' }
  )
);

export default useCartStore;
```

```jsx
// components/CartIcon.jsx
function CartIcon() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <button onClick={toggleCart} className="relative">
      🛒
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}

// components/ProductCard.jsx
function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>Rp {product.price.toLocaleString()}</p>
      <button onClick={() => addItem(product)}>
        Tambah ke Keranjang
      </button>
    </div>
  );
}
```

## Accessing Store Outside React

```jsx
// Bisa akses store di file non-React!
const state = useCartStore.getState();
console.log(state.items);

// Subscribe to changes
const unsubscribe = useCartStore.subscribe(
  (state) => console.log('Cart changed:', state.items)
);

// Useful for: API interceptors, analytics, testing
```

## 🏋️ Latihan

### Exercise 1: Todo Store
Bikin Zustand store untuk todo app:
- State: todos, filter ('all' | 'active' | 'completed')
- Actions: addTodo, toggleTodo, deleteTodo, setFilter
- Computed: getFilteredTodos
- Persist ke localStorage
- DevTools integration

### Exercise 2: Auth Store
Bikin auth store dengan:
- State: user, token, isLoading
- Actions: login, logout, checkToken
- Persist token ke localStorage (tapi JANGAN persist user)
- Buat component `LoginForm` dan `UserProfile` yang consume store

### Exercise 3: Migrate Context ke Zustand
Ambil AuthContext dari materi sebelumnya. Migrate ke Zustand store. Bandingkan:
- Berapa line code yang berubah?
- Apakah perlu Provider?
- Performance gimana?

### Exercise 4: Slices
Bikin app store dengan 3 slices:
- authSlice: user, login, logout
- todoSlice: todos, addTodo, toggleTodo
- settingsSlice: theme, language, toggleTheme

Gabungkan jadi satu store dengan persist middleware.

---

> 💡 **Pro tip:** Zustand + React Query = combo mematikan. Pake Zustand untuk client state, React Query untuk server state. Nggak perlu Redux lagi untuk kebanyakan app modern.

**Next:** Data Fetching Patterns — biar tau kenapa useEffect + fetch itu berbahaya! ⚡
