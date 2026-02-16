# 🪝 Custom Hooks

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Apa Itu Custom Hook?

Custom hook itu **function JavaScript yang namanya dimulai dengan `use`** dan bisa manggil hooks lain di dalamnya. Gunanya? **Extract reusable logic** dari components.

```tsx
// Sebelum — logic duplikat di banyak component
function ComponentA() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // ... use windowWidth
}

function ComponentB() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  useEffect(() => {
    // exact same code... 😩
  }, [])
}

// Sesudah — extract ke custom hook
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return width
}

// Clean! 😎
function ComponentA() {
  const windowWidth = useWindowWidth()
}

function ComponentB() {
  const windowWidth = useWindowWidth()
}
```

---

## 📜 Rules of Hooks (Wajib Hafal!)

1. **Only call hooks at the top level** — NGGAK boleh di dalam if, loop, atau nested function
2. **Only call hooks from React functions** — Component atau custom hooks
3. **Custom hooks HARUS dimulai dengan `use`** — Ini bukan cuma convention, React enforce ini

```tsx
// ❌ SALAH
function MyComponent() {
  if (condition) {
    const [state, setState] = useState(0) // NGGAK boleh conditional!
  }
  
  for (let i = 0; i < 5; i++) {
    useEffect(() => {}) // NGGAK boleh di loop!
  }
}

// ❌ SALAH — bukan function yang start dengan "use"
function getLocalStorage(key: string) {
  const [value, setValue] = useState(localStorage.getItem(key))
  // Error: hooks hanya boleh dipanggil dari React function
}

// ✅ BENAR
function useLocalStorage(key: string) {
  const [value, setValue] = useState(localStorage.getItem(key))
  // OK!
}
```

---

## 🗄️ useLocalStorage

Hook paling berguna yang bakal kalian pakai terus:

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  // Lazy initialization — cuma jalan sekali
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })
  
  // Update localStorage setiap value berubah
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }
  
  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue))
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])
  
  return [storedValue, setValue] as const
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'id')
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16)
  
  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      {/* Settings persist across page reloads! */}
    </div>
  )
}
```

---

## 🌐 useFetch

Generic data fetching hook:

```tsx
interface UseFetchResult<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}

function useFetch<T>(url: string, options?: RequestInit): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [url])
  
  useEffect(() => {
    const abortController = new AbortController()
    
    const fetchWithAbort = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        })
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        const json = await response.json()
        setData(json)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchWithAbort()
    
    // Cleanup: abort fetch if component unmounts
    return () => abortController.abort()
  }, [url])
  
  return { data, error, isLoading, refetch: fetchData }
}

// Usage
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error, refetch } = useFetch<User>(
    `/api/users/${userId}`
  )
  
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />
  if (!user) return null
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

> **Note:** Untuk production, pakai TanStack Query (nanti kita bahas). `useFetch` bagus buat belajar, tapi TanStack Query punya caching, deduplication, dan banyak fitur lain.

---

## ⏱️ useDebounce

Delay execution sampai user berhenti typing:

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// Usage
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  
  // Fetch hanya dipanggil 500ms setelah user berhenti ketik
  const { data: results } = useFetch<SearchResult[]>(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : ''
  )
  
  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        placeholder="Search tokens..."
      />
      {results?.map(r => <div key={r.id}>{r.name}</div>)}
    </div>
  )
}
```

---

## 📱 useMediaQuery

Responsive logic di JavaScript:

```tsx
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    mediaQuery.addEventListener('change', handler)
    // Set initial value
    setMatches(mediaQuery.matches)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])
  
  return matches
}

// Convenience hooks
function useIsMobile() {
  return useMediaQuery('(max-width: 768px)')
}

function useIsTablet() {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}

function useIsDesktop() {
  return useMediaQuery('(min-width: 1025px)')
}

function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

// Usage
function Navigation() {
  const isMobile = useIsMobile()
  
  if (isMobile) {
    return <MobileNav /> // Hamburger menu
  }
  
  return <DesktopNav /> // Full navbar
}
```

---

## 🔧 More Useful Custom Hooks

### useOnClickOutside

```tsx
function useOnClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler()
    }
    
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Usage — close dropdown when click outside
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  useOnClickOutside(ref, () => setIsOpen(false))
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      {isOpen && <div className="dropdown-menu">...</div>}
    </div>
  )
}
```

### useToggle

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  
  return { value, toggle, setTrue, setFalse } as const
}

// Usage
function Modal() {
  const { value: isOpen, setTrue: open, setFalse: close } = useToggle()
  
  return (
    <>
      <button onClick={open}>Open Modal</button>
      {isOpen && <ModalContent onClose={close} />}
    </>
  )
}
```

### useCopyToClipboard

```tsx
function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      
      // Reset after 2 seconds
      setTimeout(() => setCopiedText(null), 2000)
      return true
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopiedText(null)
      return false
    }
  }, [])
  
  return { copiedText, copy, isCopied: copiedText !== null }
}

// Usage
function WalletAddress({ address }: { address: string }) {
  const { copy, isCopied } = useCopyToClipboard()
  
  return (
    <div onClick={() => copy(address)}>
      <code>{address.slice(0, 6)}...{address.slice(-4)}</code>
      <span>{isCopied ? '✅ Copied!' : '📋'}</span>
    </div>
  )
}
```

---

## 📁 Organizing Custom Hooks

```
src/
└── hooks/
    ├── index.ts          # Re-export all hooks
    ├── useLocalStorage.ts
    ├── useFetch.ts
    ├── useDebounce.ts
    ├── useMediaQuery.ts
    ├── useOnClickOutside.ts
    ├── useToggle.ts
    └── useCopyToClipboard.ts
```

```typescript
// src/hooks/index.ts
export { useLocalStorage } from './useLocalStorage'
export { useFetch } from './useFetch'
export { useDebounce } from './useDebounce'
export { useMediaQuery, useIsMobile } from './useMediaQuery'
export { useOnClickOutside } from './useOnClickOutside'
export { useToggle } from './useToggle'
export { useCopyToClipboard } from './useCopyToClipboard'

// Import clean dari mana aja
import { useLocalStorage, useDebounce, useIsMobile } from '@/hooks'
```

---

## 🎯 Practice Exercises

### Exercise 1: useCountdown
Buat hook `useCountdown(targetDate)` yang return `{ days, hours, minutes, seconds, isExpired }`. Update setiap detik.

### Exercise 2: useGeolocation
Buat hook `useGeolocation()` yang return `{ latitude, longitude, error, isLoading }` menggunakan browser Geolocation API.

### Exercise 3: useKeyPress
Buat hook `useKeyPress(targetKey)` yang return `boolean` — `true` kalau key sedang ditekan. Contoh: `const isEscPressed = useKeyPress('Escape')`.

### Exercise 4: useIntersectionObserver
Buat hook yang detect apakah element visible di viewport. Berguna untuk lazy loading dan infinite scroll.

### Bonus Challenge 🏆
Buat package `@ethjkt/hooks` yang berisi minimal 5 custom hooks. Tulis unit tests pakai `@testing-library/react-hooks`. Setup build pakai `tsup` dan publish ke npm.

---

> 💡 **Key takeaway:** Custom hooks adalah superpower React. Setiap kali kalian copy-paste logic antar components, itu sinyal untuk extract ke custom hook. Think reusability!
