# 🧩 Quiz: API Integration

## 6 Coding Challenges

> **Topics:** React Query, Axios, data fetching patterns
> **Format:** Fix/implement code, verify with test cases
> **Time:** ~40 minutes

---

## Challenge 1: Fix the useQuery Hook

This hook fetches products but has several issues. Find and fix them all.

```javascript
// ❌ BUGGY — find and fix ALL issues
function useProducts(filters) {
  const query = useQuery(
    'products', // Issue 1: queryKey format
    async () => {
      const res = await axios.get('http://localhost:3000/api/products', { // Issue 2: hardcoded URL
        params: filters,
      });
      return res; // Issue 3: returning full response
    },
    // Issue 4: no error handling config
    // Issue 5: refetches on every window focus even for static data
  );

  return query;
}
```

**Test cases:**
```javascript
// After fix:
const { data, isLoading, error } = useProducts({ search: 'laptop' });
// data should be response.data (not full axios response)
// queryKey should include filters (so different filters = different cache)
// staleTime should be reasonable (e.g., 5 min)
// Should use env var for base URL
```

---

## Challenge 2: Implement Pagination Hook

Bikin hook buat paginated data fetching.

```javascript
function usePaginatedProducts() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const query = useQuery({
    // Implement:
    // - queryKey includes page and limit
    // - fetchFn calls GET /api/products?page={page}&limit={limit}
    // - keepPreviousData: true (smooth pagination, no flash)
    // - placeholderData: ??? (React Query v5 way)
  });

  const nextPage = () => {
    // Implement: go to next page (if available)
  };

  const prevPage = () => {
    // Implement: go to previous page (min page 1)
  };

  return {
    ...query,
    page,
    nextPage,
    prevPage,
    setPage,
  };
}
```

**Expected API response:**
```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

**Test cases:**
```javascript
const { data, page, nextPage, prevPage } = usePaginatedProducts();
expect(page).toBe(1);

nextPage();
expect(page).toBe(2);
// queryKey should change → new fetch triggered

prevPage();
expect(page).toBe(1);

prevPage(); // Already at page 1
expect(page).toBe(1); // Should stay at 1, not go to 0
```

---

## Challenge 3: Axios Interceptor — Request Timing

Bikin Axios interceptor yang log berapa lama setiap request takes.

```javascript
const api = axios.create({ baseURL: '/api' });

// Implement request interceptor — save start time
api.interceptors.request.use((config) => {
  // Save timestamp to config
  // ???
  return config;
});

// Implement response interceptor — calculate duration
api.interceptors.response.use(
  (response) => {
    // Calculate duration
    // Log: "[GET /products] 234ms"
    // If > 2000ms, log warning: "⚠️ Slow request: [GET /products] 3421ms"
    // ???
    return response;
  },
  (error) => {
    // Also log failed requests with duration
    // "[POST /products] FAILED 401 — 156ms"
    // ???
    return Promise.reject(error);
  }
);
```

**Test cases:**
```javascript
// After GET /products (took 234ms):
// Console: "[GET /products] 234ms"

// After slow GET /reports (took 3421ms):
// Console: "⚠️ Slow request: [GET /reports] 3421ms"

// After failed POST /products (401, took 156ms):
// Console: "[POST /products] FAILED 401 — 156ms"
```

---

## Challenge 4: Mutation with Cache Update

Implement `useUpdateProduct` yang update cache setelah mutation success — tanpa refetch.

```javascript
function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/products/${id}`, data).then((r) => r.data),

    onSuccess: (updatedProduct) => {
      // Implement: Update the product in ['products'] cache
      // WITHOUT refetching (setQueryData)
      
      // Also update ['product', id] cache if it exists
    },
  });
}
```

**Test cases:**
```javascript
// Before mutation, cache has:
// ['products'] → { data: [{ id: 1, name: 'Old Name', price: 100 }] }
// ['product', 1] → { id: 1, name: 'Old Name', price: 100 }

updateProduct.mutate({ id: 1, data: { name: 'New Name', price: 200 } });

// After success, cache should have:
// ['products'] → { data: [{ id: 1, name: 'New Name', price: 200 }] }
// ['product', 1] → { id: 1, name: 'New Name', price: 200 }
// NO network request to refetch
```

---

## Challenge 5: Error Retry with Backoff

Configure React Query to retry failed requests with **exponential backoff** — but ONLY for server errors (5xx). Don't retry client errors (4xx).

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Implement:
        // - Don't retry 4xx errors (400, 401, 403, 404)
        // - Retry 5xx errors up to 3 times
        // - Don't retry network errors more than 2 times
      },
      retryDelay: (attemptIndex) => {
        // Implement exponential backoff:
        // Attempt 0: 1000ms
        // Attempt 1: 2000ms
        // Attempt 2: 4000ms
        // Max: 30000ms
      },
    },
  },
});
```

**Test cases:**
```javascript
// 400 Bad Request → NO retry (return false immediately)
// 401 Unauthorized → NO retry
// 404 Not Found → NO retry
// 500 Internal Server Error → retry up to 3 times
// 503 Service Unavailable → retry up to 3 times
// Network Error → retry up to 2 times
// Retry delays: 1000ms, 2000ms, 4000ms
```

---

## Challenge 6: Dependent Queries

Implement two queries where the second depends on the first.

Scenario: Fetch user profile first, then fetch user's orders using the userId.

```javascript
function useUserDashboard() {
  // Query 1: Fetch current user
  const userQuery = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
  });

  // Query 2: Fetch user's orders — ONLY after we have userId
  const ordersQuery = useQuery({
    // Implement:
    // - queryKey includes userId
    // - ONLY runs when userQuery has data
    // - fetchFn uses userQuery.data.id
  });

  return {
    user: userQuery.data,
    orders: ordersQuery.data,
    isLoading: userQuery.isLoading || ordersQuery.isLoading,
    error: userQuery.error || ordersQuery.error,
  };
}
```

**Test cases:**
```javascript
// Step 1: userQuery fetches, ordersQuery is idle (enabled: false)
// Step 2: userQuery succeeds with { id: 5, name: 'Budi' }
// Step 3: ordersQuery now fetches GET /users/5/orders
// Step 4: Both data available

const { user, orders, isLoading } = useUserDashboard();
// Initially: isLoading = true, user = undefined, orders = undefined
// After user loads: user = { id: 5, ... }, orders still loading
// After orders load: orders = [{ id: 1, ... }], isLoading = false
```
