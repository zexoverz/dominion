# 🏗️ State Management Patterns

> *"State itu kayak inventory game RPG — kalau nggak dikelola, bakal berantakan dan bikin lag."*

## Apa Itu State?

Oke, sebelum kita masuk ke pattern yang fancy-fancy, kita bahas dulu fundamental-nya. **State** adalah data yang berubah-ubah selama aplikasi berjalan. Beda sama props yang datang dari parent, state itu *owned* dan *managed* oleh component itu sendiri (atau oleh sesuatu di atas).

Contoh state sehari-hari:
- Form input yang lagi diketik user
- Status loading saat fetch data
- List item yang ditampilkan dari API
- User yang sedang login
- Dark mode on/off

```jsx
// Ini state paling basic
const [count, setCount] = useState(0);
const [username, setUsername] = useState('');
const [items, setItems] = useState([]);
```

## Local State vs Global State

### 🏠 Local State

Local state itu state yang **cuma dipake di satu component** (atau component + anak-anaknya yang deket). Pake `useState` atau `useReducer`.

```jsx
function SearchBar() {
  // Local state — cuma SearchBar yang butuh
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={isFocused ? 'focused' : ''}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Cari sesuatu..."
      />
    </div>
  );
}
```

**Kapan pake local state?**
- Data cuma relevan buat 1 component
- Form input, toggle, modal open/close
- UI state yang nggak perlu di-share

### 🌍 Global State

Global state itu state yang **dibutuhin banyak component** di berbagai level tree. Contohnya: data user yang login, theme, language, shopping cart.

```jsx
// Ini dibutuhin di mana-mana:
// - Navbar (tampilkan nama user)
// - Profile page (tampilkan detail)
// - Settings (edit profile)
// - Comment section (tampilkan avatar)
const currentUser = { id: 1, name: 'Budi', role: 'admin' };
```

**Kapan pake global state?**
- Data diakses banyak component yang jaraknya jauh di tree
- Auth/user data
- Theme/language preferences
- Shopping cart, notifications

## Lifting State Up

Kadang dua sibling component butuh data yang sama. Solusinya? **Angkat state ke parent terdekat** yang membungkus keduanya.

```jsx
// ❌ SEBELUM: Dua component punya state sendiri, nggak sync
function TemperatureInput() {
  const [temp, setTemp] = useState('');
  return <input value={temp} onChange={e => setTemp(e.target.value)} />;
}

// ✅ SESUDAH: State diangkat ke parent
function TemperatureCalculator() {
  const [celsius, setCelsius] = useState('');

  const fahrenheit = celsius ? (parseFloat(celsius) * 9/5 + 32).toString() : '';

  return (
    <div>
      <h3>Celsius</h3>
      <input
        value={celsius}
        onChange={e => setCelsius(e.target.value)}
      />
      <h3>Fahrenheit</h3>
      <input value={fahrenheit} readOnly />
    </div>
  );
}
```

**Aturan lifting state:**
1. Cari parent terdekat yang membungkus semua component yang butuh state itu
2. Pindahkan state ke parent tersebut
3. Pass state dan setter sebagai props ke children

## 😱 Props Drilling — The Problem

Nah, ini masalah klasik. Ketika kamu lift state ke atas, tapi component yang butuh data itu ada jauh di bawah tree, kamu harus **passing props melewati banyak level component** yang sebenernya nggak butuh data itu.

```jsx
// Props drilling neraka 🔥
function App() {
  const [user, setUser] = useState({ name: 'Budi', theme: 'dark' });

  return <Layout user={user} />;
}

function Layout({ user }) {
  // Layout nggak butuh user, cuma nge-pass doang
  return (
    <div>
      <Header user={user} />
      <Main user={user} />
    </div>
  );
}

function Header({ user }) {
  // Header juga cuma nge-pass
  return (
    <nav>
      <Logo />
      <UserMenu user={user} />
    </nav>
  );
}

function UserMenu({ user }) {
  // Akhirnya sampe sini, yang beneran butuh!
  return <span>Hi, {user.name}!</span>;
}
```

Kebayang nggak kalau tree-nya 10 level? 😵

**Masalah props drilling:**
1. **Boilerplate** — Banyak component jadi "middleman" yang cuma passing props
2. **Tight coupling** — Refactor jadi susah, hapus satu level = update semua
3. **Readability** — Susah trace dari mana data datang
4. **Maintenance** — Tambah prop baru = update semua level

## 📊 The State Management Spectrum

Ini dia panorama tools yang bisa kamu pake, dari yang paling simpel sampai yang paling powerful:

### Level 1: `useState` + `useReducer`

```jsx
// useState — untuk state sederhana
const [count, setCount] = useState(0);

// useReducer — untuk state complex dengan banyak action
const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
}
```

**Cocok untuk:** Local state, form yang complex, state machine sederhana.

### Level 2: React Context

```jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MainApp />
    </ThemeContext.Provider>
  );
}

// Di component manapun, langsung akses!
function DeepNestedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme('light')}>Switch theme</button>;
}
```

**Cocok untuk:** Data yang jarang berubah (theme, auth, locale). BUKAN untuk state yang sering update.

### Level 3: Zustand

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

// Di component manapun
function BearCounter() {
  const bears = useStore((state) => state.bears);
  return <h1>{bears} bears around here</h1>;
}
```

**Cocok untuk:** Global state yang sering update, medium-sized apps, ketika Context mulai lemot.

### Level 4: Redux Toolkit

```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
  },
});

const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});
```

**Cocok untuk:** Large-scale apps, tim besar, butuh predictability dan devtools yang mature.

## 🎯 Decision Tree — Kapan Pake Apa?

```
Butuh state di 1 component saja?
  └─ YES → useState / useReducer
  └─ NO → Butuh di beberapa component?
           └─ Sibling/nearby → Lift state up
           └─ Jauh di tree?
                └─ Data jarang berubah? → Context
                └─ Data sering berubah?
                     └─ App kecil-medium → Zustand
                     └─ App besar, tim besar → Redux Toolkit
```

### Real-world Example

Bayangin kamu bikin e-commerce:

| State | Solusi | Alasan |
|-------|--------|--------|
| Form input search | `useState` | Local, cuma di SearchBar |
| Modal open/close | `useState` | Local UI state |
| Theme dark/light | Context | Jarang berubah, banyak consumer |
| Auth/user data | Context + React Query | Jarang berubah, perlu di mana-mana |
| Shopping cart | Zustand | Sering update, banyak component akses |
| Product catalog | React Query | Server state, bukan client state |

## ⚡ Server State vs Client State

Ini konsep penting yang sering dilupain:

**Client State** = data yang *origin*-nya di browser
- UI state (modal, sidebar, theme)
- Form data sebelum submit
- Client-side filters/sort preferences

**Server State** = data yang *origin*-nya di server/API
- User profile dari database
- List products
- Comments, posts, dll

```jsx
// ❌ JANGAN kelola server state pake useState
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/products')
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);

// ✅ PAKE React Query untuk server state
const { data: products, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products').then(r => r.json()),
});
```

React Query, SWR, dan sejenisnya itu **bukan state management** — mereka **server state synchronization tools**. Bedain!

## 🧩 Combining Solutions

Di real project, kamu biasanya pake **kombinasi**:

```
React Query    → Server state (API data)
Zustand        → Global client state (cart, preferences)
Context        → Rarely-changing globals (theme, auth)
useState       → Local component state (forms, UI)
```

Nggak harus pilih satu. Mix and match sesuai kebutuhan!

## 🏋️ Latihan

### Exercise 1: Identifikasi State
Untuk aplikasi todo list dengan fitur:
- Login/register
- List todos per user
- Filter (all/active/completed)
- Dark mode toggle

Klasifikasikan setiap state dan tentukan solusi yang cocok!

### Exercise 2: Refactor Props Drilling
Ambil kode props drilling di atas (App → Layout → Header → UserMenu). Refactor menggunakan:
1. React Context
2. Zustand

Bandingkan hasilnya — mana yang lebih clean?

### Exercise 3: State Audit
Buka project React yang pernah kamu bikin. Audit semua state-nya:
- Mana yang harusnya local tapi kamu bikin global?
- Mana yang harusnya pake React Query tapi kamu pake useState + useEffect?
- Ada props drilling yang bisa dihilangin?

---

> 💡 **Pro tip:** Start simple. Pake `useState` dulu. Kalau mulai ribet, baru upgrade ke Context atau Zustand. Premature optimization itu musuh productivity. Build dulu, optimize kemudian.

**Next up:** Deep dive ke React Context → Zustand → React Query. Let's go! 🚀
