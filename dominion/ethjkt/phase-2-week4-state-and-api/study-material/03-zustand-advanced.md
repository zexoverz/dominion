# 03 — Zustand Advanced: Production-Grade Patterns

> *"Lo udah bisa nyetir mobil. Sekarang gue ajarin lo parallel parking, drifting, dan engine tuning. Ini pattern-pattern yang bikin store lo kuat di production — bukan cuma demo."*

## 🎯 Yang Bakal Lo Pelajarin

- Computed values (derived state)
- `subscribeWithSelector` — subscribe ke state changes
- Transient updates (update tanpa re-render)
- Reset store ke initial state
- Combining/accessing stores dari store lain
- Testing Zustand stores
- Build: Spotify-like player state

## 🧮 Computed Values (Derived State)

Kadang lo butuh state yang **dihitung dari state lain**. Misalnya: total harga dari list items.

### Pattern 1: Getter Function

```typescript
const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  // Computed as function — dipanggil manual
  totalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  
  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.qty, 0);
  },
}));

// Usage
function CartSummary() {
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalItems = useCartStore((s) => s.totalItems);
  
  return (
    <div>
      <p>Items: {totalItems()}</p>
      <p>Total: Rp {totalPrice().toLocaleString()}</p>
    </div>
  );
}
```

### Pattern 2: Derived di Selector (Recommended!)

```typescript
const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
}));

// Computed langsung di selector — auto re-render kalau result berubah
function CartSummary() {
  const totalPrice = useCartStore((s) => 
    s.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  
  return <p>Total: Rp {totalPrice.toLocaleString()}</p>;
}
```

> ⚠️ Selector yang return primitive (number, string) itu safe. Tapi kalau return object/array, **pake `useShallow`** atau custom equality function.

### Pattern 3: Custom Equality

```typescript
import { useShallow } from 'zustand/react/shallow';

function CartItems() {
  // useShallow buat shallow compare object/array
  const { items, totalQty } = useCartStore(
    useShallow((s) => ({
      items: s.items,
      totalQty: s.items.reduce((sum, i) => sum + i.qty, 0),
    }))
  );
  
  return <div>{/* ... */}</div>;
}
```

## 📡 subscribeWithSelector

Kadang lo mau **react ke state changes di luar React** (logging, analytics, side effects).

```typescript
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create<StoreState>()(
  subscribeWithSelector((set) => ({
    count: 0,
    name: 'Budi',
    increment: () => set((s) => ({ count: s.count + 1 })),
  }))
);

// Subscribe ke specific field
const unsubscribe = useStore.subscribe(
  (state) => state.count,          // selector
  (count, previousCount) => {       // listener
    console.log(`Count changed: ${previousCount} → ${count}`);
    
    // Contoh: analytics tracking
    if (count === 100) {
      analytics.track('milestone_reached', { count });
    }
  },
  {
    equalityFn: Object.is,         // optional: custom equality
    fireImmediately: false,        // optional: fire on subscribe
  }
);

// Jangan lupa unsubscribe kalau perlu
// unsubscribe();
```

**Real-world use case:**

```typescript
// Auto-save draft ke server setiap kali content berubah
useEditorStore.subscribe(
  (s) => s.content,
  (content) => {
    // Debounced save
    debouncedSave(content);
  }
);

// Sync theme ke document
useThemeStore.subscribe(
  (s) => s.theme,
  (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
);
```

## ⚡ Transient Updates (No Re-render)

Kadang lo mau update state **tanpa trigger re-render**. Contoh: posisi mouse, scroll position, animation frame.

```typescript
const useMouseStore = create((set) => ({
  x: 0,
  y: 0,
  setPosition: (x: number, y: number) => set({ x, y }),
}));

// ❌ Ini bakal re-render component 60x per detik
function MouseTracker() {
  const x = useMouseStore((s) => s.x); // re-render tiap update!
  // ...
}

// ✅ Transient update — langsung manipulasi DOM
function MouseTracker() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Subscribe langsung, bypass React
    const unsubscribe = useMouseStore.subscribe((state) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${state.x}px, ${state.y}px)`;
      }
    });
    return unsubscribe;
  }, []);
  
  return <div ref={ref} className="cursor-dot" />;
}
```

## 🔄 Reset Store

Pattern yang sering dibutuhin — reset state ke initial values (misalnya waktu logout):

```typescript
// Pattern: Store with reset
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  reset: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  
  logout: () => {
    localStorage.removeItem('token');
    set(initialState); // Reset ke initial state
  },
  
  reset: () => set(initialState),
}));
```

### Reset ALL Stores (Nuclear Option)

```typescript
// resetAllStores.ts
const resetFunctions: (() => void)[] = [];

export const registerReset = (fn: () => void) => {
  resetFunctions.push(fn);
};

export const resetAllStores = () => {
  resetFunctions.forEach(fn => fn());
};

// Di setiap store:
const useAuthStore = create<AuthState>((set) => {
  const initialState = { user: null, token: null };
  
  registerReset(() => set(initialState));
  
  return {
    ...initialState,
    // ... actions
  };
});

// Waktu logout:
function handleLogout() {
  resetAllStores(); // Boom — semua store ke-reset
  router.push('/login');
}
```

## 🔗 Accessing Store dari Store Lain

Kadang store A perlu baca/update store B:

```typescript
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  // ...
}));

const useCartStore = create<CartState>((set) => ({
  items: [],
  
  checkout: async () => {
    // Akses auth store dari cart store
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('Must be logged in to checkout');
    }
    
    const items = useCartStore.getState().items;
    await api.post('/orders', { items }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    set({ items: [] }); // Clear cart after checkout
  },
}));
```

> 💡 **Gunain `getState()`** buat akses store lain. Jangan subscribe — itu bikin coupling yang susah di-debug.

## 🧪 Testing Zustand Stores

Zustand stores gampang banget di-test karena mereka cuma plain functions:

```typescript
// stores/__tests__/useTodoStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import useTodoStore from '../useTodoStore';

describe('useTodoStore', () => {
  // Reset store sebelum setiap test
  beforeEach(() => {
    useTodoStore.setState({
      todos: [],
      filter: 'all',
    });
  });
  
  it('should add a todo', () => {
    useTodoStore.getState().addTodo('Learn Zustand');
    
    const todos = useTodoStore.getState().todos;
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe('Learn Zustand');
    expect(todos[0].completed).toBe(false);
  });
  
  it('should toggle a todo', () => {
    useTodoStore.getState().addTodo('Learn Zustand');
    const id = useTodoStore.getState().todos[0].id;
    
    useTodoStore.getState().toggleTodo(id);
    
    expect(useTodoStore.getState().todos[0].completed).toBe(true);
  });
  
  it('should filter todos', () => {
    const { addTodo, toggleTodo, setFilter, filteredTodos } = useTodoStore.getState();
    
    addTodo('Task 1');
    addTodo('Task 2');
    
    const id = useTodoStore.getState().todos[0].id;
    toggleTodo(id);
    
    setFilter('active');
    expect(useTodoStore.getState().filteredTodos()).toHaveLength(1);
    
    setFilter('completed');
    expect(useTodoStore.getState().filteredTodos()).toHaveLength(1);
    
    setFilter('all');
    expect(useTodoStore.getState().filteredTodos()).toHaveLength(2);
  });
  
  it('should clear completed', () => {
    const { addTodo, toggleTodo, clearCompleted } = useTodoStore.getState();
    
    addTodo('Task 1');
    addTodo('Task 2');
    
    const id = useTodoStore.getState().todos[0].id;
    toggleTodo(id);
    clearCompleted();
    
    expect(useTodoStore.getState().todos).toHaveLength(1);
    expect(useTodoStore.getState().todos[0].completed).toBe(false);
  });
});
```

**Key testing pattern:** Akses store via `getState()` dan `setState()` — gak perlu render React components!

## 🎵 Build: Spotify-like Player State

Sekarang kita bikin sesuatu yang lebih complex — music player state management:

```typescript
// stores/usePlayerStore.ts
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  coverUrl: string;
  audioUrl: string;
}

interface PlayerState {
  // State
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;         // 0-1
  progress: number;       // 0-100
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  
  // Actions
  play: (track?: Track) => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
}

const usePlayerStore = create<PlayerState>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          currentTrack: null,
          queue: [],
          history: [],
          isPlaying: false,
          volume: 0.8,
          progress: 0,
          shuffle: false,
          repeat: 'off',
          
          play: (track) => {
            if (track) {
              const current = get().currentTrack;
              if (current) {
                // Push current to history
                set((s) => ({
                  history: [current, ...s.history].slice(0, 50),
                }));
              }
              set({ currentTrack: track, isPlaying: true, progress: 0 });
            } else {
              set({ isPlaying: true });
            }
          },
          
          pause: () => set({ isPlaying: false }),
          
          togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
          
          next: () => {
            const { queue, shuffle, repeat, currentTrack, history } = get();
            
            if (repeat === 'one') {
              set({ progress: 0 }); // Replay current
              return;
            }
            
            if (queue.length === 0) {
              if (repeat === 'all' && history.length > 0) {
                // Loop back to start of history
                const firstTrack = history[history.length - 1];
                set({ currentTrack: firstTrack, progress: 0 });
              } else {
                set({ isPlaying: false });
              }
              return;
            }
            
            let nextIndex = 0;
            if (shuffle) {
              nextIndex = Math.floor(Math.random() * queue.length);
            }
            
            const nextTrack = queue[nextIndex];
            set((s) => ({
              currentTrack: nextTrack,
              queue: s.queue.filter((_, i) => i !== nextIndex),
              history: currentTrack 
                ? [currentTrack, ...s.history].slice(0, 50) 
                : s.history,
              progress: 0,
            }));
          },
          
          previous: () => {
            const { history, currentTrack, progress } = get();
            
            // Kalau udah lewat 3 detik, restart track
            if (progress > 3) {
              set({ progress: 0 });
              return;
            }
            
            if (history.length === 0) return;
            
            const prevTrack = history[0];
            set((s) => ({
              currentTrack: prevTrack,
              history: s.history.slice(1),
              queue: currentTrack ? [currentTrack, ...s.queue] : s.queue,
              progress: 0,
            }));
          },
          
          setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
          setProgress: (progress) => set({ progress }),
          toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
          
          cycleRepeat: () => set((s) => ({
            repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off',
          })),
          
          addToQueue: (track) => set((s) => ({ queue: [...s.queue, track] })),
          removeFromQueue: (id) => set((s) => ({
            queue: s.queue.filter(t => t.id !== id),
          })),
          clearQueue: () => set({ queue: [] }),
        }),
        {
          name: 'player-storage',
          partialize: (state) => ({
            volume: state.volume,
            shuffle: state.shuffle,
            repeat: state.repeat,
            // Jangan persist currentTrack/queue/progress — bisa stale
          }),
        }
      )
    ),
    { name: 'PlayerStore' }
  )
);

// Subscribe: auto-pause kalau no track
usePlayerStore.subscribe(
  (s) => s.currentTrack,
  (track) => {
    if (!track) {
      usePlayerStore.setState({ isPlaying: false });
    }
  }
);

export default usePlayerStore;
```

### Player Component

```tsx
// components/Player.tsx
import usePlayerStore from '../stores/usePlayerStore';

function Player() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const progress = usePlayerStore((s) => s.progress);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeat = usePlayerStore((s) => s.repeat);
  
  const { togglePlay, next, previous, setVolume, toggleShuffle, cycleRepeat } 
    = usePlayerStore.getState(); // Actions gak trigger re-render
  
  if (!currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-700 rounded mb-3">
        <div 
          className="h-full bg-green-500 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        {/* Track info */}
        <div className="flex items-center gap-3 w-1/3">
          <img src={currentTrack.coverUrl} className="w-12 h-12 rounded" alt="" />
          <div>
            <p className="font-medium">{currentTrack.title}</p>
            <p className="text-sm text-gray-400">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4 w-1/3 justify-center">
          <button onClick={toggleShuffle} className={shuffle ? 'text-green-500' : ''}>
            🔀
          </button>
          <button onClick={previous}>⏮</button>
          <button onClick={togglePlay} className="text-3xl">
            {isPlaying ? '⏸' : '▶️'}
          </button>
          <button onClick={next}>⏭</button>
          <button onClick={cycleRepeat} className={repeat !== 'off' ? 'text-green-500' : ''}>
            {repeat === 'one' ? '🔂' : '🔁'}
          </button>
        </div>
        
        {/* Volume */}
        <div className="flex items-center gap-2 w-1/3 justify-end">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
```

Perhatiin pattern di player:
- **Selectors** buat setiap piece of state (prevent unnecessary re-render)
- **`getState()`** buat actions (actions gak berubah, gak perlu re-render)
- **`subscribeWithSelector`** buat side effects di luar React
- **`partialize`** di persist — cuma save settings, bukan playing state
- **Repeat cycle** pattern: off → all → one → off

## 🔑 Key Takeaways

1. **Computed values** — derive di selector, bukan di store (kecuali complex logic)
2. **`subscribeWithSelector`** — buat side effects di luar React lifecycle
3. **Transient updates** — bypass React buat high-frequency updates (mouse, animation)
4. **Reset pattern** — simpan `initialState` terpisah, `set(initialState)` buat reset
5. **Cross-store access** — `getState()`, jangan subscribe antar store
6. **Testing** — `getState()` dan `setState()` bikin testing super gampang

---

Zustand udah di tangan. Sekarang saatnya kita bahas masalah yang JAUH lebih penting di real app: **gimana caranya fetch data dari server tanpa bikin app lo berantakan.**

**Next Part → [04 — Data Fetching Patterns](https://github.com/Ethereum-Jakarta/phase-2-week4-state-and-api/blob/main/study-material/04-data-fetching-patterns.md)**
