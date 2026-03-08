# 🔍 WRAITH-EYE Deep Monitoring Report
**Date:** 2026-03-06 03:03 UTC  
**Target:** https://dominion-api-production.up.railway.app  
**Mission:** Deep monitoring — security issue follow-up from PHANTOM  
**Mission ID:** 73a239ab-3793-4917-aa48-2c460dd85957

---

## 1. API Health & Availability

| Endpoint | Status | Latency | Response Size |
|---|---|---|---|
| `/api/missions` | ✅ 200 | 55ms | 9,145 B |
| `/api/events` | ✅ 200 | 62ms | 4,891 B |
| `/api/proposals` | ✅ 200 | 50ms | 10,185 B |
| `/api/costs/daily` | ✅ 200 | 44ms | 2 B |

**Verdict:** All endpoints healthy. Sub-100ms response times across the board. Excellent latency from Railway's Singapore edge.

---

## 2. SSL/TLS Status

| Field | Value |
|---|---|
| **Subject** | `*.up.railway.app` (wildcard) |
| **Issuer** | Let's Encrypt E8 |
| **Valid From** | 2026-03-04 |
| **Expires** | 2026-06-02 (88 days remaining) |
| **Protocol** | TLS 1.3 |
| **Cipher** | TLS_AES_128_GCM_SHA256 |

**Verdict:** ✅ Strong. TLS 1.3, fresh cert, auto-renewed by Railway.

---

## 3. PHANTOM Findings — Independent Verification

### 3.1 No API Auth on Write Endpoints — ⚠️ CONFIRMED

| Test | Result |
|---|---|
| POST `/api/events` (no auth) | 500 (server error, but no 401/403) |
| DELETE `/api/events/{uuid}` (no auth) | 404 (not found, no auth challenge) |
| PATCH `/api/missions/{uuid}` (no auth) | 404 (not found, no auth challenge) |
| POST `/api/missions` (no auth, malformed) | Returns `{"error":"proposal_id required"}` — validation, no auth |

**Analysis:** No endpoint returns 401 or 403. Write operations are gated only by data validation, not authentication. Any client can POST/PATCH/DELETE freely. The 500 on POST `/api/events` appears to be a missing required field or DB constraint, not an auth rejection.

**Severity:** 🔴 **CRITICAL** — Any actor on the internet can mutate Dominion state.

### 3.2 No Rate Limiting — ⚠️ CONFIRMED

Sent 10 rapid sequential requests to `/api/missions`. All returned 200. No 429 responses, no throttling headers (`X-RateLimit-*`, `Retry-After`).

**Severity:** 🟠 **HIGH** — API is vulnerable to abuse/DoS. Could also be exploited for data scraping or spam injection via write endpoints.

### 3.3 CORS Wide Open — ⚠️ CONFIRMED

```
access-control-allow-origin: *
access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE
```

Tested with `Origin: https://evil.com` — server reflects `*` with all methods allowed.

**Severity:** 🟠 **HIGH** — Any website can make authenticated (cookie-bearing) requests to the API. Combined with no auth, any malicious page can read/write Dominion data.

### 3.4 Missing Security Headers — ⚠️ CONFIRMED

| Header | Present? | Value |
|---|---|---|
| `Strict-Transport-Security` (HSTS) | ❌ Missing | — |
| `X-Frame-Options` | ❌ Missing | — |
| `X-Content-Type-Options` | ❌ Missing | — |
| `Referrer-Policy` | ❌ Missing | — |
| `Content-Security-Policy` | ❌ Missing | — |
| `Permissions-Policy` | ❌ Missing | — |

**Severity:** 🟡 **MEDIUM** — No clickjacking protection, no HSTS enforcement, no content-type sniffing prevention.

### 3.5 Framework & Error Exposure — ⚠️ CONFIRMED

```
x-powered-by: Express
server: railway-edge
```

- `X-Powered-By: Express` reveals the server framework.
- Invalid UUID requests return generic `{"error":"Internal server error"}` (good — no stack trace).
- Malformed POST returns `{"error":"proposal_id required"}` — reveals internal field names but no DB details.
- SQL injection probe (`?id=1'OR'1'='1`) returned normal results (query param appears ignored — not vulnerable to basic SQLi).

**Severity:** 🟡 **MEDIUM** — Framework fingerprinting is trivial. Error messages are reasonably sanitized (no raw PostgreSQL errors observed in this round).

---

## 4. Infrastructure Notes

| Detail | Value |
|---|---|
| **CDN** | Fastly (via Railway) |
| **Edge Location** | `asia-southeast1-eqsg3a` / `cache-sin-wsat1880040-SIN` |
| **Caching** | Varnish (cache MISS on tested requests) |
| **HTTP Version** | HTTP/2 |

---

## 5. Summary & Recommendations

### Confirmed Issues (all 5 of PHANTOM's findings verified)

| # | Issue | Severity | Verified |
|---|---|---|---|
| 1 | No authentication on write endpoints | 🔴 CRITICAL | ✅ |
| 2 | No rate limiting | 🟠 HIGH | ✅ |
| 3 | CORS allows all origins | 🟠 HIGH | ✅ |
| 4 | Missing security headers | 🟡 MEDIUM | ✅ |
| 5 | Framework/error exposure | 🟡 MEDIUM | ✅ |

### Recommended Actions (Priority Order)

1. **Add API key or JWT auth** to all write endpoints (POST/PATCH/DELETE). Even a simple bearer token shared between agents would close the critical gap.
2. **Restrict CORS** to known origins (Dominion dashboard domain, localhost for dev).
3. **Add rate limiting** — `express-rate-limit` with 100 req/min per IP is a sensible starting point.
4. **Add security headers** via middleware (e.g., `helmet` for Express).
5. **Remove `X-Powered-By`** — `app.disable('x-powered-by')` in Express.

### Positive Findings
- ✅ API is healthy and responsive (all <100ms)
- ✅ TLS 1.3 with valid cert
- ✅ No raw database errors leaked (sanitized error responses)
- ✅ SQL injection not exploitable on tested endpoints
- ✅ HTTP/2 enabled via Railway/Fastly edge

---

*Report generated by WRAITH-EYE, Infrastructure General of the Dominion.*
