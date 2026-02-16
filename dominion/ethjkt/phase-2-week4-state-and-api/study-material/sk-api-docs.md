# 📖 Soft Skills: Reading API Documentation

## ETHJKT — Phase 2, Week 4 | Arcane Quest Series

> *"Seorang Summoner yang nggak bisa baca peta, nggak akan pernah sampai tujuan. API docs adalah peta-mu di dunia backend."*

---

## 🎯 Learning Objectives

Setelah modul ini, kamu bisa:

1. Membaca dan memahami Swagger/OpenAPI documentation
2. Menggunakan Postman atau Thunder Client untuk test API
3. Memahami HTTP status codes dan artinya
4. Mengerti konsep rate limiting dan API versioning
5. Test endpoints sebelum mulai coding frontend

---

## 🤔 Kenapa Harus Bisa Baca API Docs?

Di dunia kerja nyata, kamu **jarang** bikin backend sendiri. Biasanya:

- Backend team kasih API docs → kamu bikin frontend
- Pakai third-party API (payment gateway, maps, social media)
- Integrasi dengan service lain

Kalau nggak bisa baca docs, kamu bakal:
- Bolak-balik tanya backend team (mereka juga sibuk)
- Salah kirim request format → error terus
- Buang waktu debug yang seharusnya nggak perlu

**Skill baca API docs = self-sufficient developer.** 💪

---

## 📜 Part 1: Swagger / OpenAPI

### Apa itu OpenAPI?

OpenAPI (dulu Swagger) adalah **standar** untuk mendokumentasikan REST API. Formatnya JSON atau YAML, dan bisa di-render jadi interactive docs.

### Anatomi Swagger UI

Kalau kamu buka Swagger docs (biasanya di `/api-docs` atau `/docs`), kamu bakal liat:

```
┌─────────────────────────────────────────┐
│  API Title: Arcane Tasks API v1.0       │
│  Base URL: https://api.arcane.gg/v1     │
├─────────────────────────────────────────┤
│  🔐 Authorize [Bearer Token]           │
├─────────────────────────────────────────┤
│  📁 Auth                                │
│    POST /auth/register                  │
│    POST /auth/login                     │
│                                         │
│  📁 Tasks                               │
│    GET    /tasks          [🔒]          │
│    POST   /tasks          [🔒]          │
│    PUT    /tasks/{id}     [🔒]          │
│    DELETE /tasks/{id}     [🔒]          │
└─────────────────────────────────────────┘
```

### Cara Baca Endpoint

Setiap endpoint punya info ini:

```yaml
POST /auth/login
  Summary: Login user
  Description: Authenticate user and return JWT token

  Request Body (application/json):
    required: true
    schema:
      email:    string (required) - User email
      password: string (required) - User password

  Responses:
    200 - Success:
      {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "user": {
          "id": 1,
          "name": "Summoner",
          "email": "summoner@arcane.gg"
        }
      }
    400 - Bad Request:
      { "message": "Email and password required" }
    401 - Unauthorized:
      { "message": "Invalid credentials" }
```

### Yang Harus Kamu Perhatikan

1. **HTTP Method** — GET, POST, PUT, DELETE
2. **URL Path** — Endpoint path, termasuk path parameters (`:id` atau `{id}`)
3. **Request Body** — Data apa yang harus dikirim (dan formatnya)
4. **Headers** — Biasanya `Content-Type` dan `Authorization`
5. **Query Parameters** — Filter, pagination (`?page=1&limit=10`)
6. **Response** — Shape data yang dikembalikan
7. **Status Codes** — 200, 201, 400, 401, 404, 500...
8. **Auth requirement** — Butuh token atau public?

### Contoh Baca: "GET /tasks"

```yaml
GET /tasks
  Auth: Bearer Token required 🔒
  
  Query Parameters:
    page     (number, optional) - Default: 1
    limit    (number, optional) - Default: 10
    status   (string, optional) - "active" | "completed"
    search   (string, optional) - Search by title

  Response 200:
    {
      "data": [
        {
          "id": 1,
          "title": "Belajar React Query",
          "completed": false,
          "createdAt": "2026-02-16T10:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 42,
        "totalPages": 5
      }
    }
```

Dari docs ini, kamu langsung tau:
- Butuh token di header
- Bisa filter pakai query params
- Response shape-nya kayak gimana → bisa langsung bikin TypeScript types atau plan UI

---

## 🧪 Part 2: Testing API dengan Postman / Thunder Client

### Kenapa Test Dulu Sebelum Coding?

**GOLDEN RULE:** Jangan pernah langsung coding frontend tanpa test API dulu.

Kenapa?
- Docs bisa outdated atau salah
- Bisa ada bug di backend
- Kamu perlu tau exact response shape
- Debugging di frontend + backend sekaligus = nightmare

### Thunder Client (VS Code Extension)

Thunder Client = Postman tapi langsung di VS Code. Ringan, cepat, free.

Install: Extensions → cari "Thunder Client" → Install

### Workflow Testing

**Step 1: Test Register**
```
POST http://localhost:3001/api/auth/register
Headers:
  Content-Type: application/json
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

→ Expect: 201 Created
```

**Step 2: Test Login & Simpan Token**
```
POST http://localhost:3001/api/auth/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "test@example.com",
  "password": "password123"
}

→ Expect: 200 OK
→ Copy token dari response
```

**Step 3: Test Authenticated Endpoint**
```
GET http://localhost:3001/api/tasks
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

→ Expect: 200 OK with tasks array
```

**Step 4: Test Create**
```
POST http://localhost:3001/api/tasks
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Body:
{
  "title": "Test task dari Postman",
  "completed": false
}

→ Expect: 201 Created
```

### Tips Testing

- **Save requests** dalam collection supaya nggak perlu ketik ulang
- **Environment variables** di Postman: simpan `{{baseUrl}}` dan `{{token}}`
- Test **edge cases**: empty body, wrong types, missing fields, expired token
- **Copy response** → paste ke code sebagai mock data saat develop UI

---

## 📊 Part 3: HTTP Status Codes

Ini "bahasa" yang backend pakai untuk ngomong sama frontend. **WAJIB hafal** yang common:

### 2xx — Success ✅

| Code | Nama | Artinya |
|------|------|---------|
| 200 | OK | Request berhasil (GET, PUT) |
| 201 | Created | Resource baru berhasil dibuat (POST) |
| 204 | No Content | Berhasil tapi nggak ada data dikembalikan (DELETE) |

### 4xx — Client Error 🚫

| Code | Nama | Artinya |
|------|------|---------|
| 400 | Bad Request | Request kamu salah format / missing fields |
| 401 | Unauthorized | Belum login / token expired |
| 403 | Forbidden | Login tapi nggak punya permission |
| 404 | Not Found | Resource nggak ketemu |
| 409 | Conflict | Duplikat data (email udah terdaftar) |
| 422 | Unprocessable Entity | Validation error (email format salah) |
| 429 | Too Many Requests | Rate limited — terlalu banyak request |

### 5xx — Server Error 🔥

| Code | Nama | Artinya |
|------|------|---------|
| 500 | Internal Server Error | Bug di server |
| 502 | Bad Gateway | Server proxy error |
| 503 | Service Unavailable | Server lagi down / maintenance |

### Handle di Frontend

```js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 400: // Tampilkan validation errors ke user
      case 401: // Redirect ke login
      case 403: // Tampilkan "Access Denied"
      case 404: // Tampilkan "Not Found" page
      case 429: // Tampilkan "Please wait" + disable button
      case 500: // Tampilkan "Server error, we're working on it"
    }

    return Promise.reject(error);
  }
);
```

---

## ⏱️ Part 4: Rate Limiting

### Apa itu Rate Limiting?

Backend membatasi berapa banyak request yang bisa kamu kirim dalam waktu tertentu. Contoh: "Max 100 requests per menit."

### Response Headers

```
X-RateLimit-Limit: 100        ← Max requests per window
X-RateLimit-Remaining: 47     ← Sisa requests
X-RateLimit-Reset: 1708099200 ← Kapan reset (Unix timestamp)
Retry-After: 30               ← Tunggu 30 detik (kalau 429)
```

### Handle di Frontend

```js
api.interceptors.response.use(
  (response) => {
    // Log rate limit info
    const remaining = response.headers['x-ratelimit-remaining'];
    if (remaining && parseInt(remaining) < 10) {
      console.warn(`⚠️ Rate limit hampir habis: ${remaining} requests left`);
    }
    return response;
  },
  async (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 30;
      toast.error(`Terlalu banyak request. Coba lagi dalam ${retryAfter} detik ⏳`);

      // Optional: auto-retry setelah delay
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      return api.request(error.config); // retry original request
    }
    return Promise.reject(error);
  }
);
```

### Best Practices

- **Debounce** search inputs (jangan kirim request tiap keystroke)
- **Cache** data yang nggak sering berubah (React Query staleTime)
- **Disable button** setelah submit sampai response balik
- Jangan loop API calls tanpa delay

---

## 🔄 Part 5: API Versioning

### Kenapa API Di-version?

Backend kadang perlu ubah structure response tanpa breaking existing clients. Makanya ada versioning.

### Cara Umum

```
# URL Path versioning (paling common)
GET /api/v1/tasks
GET /api/v2/tasks

# Header versioning
GET /api/tasks
Headers: Accept: application/vnd.arcane.v2+json

# Query param versioning
GET /api/tasks?version=2
```

### Di Frontend

```js
// config.js — gampang switch version
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
};
```

Kalau backend release v2, kamu cuma perlu ubah config — nggak perlu ubah semua URL di codebase.

---

## 📖 Part 6: Cara Baca Docs Third-Party API

Contoh real-world: kamu mau integrasi dengan API eksternal.

### Checklist Saat Baca Docs Baru

1. **Base URL** — Apa base URL-nya? Ada sandbox/staging?
2. **Authentication** — API key? OAuth? Bearer token? Di header atau query param?
3. **Rate Limits** — Berapa request per menit/hari?
4. **Endpoints** — List semua endpoint yang kamu butuhkan
5. **Request format** — JSON? Form data? Query params?
6. **Response format** — Shape datanya gimana?
7. **Error format** — Gimana error di-return?
8. **Pagination** — Cursor-based? Page-based? Offset?
9. **SDKs** — Ada official JavaScript SDK?
10. **Changelog** — API version berapa yang terbaru?

### Contoh: Baca OpenWeather API Docs

```
Base URL: https://api.openweathermap.org/data/2.5
Auth: API key via query param (?appid=YOUR_KEY)
Rate Limit: 60 calls/minute (free tier)

GET /weather?q=Jakarta&appid=KEY&units=metric

Response:
{
  "main": { "temp": 31.5, "humidity": 78 },
  "weather": [{ "main": "Clouds", "description": "scattered clouds" }],
  "name": "Jakarta"
}
```

Dari ini, kamu bisa langsung:
1. Test di Postman/Thunder Client
2. Bikin API helper function
3. Plan UI components berdasarkan response shape

---

## 🏋️ Exercises

### Exercise 1: Baca Swagger Docs
1. Jalankan backend Phase 1 kamu
2. Buka Swagger UI (biasanya `/api-docs`)
3. Screenshot dan annotate: tunjukkan base URL, auth method, dan 3 endpoints
4. Catat response shape dari GET dan POST endpoints

### Exercise 2: Test Semua Endpoints
1. Pakai Thunder Client atau Postman
2. Test flow lengkap: Register → Login → Create → Read → Update → Delete
3. Screenshot setiap response
4. Test error cases: wrong password, missing token, invalid ID

### Exercise 3: Status Code Handling
1. Bikin tabel: untuk setiap status code (400, 401, 403, 404, 422, 429, 500), tuliskan:
   - Kapan terjadi
   - Apa yang harus ditampilkan ke user
   - Action apa yang frontend harus lakukan

### Exercise 4: Third-Party API
1. Pilih satu public API dari [https://github.com/public-apis/public-apis](https://github.com/public-apis/public-apis)
2. Baca dokumentasinya
3. Test 3 endpoints pakai Thunder Client
4. Tulis summary: auth method, rate limit, response format

---

## 🗝️ Key Takeaways

1. **Selalu test API dulu** sebelum coding frontend — pakai Postman/Thunder Client
2. **Baca docs carefully** — perhatikan auth, request body, response shape
3. **Hafal HTTP status codes** — minimal yang common (200, 201, 400, 401, 404, 500)
4. **Respect rate limits** — debounce, cache, jangan spam
5. **API versioning** — centralize URL di config
6. **Edge cases** — test apa yang terjadi kalau input salah, token expired, server down

> *"Peta terbaik nggak berguna kalau kamu nggak bisa bacanya. Master the docs, master the realm."* 🗺️⚔️

---

**Next:** [Group Project Week 4](./gp-week4.md) →
