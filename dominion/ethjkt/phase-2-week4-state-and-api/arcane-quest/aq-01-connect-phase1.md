# ⚔️ Arcane Quest 01: Arcane Bridge

## 🌉 Connect React to YOUR Phase 1 Express API

> **Difficulty:** ⭐⭐⭐ (Intermediate)
> **Type:** MANDATORY — Harus dikerjain semua orang
> **Type:** MANDATORY
> **Deploy:** Frontend di Vercel, Backend di Railway

---

## Misi

Kalian udah bikin **Inventory System API** di Phase 1. Sekarang waktunya connect React frontend ke API itu. Ini bukan latihan — ini **project beneran**. Frontend + Backend, full stack.

Kalian bakal:
1. Login ke API Phase 1 kalian
2. Fetch dan display products
3. Full CRUD (Create, Read, Update, Delete) lewat React
4. Error handling yang proper
5. Deploy keduanya ke internet

---

## Phase 1 API Endpoint Reference

Ini endpoint dari Inventory System yang kalian bikin di Phase 1. Kalo kalian ubah waktu Phase 1, sesuaikan:

### Auth Endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| POST | `/api/auth/register` | Register user baru | ❌ |
| POST | `/api/auth/login` | Login, return JWT token | ❌ |
| GET | `/api/auth/me` | Get current user profile | ✅ |

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Budi",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Product Endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| GET | `/api/products` | Get all products (with pagination, search) | ✅ |
| GET | `/api/products/:id` | Get single product | ✅ |
| POST | `/api/products` | Create new product | ✅ |
| PUT | `/api/products/:id` | Update product | ✅ |
| DELETE | `/api/products/:id` | Delete product | ✅ |

**Query Parameters (GET /api/products):**
- `page` (number) — default 1
- `limit` (number) — default 10
- `search` (string) — search by name
- `category` (string) — filter by category
- `sortBy` (string) — field to sort by
- `order` (string) — 'asc' or 'desc'

**Create Product Body:**
```json
{
  "name": "Laptop ASUS ROG",
  "price": 15000000,
  "stock": 10,
  "category": "Electronics",
  "description": "Gaming laptop with RTX 4060"
}
```

### Category Endpoints (Kalo kalian bikin)

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| GET | `/api/categories` | Get all categories | ✅ |
| POST | `/api/categories` | Create category | ✅ |

---

## Requirements

### Level 1: Basic (Minimum buat lulus) ⭐

1. **Login Page**
   - Form email + password
   - Call POST `/api/auth/login`
   - Store token di localStorage
   - Redirect ke Dashboard setelah login
   - Show error kalo credentials salah

2. **Product List Page**
   - Fetch products dari GET `/api/products`
   - Display dalam table atau card grid
   - Loading state (skeleton/spinner)
   - Error state kalo API fail

3. **Protected Routes**
   - Dashboard dan Products cuma bisa diakses kalo udah login
   - Redirect ke Login kalo belum login
   - Logout button yang clear token

4. **Axios Setup**
   - Base URL dari environment variable
   - Auth interceptor (attach token)
   - Response interceptor (handle 401)

### Level 2: Complete CRUD ⭐⭐

Semua dari Level 1, PLUS:

5. **Create Product**
   - Form dengan validation (React Hook Form + Zod)
   - Call POST `/api/products`
   - Success toast notification
   - Redirect back to list

6. **Edit Product**
   - Pre-fill form with existing data
   - Call PUT `/api/products/:id`
   - Optimistic update (optional)

7. **Delete Product**
   - Confirmation modal ("Yakin mau hapus?")
   - Call DELETE `/api/products/:id`
   - Remove from list after success

8. **Search & Filter**
   - Search input (debounced)
   - Category filter dropdown
   - Pagination controls

### Level 3: Professional ⭐⭐⭐

Semua dari Level 2, PLUS:

9. **State Management Proper**
   - React Query buat semua API calls
   - Zustand buat UI state (sidebar, theme)
   - Auth di Context atau Zustand

10. **Polish**
    - Responsive design
    - Loading skeletons (bukan spinner)
    - Empty state illustrations
    - Toast notifications (react-hot-toast)
    - Proper error boundaries

11. **Deployment**
    - Frontend deploy ke Vercel
    - Backend deploy ke Railway
    - CORS configured
    - Environment variables set
    - Both publicly accessible

---

## Tech Stack

```
Frontend:
  - React (Vite)
  - React Router DOM
  - Axios
  - TanStack React Query
  - Zustand (UI state)
  - React Hook Form + Zod
  - Tailwind CSS (atau CSS framework pilihan)
  - react-hot-toast

Backend (existing dari Phase 1):
  - Express.js
  - JWT authentication
  - PostgreSQL / MySQL
  - cors middleware
```

---

## Project Structure

```
inventory-frontend/
├── .env.development
├── .env.production
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI (Button, Input, Modal, Skeleton)
│   │   ├── layout/          # Navbar, Sidebar, Footer
│   │   ├── products/        # ProductCard, ProductForm, ProductTable
│   │   └── auth/            # LoginForm, ProtectedRoute
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProductListPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductCreatePage.jsx
│   │   └── ProductEditPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProducts.js
│   │   ├── useCreateProduct.js
│   │   ├── useUpdateProduct.js
│   │   └── useDeleteProduct.js
│   ├── stores/
│   │   └── uiStore.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── axios.js
│   │   └── queryClient.js
│   ├── config/
│   │   └── index.js
│   └── App.jsx
```

---

## Grading Criteria

| Criteria | Points | Description |
|---|---|---|
| **Login + Auth Flow** | 20 | Login works, token stored, protected routes, logout |
| **Product List** | 15 | Fetch, display, loading state, error state |
| **CRUD Operations** | 20 | Create, edit, delete all working |
| **Search & Filter** | 10 | Debounced search, category filter |
| **State Management** | 10 | Proper use of React Query, Zustand/Context |
| **Error Handling** | 10 | All error states covered, user-friendly messages |
| **Code Quality** | 5 | Clean code, good structure, no console.log |
| **Deployment** | 10 | Both FE + BE deployed and working |
| **TOTAL** | **100** | |

### Grade Scale

| Score | Grade | Verdict |
|---|---|---|
| 90-100 | A | Exceptional — ready for real projects |
| 80-89 | B | Great — solid understanding |
| 70-79 | C | Good — needs some polish |
| 60-69 | D | Passing — review weak areas |
| < 60 | F | Need to redo — ask for help! |

---

## Deployment Guide (Quick)

### Frontend → Vercel

```bash
# 1. Push code ke GitHub
git add . && git commit -m "feat: inventory frontend" && git push

# 2. Go to vercel.com, import repo
# 3. Set environment variables:
#    VITE_API_URL = https://your-backend.railway.app/api
# 4. Deploy!
```

### Backend → Railway

```bash
# 1. Go to railway.app, new project from GitHub
# 2. Set environment variables:
#    DATABASE_URL, JWT_SECRET, PORT, ALLOWED_ORIGINS
# 3. ALLOWED_ORIGINS = https://your-frontend.vercel.app
# 4. Deploy!
```

### Post-Deploy Checklist

- [ ] Frontend loads without errors
- [ ] Can login
- [ ] Can see products
- [ ] Can create/edit/delete products
- [ ] CORS working (no errors in console)
- [ ] HTTPS on both frontend and backend

---

## Tips

1. **Start with Postman** — test your Phase 1 API first. Make sure it still works.
2. **Build incrementally** — Login first, then list, then CRUD.
3. **Git commit often** — save progress.
4. **Don't overcomplicate** — start simple, add features.
5. **Ask for help** — kalo stuck lebih dari 30 menit di satu masalah.

Good luck, arcane developers! 🌉✨
