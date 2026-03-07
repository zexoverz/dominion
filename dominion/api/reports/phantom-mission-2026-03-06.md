# 🔒 PHANTOM Security Health Check
**Date:** 2026-03-06 01:03 UTC  
**Target:** `dominion-api-production.up.railway.app`  
**Mission:** `02897637-6cd9-40ff-80ab-3fd8a10eda2f`

---

## Summary

| Area | Status | Severity |
|------|--------|----------|
| SSL/TLS | ✅ Valid | — |
| HTTPS Redirect | ✅ Working | — |
| Authentication | 🔴 NONE | **CRITICAL** |
| CORS Policy | 🟡 Wide Open | **MEDIUM** |
| Rate Limiting | 🔴 NONE | **HIGH** |
| Security Headers | 🟡 Missing Several | **MEDIUM** |
| Info Leakage | 🟡 Server Fingerprint | **LOW** |
| Error Handling | 🟡 DB Errors Exposed | **MEDIUM** |

**Overall Risk: HIGH** — No authentication on write endpoints is the primary concern.

---

## 1. SSL/TLS Certificate ✅

- **Issuer:** Let's Encrypt (E8)
- **Subject:** `*.up.railway.app` (wildcard)
- **Protocol:** TLSv1.3 (TLS_AES_128_GCM_SHA256)
- **Key:** ECDSA 256-bit (P-256)
- **Valid:** Mar 4, 2026 → Jun 2, 2026 (~88 days remaining)
- **Chain:** Verified OK (ISRG Root X1 → E8 → wildcard)

**Verdict:** Solid. Auto-renewed by Railway. No action needed.

---

## 2. HTTPS Redirect ✅

- HTTP request to port 80 returns `301 Moved Permanently` → HTTPS
- Handled at CDN layer (Fastly/Varnish)

**Verdict:** Working correctly.

---

## 3. Authentication 🔴 CRITICAL

**No authentication on any endpoint.** All tested operations succeed without tokens, API keys, or any form of auth:

| Endpoint | Method | Auth Required? | Result |
|----------|--------|----------------|--------|
| `GET /` | GET | ❌ | Returns service status |
| `GET /api/missions` | GET | ❌ | Returns ALL missions (8.5KB) |
| `GET /api/events` | GET | ❌ | Returns ALL events (4.3KB) |
| `POST /api/events` | POST | ❌ | Can create arbitrary events |
| `PATCH /api/missions/:id` | PATCH | ❌ | Can modify any mission |
| `DELETE /api/missions/:id` | DELETE | ❌ | Accepts (errors on invalid UUID format only) |

**Risk:** Anyone who discovers this URL can:
- Read all mission data and event history
- Create fake events impersonating any agent
- Modify mission status/progress
- Potentially delete missions

**Recommendation:** Add API key or JWT authentication, at minimum on write operations (POST/PATCH/DELETE).

---

## 4. CORS Policy 🟡 MEDIUM

```
access-control-allow-origin: *
```

Wide-open CORS on all endpoints. Any website can make requests to this API from a browser.

**Recommendation:** Restrict to known origins (e.g., your dashboard domain). For an internal API, consider removing CORS entirely or locking to specific domains.

---

## 5. Rate Limiting 🔴 HIGH

Fired 20 rapid sequential requests — all returned successfully with no throttling, no `429 Too Many Requests`, no `Retry-After` headers.

**Risk:** Vulnerable to:
- Brute-force attacks
- Denial of service (app-level flood)
- Data scraping

**Recommendation:** Add rate limiting middleware (e.g., `express-rate-limit`). Suggested: 60 req/min per IP for reads, 10 req/min for writes.

---

## 6. Security Headers 🟡 MEDIUM

**Present:**
- `x-content-type-options: nosniff` (on error pages only)
- `content-security-policy: default-src 'none'` (on error pages only)

**Missing on API responses:**
- `Strict-Transport-Security` (HSTS) — browsers won't enforce HTTPS
- `X-Frame-Options` — clickjacking possible
- `Referrer-Policy` — referrer leakage
- `Permissions-Policy` — no feature restrictions
- `X-Content-Type-Options` — missing on 200 responses
- `Content-Security-Policy` — missing on 200 responses

**Recommendation:** Add a helmet middleware or manual headers:
```js
app.use(helmet());
// or manually:
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});
```

---

## 7. Information Leakage 🟡 LOW

- **`X-Powered-By: Express`** — reveals server framework
- **`server: railway-edge`** — reveals hosting provider (acceptable)
- **Error responses leak DB details:** DELETE with invalid UUID returns `"invalid input syntax for type uuid"` — exposes PostgreSQL usage

**Recommendation:**
- `app.disable('x-powered-by')` or use helmet
- Sanitize database error messages in responses

---

## 8. Endpoint Discovery

Tested common paths. Non-existent routes return proper 404s (good — no directory listing or stack traces).

| Path | Status |
|------|--------|
| `/` | 200 — service status JSON |
| `/api/missions` | 200 — data |
| `/api/events` | 200 — data |
| `/api/health` | 404 |
| `/api/agents` | 404 |
| `/api/config` | 404 |
| `/api/users` | 404 |
| `/api/admin` | 404 |
| `/api/status` | 404 |

---

## Priority Actions

1. **🔴 Add authentication** — API keys at minimum, JWT preferred. This is the #1 issue.
2. **🔴 Add rate limiting** — `express-rate-limit` or Railway-level throttling.
3. **🟡 Add security headers** — Install `helmet` middleware.
4. **🟡 Restrict CORS** — Lock `Access-Control-Allow-Origin` to known domains.
5. **🟡 Sanitize errors** — Don't expose DB error messages to clients.
6. **🟢 Remove X-Powered-By** — `app.disable('x-powered-by')`.

---

*Report generated by PHANTOM — Dominion Security General*  
*Next recommended scan: 2026-03-13*
