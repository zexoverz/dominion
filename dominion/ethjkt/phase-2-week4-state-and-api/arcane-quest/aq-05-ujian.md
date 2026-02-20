# ⚔️ Arcane Quest 05: Ujian Week 4

## 📝 State Management & API Integration Exam

> **Type:** Individual exam
> **Duration:** 120 menit
> **Open book:** Boleh buka materi, TAPI ngga boleh copy-paste solution
> **Tools:** VS Code, browser, terminal

---

## Rules

1. Kerjain sendiri — no collaboration
2. Boleh buka dokumentasi (React, React Query, Zustand, MDN)
3. Boleh buka materi Week 4
4. NGGA boleh pake AI / ChatGPT / Copilot
5. Commit setiap challenge selesai
6. Total 6 challenges, masing-masing independent

---

## Challenge 1: Fix the Race Condition (15 points)

Code di bawah punya **race condition bug**. Ketika user type cepat di search, hasil yang tampil kadang salah (hasil dari search sebelumnya yang response-nya lebih lambat).

**Fix the bug.** Jangan ubah API call, cuma fix di React side.

```jsx
// BUG: Race condition di search
function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // BUG: Kalo user type "lap" -> "lapt" -> "laptop" cepat,
    // response "lap" bisa datang SETELAH response "laptop"
    // dan overwrite results yang benar
    api.get(`/api/products?search=${query}`)
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {loading && <p>Loading...</p>}
      <ul>
        {results.map((p) => (
          <li key={p.id}>{p.name} - Rp {p.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Yang harus kalian lakukan:**
1. Fix race condition (hint: AbortController atau flag di cleanup)
2. Tambah debounce (300ms) biar ngga kirim request tiap keystroke
3. Handle error state

**Test cases:**
- ✅ Type "laptop" cepat → hanya tampil hasil "laptop", bukan hasil partial
- ✅ Clear search → results kosong
- ✅ API error → tampil error message
- ✅ Ngga kirim request setiap keystroke (debounced)

---

## Challenge 2: Implement Optimistic Delete with Rollback (20 points)

Implementasi `useDeleteProduct` hook yang:
1. **Optimistic update** — hapus product dari list SEBELUM server respond
2. **Rollback** kalo server return error — product muncul lagi di list
3. **Success toast** kalo berhasil
4. **Error toast** kalo gagal

```javascript
// Implement this hook
function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: ???
    // onMutate: ??? (optimistic update)
    // onError: ??? (rollback)
    // onSuccess: ??? (toast)
    // onSettled: ??? (invalidate)
  });
}

// Usage:
// const deleteProduct = useDeleteProduct();
// deleteProduct.mutate(productId);
```

**Asumsi:**
- Products di-cache di queryKey `['products']`
- Cache structure: `{ data: [...products], total: number }`
- API endpoint: `DELETE /api/products/:id`

**Test cases:**
- ✅ Product langsung hilang dari list saat klik delete
- ✅ Kalo server error 400, product muncul lagi di list (rollback)
- ✅ Success → toast "Product deleted"
- ✅ Error → toast "Failed to delete product"
- ✅ Setelah settled, cache di-invalidate (re-fetch from server)

---

## Challenge 3: Build Auth with Token Refresh (20 points)

Implementasi Axios interceptor yang:
1. Attach token ke setiap request
2. Ketika response 401 (token expired):
   - Call refresh token endpoint
   - Retry original request dengan token baru
   - Kalo refresh juga gagal → logout

```javascript
// Implement the interceptors
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Request interceptor — attach token
api.interceptors.request.use(
  // ???
);

// Response interceptor — handle 401 + refresh
api.interceptors.response.use(
  // ???
);

// Refresh token function
async function refreshToken() {
  // Call POST /api/auth/refresh with refreshToken from localStorage
  // Return new access token
  // ???
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}
```

**Asumsi:**
- Access token di `localStorage.getItem('token')`
- Refresh token di `localStorage.getItem('refreshToken')`
- Refresh endpoint: `POST /api/auth/refresh` body: `{ refreshToken }`
- Response: `{ token: "new-access-token" }`

**Test cases:**
- ✅ Normal request → token attached di header
- ✅ 401 response → refresh token → retry original request
- ✅ Refresh berhasil → new token saved di localStorage
- ✅ Refresh gagal (refresh token expired) → logout
- ✅ Multiple 401s simultaneously → only refresh ONCE (no race condition)

---

## Challenge 4: Zustand Store with Persist (15 points)

Bikin Zustand store untuk shopping cart yang:
1. Add item (kalau udah ada, increment quantity)
2. Remove item
3. Update quantity
4. Calculate total price
5. **Persist ke localStorage** (cart survive page refresh)
6. Clear cart

```javascript
// Implement this store
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      // addItem: ???
      // removeItem: ???
      // updateQuantity: ???
      // getTotal: ???
      // getItemCount: ???
      // clearCart: ???
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

**Item shape:**
```javascript
{
  id: 1,
  name: "Laptop ASUS",
  price: 12000000,
  quantity: 2,
}
```

**Test cases:**
- ✅ `addItem({id:1, name:"A", price:100})` → items length = 1
- ✅ `addItem({id:1, ...})` again → quantity = 2 (bukan item baru)
- ✅ `addItem({id:2, name:"B", price:200})` → items length = 2
- ✅ `updateQuantity(1, 5)` → item 1 quantity = 5
- ✅ `updateQuantity(1, 0)` → item 1 removed
- ✅ `removeItem(1)` → item 1 gone
- ✅ `getTotal()` → sum of (price × quantity) for all items
- ✅ `getItemCount()` → sum of all quantities
- ✅ `clearCart()` → items = []
- ✅ Refresh page → cart masih ada (persisted)

---

## Challenge 5: Protected Route with Loading State (15 points)

Bikin `ProtectedRoute` component yang:
1. Check apakah ada token di localStorage
2. Verify token dengan GET `/api/auth/me`
3. Saat verifying, tampilkan loading spinner
4. Kalo valid → render children
5. Kalo invalid / no token → redirect ke `/login`
6. Save return URL (setelah login, redirect back ke halaman yang dimau)

```jsx
// Implement this component
function ProtectedRoute({ children }) {
  // ???
}

// Usage:
// <Route path="/dashboard" element={
//   <ProtectedRoute>
//     <DashboardPage />
//   </ProtectedRoute>
// } />
```

**Test cases:**
- ✅ No token → redirect ke `/login`
- ✅ Valid token → render children
- ✅ Invalid token (401) → redirect ke `/login`, clear token
- ✅ While verifying → show loading spinner
- ✅ Setelah login, redirect back ke original URL (e.g., `/dashboard`)

---

## Challenge 6: Custom useApi Hook (15 points)

Bikin custom hook `useApi` yang wrap React Query dengan:
1. Auto error handling (toast on error)
2. Auto loading state
3. Auto refetch on window focus
4. Configurable staleTime
5. TypeScript-friendly (bonus: generic types)

```javascript
// Implement this hook
function useApi(key, fetchFn, options = {}) {
  // Should return everything useQuery returns
  // PLUS: auto toast on error, configurable defaults
  // ???
}

// Usage:
function ProductList() {
  const { data, isLoading, error, refetch } = useApi(
    ['products'],
    () => api.get('/products').then(r => r.data),
    {
      staleTime: 5 * 60 * 1000,
      errorMessage: 'Gagal load products',
      onSuccess: (data) => console.log('Products loaded:', data.length),
    }
  );
}

function ProductDetail({ id }) {
  const { data } = useApi(
    ['product', id],
    () => api.get(`/products/${id}`).then(r => r.data),
    {
      enabled: !!id,
      errorMessage: 'Product not found',
    }
  );
}
```

**Test cases:**
- ✅ Fetches data correctly
- ✅ Shows toast on error with custom errorMessage
- ✅ Default staleTime 30 seconds (overridable)
- ✅ `enabled` option works (ngga fetch kalo false)
- ✅ Returns all useQuery properties (data, isLoading, error, refetch)
- ✅ onSuccess callback works

---

## Scoring

| Challenge | Points | Topic |
|---|---|---|
| 1. Fix Race Condition | 15 | useEffect, AbortController, debounce |
| 2. Optimistic Delete | 20 | React Query mutations, cache management |
| 3. Auth Token Refresh | 20 | Axios interceptors, token lifecycle |
| 4. Zustand Cart Store | 15 | Zustand, persist middleware, computed values |
| 5. Protected Route | 15 | Auth verification, routing, loading states |
| 6. Custom useApi Hook | 15 | React Query wrapper, DX improvement |
| **TOTAL** | **100** |

### Grade Scale

| Score | Grade |
|---|---|
| 90-100 | A — Master of State & API |
| 80-89 | B — Strong understanding |
| 70-79 | C — Good, keep practicing |
| 60-69 | D — Passing, review weak areas |
| < 60 | F — Need to review Week 4 materials |

---

## Submission

1. Create new repo: `week4-exam-[nama]`
2. Each challenge in separate file: `challenge-1.jsx`, `challenge-2.jsx`, etc.
3. Include `README.md` with notes on your approach
4. Push to GitHub
5. Submit link before deadline

Good luck! May the arcane knowledge serve you well. 🧙‍♂️✨
