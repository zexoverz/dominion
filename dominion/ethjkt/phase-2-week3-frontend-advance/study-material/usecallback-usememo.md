# ⚡ useCallback & useMemo Deep Dive

## ETHJKT Phase 2 — Week 3 | Frontend Advance

---

## Masalah Dasar: Referential Equality

Sebelum masuk ke hooks-nya, kalian harus paham konsep ini dulu:

```javascript
// Primitives — compared by VALUE
'hello' === 'hello' // true
42 === 42           // true

// Objects/Arrays/Functions — compared by REFERENCE
{} === {}           // false ❌
[] === []           // false ❌
(() => {}) === (() => {}) // false ❌

const obj = { name: 'ETH' }
const obj2 = obj
obj === obj2        // true ✅ (same reference)
```

Kenapa ini penting? Karena di React, setiap kali component re-render, **semua function dan object di dalamnya dibuat ulang**:

```tsx
function Parent() {
  // Setiap render, function baru dibuat
  const handleClick = () => console.log('click')
  
  // Setiap render, object baru dibuat
  const style = { color: 'red' }
  
  return <Child onClick={handleClick} style={style} />
}
```

Ini berarti `Child` selalu dapat prop "baru" (walau nilainya sama), yang bisa trigger unnecessary re-render.

---

## 🧠 useMemo: Memoize Values

`useMemo` cache **hasil kalkulasi** supaya nggak dihitung ulang setiap render.

```typescript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
```

### Kapan Pakai useMemo?

#### 1. Expensive Calculations

```tsx
function ProductList({ products, searchTerm }: Props) {
  // ❌ Tanpa useMemo — filter & sort SETIAP render
  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.price - b.price)
  
  // ✅ Dengan useMemo — hanya recalculate kalau products atau searchTerm berubah
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...')  // Log ini cuma muncul kalau deps berubah
    return products
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.price - b.price)
  }, [products, searchTerm])
  
  return (
    <ul>
      {filteredProducts.map(p => (
        <li key={p.id}>{p.name} — ${p.price}</li>
      ))}
    </ul>
  )
}
```

#### 2. Stabilize Object/Array References

```tsx
function Map({ center }: { center: { lat: number; lng: number } }) {
  // ❌ New object every render — MapComponent re-renders unnecessarily
  const options = { zoom: 12, center }
  
  // ✅ Stable reference — MapComponent only re-renders when center changes
  const options = useMemo(() => ({ zoom: 12, center }), [center])
  
  return <MapComponent options={options} />
}
```

#### 3. Derived State

```tsx
function OrderSummary({ items }: { items: CartItem[] }) {
  const { subtotal, tax, total, itemCount } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const tax = subtotal * 0.11 // PPN 11%
    const total = subtotal + tax
    const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
    return { subtotal, tax, total, itemCount }
  }, [items])
  
  return (
    <div>
      <p>{itemCount} items</p>
      <p>Subtotal: Rp {subtotal.toLocaleString()}</p>
      <p>PPN (11%): Rp {tax.toLocaleString()}</p>
      <p><strong>Total: Rp {total.toLocaleString()}</strong></p>
    </div>
  )
}
```

---

## 🔗 useCallback: Memoize Functions

`useCallback` cache **function reference** supaya nggak dibuat ulang setiap render.

```typescript
const memoizedFn = useCallback(() => {
  doSomething(a, b)
}, [a, b])

// Equivalent to:
const memoizedFn = useMemo(() => {
  return () => doSomething(a, b)
}, [a, b])
```

### Kapan Pakai useCallback?

#### 1. Preventing Child Re-renders (dengan React.memo)

```tsx
// Child yang di-wrap React.memo
const ExpensiveChild = React.memo(function ExpensiveChild({ 
  onClick, 
  data 
}: { 
  onClick: () => void
  data: string 
}) {
  console.log('ExpensiveChild rendered')
  return <button onClick={onClick}>{data}</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('ETH Jakarta')
  
  // ❌ Tanpa useCallback — handleClick baru setiap render
  // → ExpensiveChild SELALU re-render walau React.memo
  const handleClick = () => console.log('clicked')
  
  // ✅ Dengan useCallback — reference stable
  // → ExpensiveChild NGGAK re-render kalau count berubah
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <ExpensiveChild onClick={handleClick} data={name} />
    </div>
  )
}
```

#### 2. Dependency di useEffect

```tsx
function SearchComponent({ userId }: { userId: string }) {
  const [results, setResults] = useState([])
  
  // ✅ Stable function reference
  const fetchResults = useCallback(async () => {
    const res = await fetch(`/api/users/${userId}/search`)
    const data = await res.json()
    setResults(data)
  }, [userId])
  
  useEffect(() => {
    fetchResults()
  }, [fetchResults]) // Safe dependency — won't cause infinite loop
  
  return <ResultList results={results} />
}
```

#### 3. Passing to Custom Hooks

```tsx
function useDebounce(callback: () => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  useEffect(() => {
    timeoutRef.current = setTimeout(callback, delay)
    return () => clearTimeout(timeoutRef.current)
  }, [callback, delay]) // callback harus stable!
}

// Usage
function Search() {
  const [query, setQuery] = useState('')
  
  const search = useCallback(() => {
    fetch(`/api/search?q=${query}`)
  }, [query])
  
  useDebounce(search, 500)
}
```

---

## 🤝 The React.memo + useCallback + useMemo Combo

Ini "holy trinity" optimization di React:

```tsx
// React.memo — skip re-render kalau props nggak berubah
const TodoItem = React.memo(function TodoItem({ 
  todo, 
  onToggle, 
  onDelete 
}: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  console.log(`Rendering TodoItem: ${todo.text}`)
  
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>🗑️</button>
    </li>
  )
})

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  
  // useCallback — stable function references
  const handleToggle = useCallback((id: string) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }, [])
  
  const handleDelete = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])
  
  // useMemo — expensive filtered list
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed)
      case 'completed': return todos.filter(t => t.completed)
      default: return todos
    }
  }, [todos, filter])
  
  // useMemo — stats
  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos])
  
  return (
    <div>
      <h1>Todos ({stats.active} active)</h1>
      
      <div>
        <button onClick={() => setFilter('all')}>All ({stats.total})</button>
        <button onClick={() => setFilter('active')}>Active ({stats.active})</button>
        <button onClick={() => setFilter('completed')}>Done ({stats.completed})</button>
      </div>
      
      <ul>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  )
}
```

Dengan combo ini:
- `TodoItem` cuma re-render kalau `todo` prop-nya berubah
- `handleToggle` dan `handleDelete` punya reference yang stable
- `filteredTodos` cuma recalculate kalau `todos` atau `filter` berubah

---

## ⚠️ Kapan NGGAK Perlu Optimization

**JANGAN premature optimize!** Majority kasus, React udah cukup cepat tanpa `useMemo`/`useCallback`.

```tsx
// ❌ Overkill — simple calculation, nggak perlu memoize
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName])

// ✅ Just do it directly
const fullName = `${firstName} ${lastName}`

// ❌ Overkill — no React.memo on child, useCallback sia-sia
const handleClick = useCallback(() => {
  console.log('click')
}, [])
return <button onClick={handleClick}>Click</button>

// ✅ Langsung aja
return <button onClick={() => console.log('click')}>Click</button>
```

### Rules of Thumb

1. **Measure first!** Pakai React DevTools Profiler sebelum optimize
2. **useCallback butuh React.memo** — tanpa `React.memo` di child, `useCallback` sia-sia
3. **useMemo untuk kalkulasi yang ACTUALLY expensive** — filtering 10 items ≠ expensive
4. **useMemo untuk stabilize references** yang jadi dependency di hooks lain

### Checklist: Perlu Optimize?

- [ ] Component re-render terasa laggy? (> 16ms)
- [ ] List punya 100+ items?
- [ ] Expensive computation (sorting, filtering, parsing)?
- [ ] Child component berat (chart, map, canvas)?
- [ ] Object/function jadi dependency di useEffect?

Kalau jawaban semua "no", skip optimization. Keep it simple!

---

## 🔬 React Compiler (React 19+)

Fun fact: React team lagi develop **React Compiler** yang bakal auto-memoize semuanya. Jadi di masa depan, kalian mungkin nggak perlu manual `useMemo`/`useCallback` lagi!

```tsx
// React Compiler will auto-optimize this
function TodoList({ todos, filter }) {
  const filteredTodos = todos.filter(t => 
    filter === 'all' ? true : t.status === filter
  )
  
  return filteredTodos.map(t => <TodoItem key={t.id} todo={t} />)
}
// Compiler auto-adds memoization behind the scenes ✨
```

Tapi sampai compiler mature, manual optimization masih penting untuk production apps.

---

## 🎯 Practice Exercises

### Exercise 1: Expensive List
Buat component yang render 1000 items. Tanpa optimization, ketik di search input bakal laggy. Optimize pakai `useMemo` untuk filtering dan `React.memo` untuk list items.

### Exercise 2: Multi-Counter
Buat app dengan 5 counter. Klik satu counter nggak boleh re-render counter lain. Pakai `React.memo` + `useCallback`.

### Exercise 3: Data Table
Buat table component yang support sorting (klik header). Pakai `useMemo` untuk sorted data dan `useCallback` untuk sort handler.

### Exercise 4: Profiling
Pakai React DevTools Profiler untuk measure render time sebelum dan sesudah optimization di Exercise 1. Screenshot hasilnya!

### Bonus Challenge 🏆
Buat "Crypto Price Tracker" yang update harga setiap 2 detik (mock data). Table punya 50+ coins. Optimize supaya hanya row yang harganya berubah yang re-render.

---

> 💡 **Key takeaway:** `useMemo` dan `useCallback` itu tools, bukan rules. Profile dulu, optimize kemudian. Premature optimization is the root of all evil! — Donald Knuth
