# 02 — Zustand Fundamentals: State Management yang Gak Bikin Pusing

> *"Gue pernah kerja di project yang pake Redux. Setup store aja butuh 5 file. Action creators, reducers, selectors, middleware, store config... belum coding logic bisnis udah capek duluan. Terus gue nemuin Zustand. Bikin store? 1 file. 10 baris. Done. Kayak pindah dari nulis surat formal ke nge-chat di WA."*

## 🎯 Yang Bakal Lo Pelajarin

- Kenapa Zustand itu game changer
- Bikin store pertama lo
- Selectors — senjata rahasia anti re-render
- Middleware: persist, devtools, immer
- Async actions (API calls dari store)
- Slices pattern buat store yang gede
- Build: Todo app dengan Zustand + localStorage

## 🐻 Kenapa Zustand?

Nama "Zustand" itu bahasa Jerman yang artinya "state" (keadaan). Library ini dibuat oleh Pmndrs (Poimandres) — tim yang sama yang bikin React Three Fiber, Jotai, dan Valtio.

### Zustand vs Yang Lain

| Feature | useState | Context | Zustand | Redux TK |
|---|---|---|---|---|
| Setup | 0 | Medium | Minimal | Heavy |
| Provider needed? | No | Yes | **No** | Yes |
| Boilerplate | None | Some | **Minimal** | A lot |
| Re-render control | Manual | Poor | **Excellent** | Good |
| Devtools | React DevTools | No | **Yes** | Yes |
| Persist | Manual | Manual | **1 line** | Manual |
| Bundle size | 0 | 0 | **~1KB** | ~11KB |
| Learning curve | Easy | Easy | **Easy** | Hard |

### Install

```bash
npm install zustand
```

Itu doang. Gak ada setup, gak ada Provider, gak ada config. Langsung pake.

## 🏗️ Store Pertama Lo

### Basic Pattern

```typescript
// stores/useCounterStore.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementBy: (amount: number) => void;
}

const useCounterStore = create<CounterState>((set) => ({
  // State
  count: 0,
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementBy: (amount) => set((state) => ({ count: state.count + amount })),
}));

export default useCounterStore;
```

### Pake di Component

```tsx
// components/Counter.tsx
import useCounterStore from '../stores/useCounterStore';

function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </div>
  );
}
```

**Perhatiin:** Gak ada `<Provider>` wrapper! Lo langsung import dan pake. Zustand store itu global by default.

### Cara `set` Bekerja

```typescript
// Method 1: Object (shallow merge)
set({ count: 0 })
// Ini cuma update 'count', property lain tetap

// Method 2: Function (access previous state)
set((state) => ({ count: state.count + 1 }))
// Gunain ini kalau butuh previous value

// Method 3: Replace entire state (jarang dipake)
set({ count: 0, name: 'reset' }, true)
// Parameter kedua = true means replace, not merge
```

### `get` — Akses State di Luar React

```typescript
const useStore = create((set, get) => ({
  count: 0,
  doubleCount: () => {
    const current = get().count;
    set({ count: current * 2 });
  },
}));

// Akses di luar React component
const currentCount = useStore.getState().count;
```

## 🎯 Selectors — Anti Re-render Weapon

**INI PENTING BANGET.** Ini yang bikin Zustand superior dibanding Context.

### ❌ WRONG — Select Semua (Re-render Unnecessary)

```tsx
function Counter() {
  // ❌ Component ini re-render kalau APAPUN di store berubah
  const store = useCounterStore();
  
  return <p>{store.count}</p>;
}
```

### ✅ RIGHT — Select yang Diperlukan Aja

```tsx
function Counter() {
  // ✅ Component ini CUMA re-render kalau 'count' berubah
  const count = useCounterStore((state) => state.count);
  
  return <p>{count}</p>;
}
```

### Visualisasi Re-render

```
Store: { count: 0, name: "Budi", theme: "dark" }

Kalau 'name' berubah jadi "Andi":

❌ const store = useStore()
   → Counter re-render (UNNECESSARY! Counter cuma pake count)

✅ const count = useStore(s => s.count)
   → Counter TIDAK re-render (count gak berubah)
   → Cuma component yang subscribe ke 'name' yang re-render
```

### Multiple Selectors

```tsx
// Option 1: Multiple hooks
function UserProfile() {
  const name = useStore((s) => s.name);
  const email = useStore((s) => s.email);
  
  return <div>{name} - {email}</div>;
}

// Option 2: Object selector with shallow compare
import { useShallow } from 'zustand/react/shallow';

function UserProfile() {
  const { name, email } = useStore(
    useShallow((s) => ({ name: s.name, email: s.email }))
  );
  
  return <div>{name} - {email}</div>;
}
```

> ⚠️ **WAJIB pake `useShallow`** kalau return object/array dari selector! Tanpa itu, Zustand bakal bikin object baru tiap render → infinite re-render.

## 🔧 Middleware

Middleware itu "plugin" buat store lo. Zustand punya beberapa built-in yang powerful banget.

### 1. `persist` — Auto Save ke localStorage

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, item],
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
      })),
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // key di localStorage
    }
  )
);
```

Sekarang cart items bakal **otomatis tersimpan di localStorage** dan **otomatis di-load** waktu app dibuka. User refresh? Cart masih ada. Close browser, buka lagi? Masih ada!

**Custom storage:**

```typescript
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'cart-storage',
    storage: createJSONStorage(() => sessionStorage), // or custom
    partialize: (state) => ({ items: state.items }), // cuma persist field tertentu
    version: 1, // versioning buat migration
    migrate: (persistedState, version) => {
      // Handle migration dari versi lama
      if (version === 0) {
        // migrate logic
      }
      return persistedState;
    },
  }
)
```

### 2. `devtools` — Redux DevTools Integration

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create<StoreState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(
        (state) => ({ count: state.count + 1 }),
        false,
        'increment' // Action name yang muncul di DevTools
      ),
    }),
    { name: 'MyStore' } // Store name di DevTools
  )
);
```

Buka Redux DevTools di browser → lo bisa liat semua state changes, time travel, dll. **Even though lo gak pake Redux!**

### 3. `immer` — Immutable Update yang Gampang

> ⚠️ **Install dulu:** `npm install immer` — Zustand immer middleware butuh package `immer` sebagai dependency.

```typescript
import { immer } from 'zustand/middleware/immer';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  updateTodoText: (id: string, text: string) => void;
}

const useTodoStore = create<TodoState>()(
  immer((set) => ({
    todos: [],
    
    addTodo: (text) => set((state) => {
      // Dengan immer, lo bisa "mutate" langsung!
      state.todos.push({
        id: crypto.randomUUID(),
        text,
        completed: false,
      });
    }),
    
    toggleTodo: (id) => set((state) => {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.completed = !todo.completed;
    }),
    
    updateTodoText: (id, text) => set((state) => {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.text = text;
    }),
  }))
);
```

Tanpa immer:
```typescript
// ❌ Tanpa immer — spread hell
toggleTodo: (id) => set((state) => ({
  todos: state.todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ),
}))

// ✅ Dengan immer — langsung mutate
toggleTodo: (id) => set((state) => {
  const todo = state.todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
})
```

### Stacking Middleware

Lo bisa combine middleware:

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create<StoreState>()(
  devtools(
    persist(
      immer((set) => ({
        // store logic
      })),
      { name: 'my-storage' }
    ),
    { name: 'MyStore' }
  )
);
```

**Urutan wrapping matters!** `devtools` paling luar, `immer` paling dalam.

```
devtools(
  persist(
    immer(
      store
    )
  )
)
```

## ⚡ Async Actions

Zustand support async actions out of the box. Gak perlu middleware kayak redux-thunk.

```typescript
interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  
  fetchProducts: () => Promise<void>;
  createProduct: (data: CreateProductDTO) => Promise<void>;
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.get('/api/products');
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Something went wrong',
        isLoading: false 
      });
    }
  },
  
  createProduct: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.post('/api/products', data);
      // Tambahin ke list yang udah ada
      set((state) => ({
        products: [...state.products, response.data],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create',
        isLoading: false 
      });
    }
  },
}));
```

```tsx
// Pake di component
function ProductList() {
  const products = useProductStore((s) => s.products);
  const isLoading = useProductStore((s) => s.isLoading);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  if (isLoading) return <p>Loading...</p>;
  
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

> ⚠️ **TAPI!** Buat data dari server, gue lebih recommend pake **React Query** (file 06-07) daripada async actions di Zustand. React Query punya caching, auto-refetch, dan banyak fitur lain yang lo harus build sendiri kalau pake Zustand. Simpan Zustand buat **client state** aja.

## 🧩 Slices Pattern — Buat Store yang Gede

Kalau store lo mulai gede (20+ state, 15+ actions), pecah jadi slices:

```typescript
// stores/slices/userSlice.ts
export interface UserSlice {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<void>;
  logout: () => void;
}

export const createUserSlice = (set: any, get: any): UserSlice => ({
  user: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    set({ user: response.data.user, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('token');
  },
});
```

```typescript
// stores/slices/cartSlice.ts
interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface CartSlice {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  totalPrice: () => number;
}

export const createCartSlice = (set: any, get: any): CartSlice => ({
  items: [],
  
  addItem: (item) => set((state: any) => ({
    items: [...state.items, item],
  })),
  
  removeItem: (id) => set((state: any) => ({
    items: state.items.filter((item: CartItem) => item.id !== id),
  })),
  
  totalPrice: () => {
    return get().items.reduce(
      (total: number, item: CartItem) => total + item.price * item.qty, 0
    );
  },
});
```

```typescript
// stores/useStore.ts — Combine semua slices
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createUserSlice, UserSlice } from './slices/userSlice';
import { createCartSlice, CartSlice } from './slices/cartSlice';

type StoreState = UserSlice & CartSlice;

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createUserSlice(set, get),
        ...createCartSlice(set, get),
      }),
      { 
        name: 'app-storage',
        partialize: (state) => ({ items: state.items }), // cuma persist cart
      }
    )
  )
);

export default useStore;
```

**Folder structure:**

```
src/
  stores/
    slices/
      userSlice.ts
      cartSlice.ts
      uiSlice.ts
    useStore.ts         ← Combined store
```

## 🏗️ Build: Todo App dengan Zustand + Persist

Oke, saatnya praktek. Kita bikin todo app yang:
- Add, toggle, delete todos
- Filter by status (all/active/completed)
- Persist ke localStorage
- DevTools support

### Store

```typescript
// stores/useTodoStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type Filter = 'all' | 'active' | 'completed';

interface TodoState {
  todos: Todo[];
  filter: Filter;
  
  // Actions
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: Filter) => void;
  clearCompleted: () => void;
  
  // Computed
  filteredTodos: () => Todo[];
  stats: () => { total: number; active: number; completed: number };
}

const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      immer((set, get) => ({
        todos: [],
        filter: 'all' as Filter,
        
        addTodo: (text) => set((state) => {
          state.todos.push({
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now(),
          });
        }, false, 'addTodo'),
        
        toggleTodo: (id) => set((state) => {
          const todo = state.todos.find(t => t.id === id);
          if (todo) todo.completed = !todo.completed;
        }, false, 'toggleTodo'),
        
        deleteTodo: (id) => set((state) => {
          state.todos = state.todos.filter(t => t.id !== id);
        }, false, 'deleteTodo'),
        
        setFilter: (filter) => set({ filter }, false, 'setFilter'),
        
        clearCompleted: () => set((state) => {
          state.todos = state.todos.filter(t => !t.completed);
        }, false, 'clearCompleted'),
        
        filteredTodos: () => {
          const { todos, filter } = get();
          switch (filter) {
            case 'active': return todos.filter(t => !t.completed);
            case 'completed': return todos.filter(t => t.completed);
            default: return todos;
          }
        },
        
        stats: () => {
          const { todos } = get();
          return {
            total: todos.length,
            active: todos.filter(t => !t.completed).length,
            completed: todos.filter(t => t.completed).length,
          };
        },
      })),
      { name: 'todo-storage' }
    ),
    { name: 'TodoStore' }
  )
);

export default useTodoStore;
```

### Components

```tsx
// components/TodoInput.tsx
import { useState } from 'react';
import useTodoStore from '../stores/useTodoStore';

function TodoInput() {
  const [text, setText] = useState('');
  const addTodo = useTodoStore((s) => s.addTodo);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text.trim());
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Apa yang mau lo kerjain?"
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <button 
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Tambah
      </button>
    </form>
  );
}
```

```tsx
// components/TodoItem.tsx
import useTodoStore from '../stores/useTodoStore';

interface Props {
  todo: { id: string; text: string; completed: boolean };
}

function TodoItem({ todo }: Props) {
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="w-5 h-5"
      />
      <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
        {todo.text}
      </span>
      <button
        onClick={() => deleteTodo(todo.id)}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </div>
  );
}
```

```tsx
// components/TodoList.tsx
import useTodoStore from '../stores/useTodoStore';
import TodoItem from './TodoItem';

function TodoList() {
  const filteredTodos = useTodoStore((s) => s.filteredTodos);
  const todos = filteredTodos();
  
  if (todos.length === 0) {
    return <p className="text-center text-gray-500 py-8">Belum ada todo. Tambahin dong!</p>;
  }
  
  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

```tsx
// components/TodoFilter.tsx
import useTodoStore from '../stores/useTodoStore';

function TodoFilter() {
  const filter = useTodoStore((s) => s.filter);
  const setFilter = useTodoStore((s) => s.setFilter);
  const stats = useTodoStore((s) => s.stats);
  const clearCompleted = useTodoStore((s) => s.clearCompleted);
  const { total, active, completed } = stats();
  
  const filters = [
    { key: 'all' as const, label: `All (${total})` },
    { key: 'active' as const, label: `Active (${active})` },
    { key: 'completed' as const, label: `Done (${completed})` },
  ];
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded ${
              filter === f.key 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {completed > 0 && (
        <button
          onClick={clearCompleted}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}
```

```tsx
// App.tsx
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';

function App() {
  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center">📝 Zustand Todo</h1>
      <TodoInput />
      <TodoFilter />
      <TodoList />
    </div>
  );
}
```

**Coba sendiri:**
1. Tambahin beberapa todos
2. Toggle completed
3. Pake filter
4. **Refresh browser** — todos masih ada! (persist middleware)
5. Buka Redux DevTools — liat semua actions

## 📁 Best Practices

### File Naming Convention

```
src/
  stores/
    useAuthStore.ts      ← Prefix 'use' karena return hook
    useCartStore.ts
    useUIStore.ts
    slices/              ← Kalau perlu slices
      authSlice.ts
      cartSlice.ts
```

### Do's and Don'ts

```typescript
// ✅ DO: Selector spesifik
const count = useStore((s) => s.count);

// ❌ DON'T: Ambil semua state
const store = useStore();

// ✅ DO: Action di dalam store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));

// ❌ DON'T: Logic di component
function Counter() {
  const setCount = useStore((s) => s.setCount);
  // Logic harusnya di store, bukan di sini
  const increment = () => setCount(useStore.getState().count + 1);
}

// ✅ DO: Separate stores buat domain berbeda
const useAuthStore = create(/* ... */);
const useCartStore = create(/* ... */);

// ❌ DON'T: Satu mega store buat semuanya
const useEverythingStore = create(/* auth + cart + ui + products + ... */);
```

## 🔑 Key Takeaways

1. **Zustand = simple, powerful, tiny.** 1KB, no provider, selectors by default.
2. **SELALU pake selectors** — `useStore(s => s.count)`, bukan `useStore()`.
3. **Middleware stack:** `devtools(persist(immer(store)))` = combo terbaik.
4. **Async actions** built-in, tapi buat server data pake React Query.
5. **Slices pattern** buat organize store yang gede.
6. **Persist middleware** buat localStorage/sessionStorage — 1 line setup.

---

Lo udah bisa bikin store, pake selectors, dan setup middleware. Tapi Zustand punya pattern-pattern advanced yang bakal bikin store lo production-ready. Let's go deeper.

**Next Part → [03 — Zustand Advanced](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/03-zustand-advanced.md)**
