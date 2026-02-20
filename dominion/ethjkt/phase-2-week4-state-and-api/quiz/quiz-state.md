# 🧩 Quiz: State Management

## 8 Coding Challenges

> **Topics:** Zustand, Context API, state patterns
> **Format:** Fix/implement code, verify with test cases
> **Time:** ~45 minutes

---

## Challenge 1: Fix the Zustand Store

Store ini punya bug — `removeItem` ngga work karena mutating state langsung.

```javascript
// ❌ BUGGY CODE — fix it
import { create } from 'zustand';

const useTodoStore = create((set, get) => ({
  todos: [],
  
  addTodo: (text) => {
    const todos = get().todos;
    todos.push({ id: Date.now(), text, done: false });
    set({ todos });
  },

  removeTodo: (id) => {
    const todos = get().todos;
    const index = todos.findIndex(t => t.id === id);
    todos.splice(index, 1);
    set({ todos });
  },

  toggleTodo: (id) => {
    const todos = get().todos;
    const todo = todos.find(t => t.id === id);
    todo.done = !todo.done;
    set({ todos });
  },
}));
```

**Test cases:**
```javascript
// After fix:
useTodoStore.getState().addTodo('Learn Zustand');
expect(useTodoStore.getState().todos).toHaveLength(1);

useTodoStore.getState().addTodo('Learn React Query');
expect(useTodoStore.getState().todos).toHaveLength(2);

const id = useTodoStore.getState().todos[0].id;
useTodoStore.getState().toggleTodo(id);
expect(useTodoStore.getState().todos[0].done).toBe(true);

useTodoStore.getState().removeTodo(id);
expect(useTodoStore.getState().todos).toHaveLength(1);
```

---

## Challenge 2: Zustand Computed Values

Implement `getTotal` dan `getItemCount` sebagai computed values.

```javascript
const useCartStore = create((set, get) => ({
  items: [
    { id: 1, name: 'Laptop', price: 12000000, quantity: 1 },
    { id: 2, name: 'Mouse', price: 350000, quantity: 3 },
  ],

  getTotal: () => {
    // Implement: return total harga (price * quantity) semua items
  },

  getItemCount: () => {
    // Implement: return total quantity semua items
  },
}));
```

**Test cases:**
```javascript
expect(useCartStore.getState().getTotal()).toBe(12000000 + 350000 * 3); // 13050000
expect(useCartStore.getState().getItemCount()).toBe(4); // 1 + 3
```

---

## Challenge 3: Context API — Theme Provider

Implement ThemeContext yang support dark/light mode dengan toggle.

```jsx
// Implement ThemeProvider and useTheme hook
const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  // Implement:
  // - state: theme ('light' | 'dark')
  // - toggleTheme function
  // - Persist theme ke localStorage
  // - Load saved theme on mount
}

function useTheme() {
  // Implement: return { theme, toggleTheme }
  // Throw error if used outside ThemeProvider
}
```

**Test cases:**
```javascript
// Default theme is 'light' (or from localStorage)
const { theme, toggleTheme } = useTheme();
expect(theme).toBe('light');

toggleTheme();
expect(theme).toBe('dark');
expect(localStorage.getItem('theme')).toBe('dark');

toggleTheme();
expect(theme).toBe('light');
```

---

## Challenge 4: Zustand Middleware — Logger

Bikin simple logger middleware yang log setiap state change ke console.

```javascript
// Implement logger middleware
const logger = (config) => (set, get, api) => {
  return config(
    (...args) => {
      // Log previous state
      // Call original set
      // Log next state
    },
    get,
    api
  );
};

// Usage:
const useStore = create(
  logger((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
);

// When increment() is called, console should show:
// "prev state: { count: 0 }"
// "next state: { count: 1 }"
```

**Test cases:**
```javascript
const consoleSpy = vi.spyOn(console, 'log');
useStore.getState().increment();
expect(consoleSpy).toHaveBeenCalledWith('prev state:', { count: 0 });
expect(consoleSpy).toHaveBeenCalledWith('next state:', { count: 1 });
```

---

## Challenge 5: When NOT to Use Zustand

Untuk tiap scenario, jawab: **useState**, **Context**, **Zustand**, atau **React Query**?

```javascript
// Scenario A: Form input value untuk search bar
const answer_a = '???';

// Scenario B: List of products dari API
const answer_b = '???';

// Scenario C: Dark/light theme toggle (used by 3 components)
const answer_c = '???';

// Scenario D: Shopping cart (add, remove, quantities) — used app-wide
const answer_d = '???';

// Scenario E: Modal open/close state (used only in parent + child)
const answer_e = '???';

// Scenario F: Current logged-in user info
const answer_f = '???';

// Scenario G: Notification list with unread count — used in navbar + page
const answer_g = '???';

// Scenario H: Paginated data from API with caching
const answer_h = '???';
```

**Answers:**
```javascript
const answer_a = 'useState';        // Local, single component
const answer_b = 'React Query';     // Server data
const answer_c = 'Context';         // Simple, few values, moderate sharing
const answer_d = 'Zustand';         // Complex client state, app-wide
const answer_e = 'useState';        // Local, 1-2 levels deep
const answer_f = 'Context';         // Auth state, moderate complexity
const answer_g = 'Zustand';         // Complex client state, multiple consumers
const answer_h = 'React Query';     // Server data with caching/pagination
```

---

## Challenge 6: Fix Context Re-render

This context causes ALL consumers to re-render when ANY value changes. Fix it.

```jsx
// ❌ PROBLEM: Everything re-renders when count OR theme changes
function AppProvider({ children }) {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ count, setCount, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// This component re-renders when count changes, even though it only uses theme
function ThemeDisplay() {
  const { theme } = useContext(AppContext);
  return <p>Theme: {theme}</p>;
}
```

**Fix:** Split into separate contexts, or use Zustand with selectors.

**Test case:**
```javascript
// ThemeDisplay should NOT re-render when count changes
// CountDisplay should NOT re-render when theme changes
```

---

## Challenge 7: Zustand Slices Pattern

Combine multiple "slices" into one store.

```javascript
// Implement createUserSlice and createCartSlice, then combine

const createUserSlice = (set) => ({
  // user: null,
  // setUser: (user) => ???
  // logout: () => ???
});

const createCartSlice = (set) => ({
  // items: [],
  // addItem: (item) => ???
  // clearCart: () => ???
});

// Combine into one store
const useStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createCartSlice(...a),
}));
```

**Test cases:**
```javascript
useStore.getState().setUser({ name: 'Budi' });
expect(useStore.getState().user.name).toBe('Budi');

useStore.getState().addItem({ id: 1, name: 'Laptop' });
expect(useStore.getState().items).toHaveLength(1);

useStore.getState().logout();
expect(useStore.getState().user).toBeNull();
// Cart should NOT be affected by logout
expect(useStore.getState().items).toHaveLength(1);
```

---

## Challenge 8: Zustand with Immer

Refactor this store to use Immer middleware (makes mutations safe).

```javascript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Refactor with immer — now you CAN mutate directly!
const useStore = create(
  immer((set) => ({
    users: [
      { id: 1, name: 'Budi', posts: [{ id: 1, title: 'Hello' }] },
      { id: 2, name: 'Rina', posts: [] },
    ],

    addPostToUser: (userId, post) => {
      // With immer, you can do:
      // set((state) => { state.users.find(...).posts.push(post) })
      // Implement this
    },

    updateUserName: (userId, newName) => {
      // Implement with direct mutation (immer makes it safe)
    },
  }))
);
```

**Test cases:**
```javascript
useStore.getState().addPostToUser(2, { id: 2, title: 'My First Post' });
expect(useStore.getState().users[1].posts).toHaveLength(1);
expect(useStore.getState().users[1].posts[0].title).toBe('My First Post');

useStore.getState().updateUserName(1, 'Budi Santoso');
expect(useStore.getState().users[0].name).toBe('Budi Santoso');
```
