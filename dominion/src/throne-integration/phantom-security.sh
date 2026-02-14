#!/usr/bin/env bash
# PHANTOM Weekly Security Scan
# Automated infrastructure health & security checks for the Dominion
set -euo pipefail

API_BASE="https://dominion-api-production.up.railway.app"
FRONTEND_BASE="https://dominion-frontend-production.up.railway.app"
TODAY=$(date -u +%Y-%m-%d)
REPORT_DIR="/data/workspace/dominion/reports"
REPORT_FILE="${REPORT_DIR}/phantom-security-${TODAY}.md"
PASSED=0
FAILED=0
TOTAL=0
WARNINGS=""

mkdir -p "$REPORT_DIR"

log_result() {
  local name="$1" status="$2" detail="$3"
  TOTAL=$((TOTAL + 1))
  if [ "$status" = "PASS" ]; then
    PASSED=$((PASSED + 1))
    echo "  ✅ $name — $detail"
    echo "| $name | ✅ PASS | $detail |" >> "$REPORT_FILE"
  else
    FAILED=$((FAILED + 1))
    echo "  ❌ $name — $detail"
    echo "| $name | ❌ FAIL | $detail |" >> "$REPORT_FILE"
  fi
}

log_warn() {
  WARNINGS="${WARNINGS}\n- ⚠️ $1"
  echo "  ⚠️  $1"
}

# --- Report Header ---
cat > "$REPORT_FILE" <<EOF
# 🛡️ PHANTOM Security Scan — ${TODAY}

**General:** PHANTOM
**Scan time:** $(date -u '+%Y-%m-%d %H:%M UTC')
**Infrastructure:** Dominion API + Frontend (Railway)

---

## 1. API Health Check

| Endpoint | Status | Response Time |
|----------|--------|---------------|
EOF

echo "🛡️ PHANTOM Security Scan — ${TODAY}"
echo "==========================================="
echo ""
echo "📡 1. API Health Check"

API_ENDPOINTS=(
  "/ (root)"
  "/api/generals"
  "/api/missions"
  "/api/proposals"
  "/api/events"
  "/api/costs/daily"
  "/api/roundtables"
  "/api/reports"
)

API_PATHS=(
  "/"
  "/api/generals"
  "/api/missions"
  "/api/proposals"
  "/api/events"
  "/api/costs/daily"
  "/api/roundtables"
  "/api/reports"
)

for i in "${!API_PATHS[@]}"; do
  path="${API_PATHS[$i]}"
  name="${API_ENDPOINTS[$i]}"
  resp=$(curl -s -o /dev/null -w "%{http_code} %{time_total} %{size_download}" \
    --max-time 15 "${API_BASE}${path}" 2>/dev/null || echo "000 0 0")
  code=$(echo "$resp" | awk '{print $1}')
  time_s=$(echo "$resp" | awk '{print $2}')
  size=$(echo "$resp" | awk '{print $3}')

  if [ "$code" -ge 200 ] && [ "$code" -lt 400 ]; then
    log_result "GET ${name}" "PASS" "${time_s}s (HTTP ${code}, ${size}B)"
  else
    log_result "GET ${name}" "FAIL" "HTTP ${code} (${time_s}s)"
  fi

  # Response size check (>1MB)
  if [ "${size:-0}" -gt 1048576 ]; then
    log_warn "GET ${name} returned ${size}B (>1MB) — suspiciously large"
  fi
done

# --- Frontend Health Check ---
echo ""
echo "🌐 2. Frontend Health Check"
cat >> "$REPORT_FILE" <<EOF

## 2. Frontend Health Check

| Check | Status | Detail |
|-------|--------|--------|
EOF

fe_resp=$(curl -s --max-time 15 -w "\n%{http_code} %{time_total}" "${FRONTEND_BASE}/" 2>/dev/null || echo -e "\n000 0")
fe_body=$(echo "$fe_resp" | head -n -1)
fe_meta=$(echo "$fe_resp" | tail -1)
fe_code=$(echo "$fe_meta" | awk '{print $1}')
fe_time=$(echo "$fe_meta" | awk '{print $2}')

if [ "$fe_code" -ge 200 ] && [ "$fe_code" -lt 400 ]; then
  log_result "Frontend reachable" "PASS" "HTTP ${fe_code} in ${fe_time}s"
else
  log_result "Frontend reachable" "FAIL" "HTTP ${fe_code}"
fi

if echo "$fe_body" | grep -qi "<html\|<!doctype\|<head\|<body"; then
  log_result "Frontend HTML content" "PASS" "Valid HTML detected"
else
  log_result "Frontend HTML content" "FAIL" "No HTML content in response"
fi

# --- SSL Certificate Check ---
echo ""
echo "🔒 3. SSL Certificate Check"
cat >> "$REPORT_FILE" <<EOF

## 3. SSL Certificate Check

| Domain | Status | Detail |
|--------|--------|--------|
EOF

for domain in "dominion-api-production.up.railway.app" "dominion-frontend-production.up.railway.app"; do
  cert_info=$(curl -vI --max-time 10 "https://${domain}/" 2>&1 || true)
  expire=$(echo "$cert_info" | grep -i "expire date" | head -1 | sed 's/.*expire date: //')
  if [ -n "$expire" ]; then
    expire_epoch=$(date -d "$expire" +%s 2>/dev/null || echo 0)
    now_epoch=$(date +%s)
    days_left=$(( (expire_epoch - now_epoch) / 86400 ))
    if [ "$days_left" -gt 7 ]; then
      log_result "SSL ${domain}" "PASS" "Expires in ${days_left} days (${expire})"
    else
      log_result "SSL ${domain}" "FAIL" "Expires in ${days_left} days — RENEW NOW"
    fi
  else
    # Try alternative: just check TLS handshake succeeds
    if echo "$cert_info" | grep -qi "SSL certificate verify ok\|subject:"; then
      log_result "SSL ${domain}" "PASS" "TLS handshake OK (expiry parse unavailable)"
    else
      log_result "SSL ${domain}" "FAIL" "Could not verify certificate"
    fi
  fi
done

# --- CORS Check ---
echo ""
echo "🔀 4. CORS Check"
cat >> "$REPORT_FILE" <<EOF

## 4. CORS Header Check

| Endpoint | Status | Detail |
|----------|--------|--------|
EOF

cors_headers=$(curl -s -I --max-time 10 \
  -H "Origin: ${FRONTEND_BASE}" \
  "${API_BASE}/api/generals" 2>/dev/null || echo "")

if echo "$cors_headers" | grep -qi "access-control-allow-origin"; then
  acao=$(echo "$cors_headers" | grep -i "access-control-allow-origin" | head -1 | tr -d '\r')
  log_result "CORS headers" "PASS" "${acao}"
else
  log_result "CORS headers" "FAIL" "No Access-Control-Allow-Origin header found"
fi

# --- Uptime Summary ---
echo ""
echo "📊 5. Summary"

if [ "$TOTAL" -gt 0 ]; then
  SCORE=$(( PASSED * 100 / TOTAL ))
else
  SCORE=0
fi

if [ -n "$WARNINGS" ]; then
  cat >> "$REPORT_FILE" <<EOF

## 5. Warnings
$(echo -e "$WARNINGS")
EOF
fi

cat >> "$REPORT_FILE" <<EOF

## 6. Uptime Summary

- **Total checks:** ${TOTAL}
- **Passed:** ${PASSED} ✅
- **Failed:** ${FAILED} ❌
- **Health score:** ${SCORE}%

---

*Report generated by PHANTOM security scan at $(date -u '+%H:%M UTC')*
EOF

echo ""
echo "  Health Score: ${SCORE}% (${PASSED}/${TOTAL} passed)"
echo ""
echo "📄 Report: ${REPORT_FILE}"

# --- Copy to API reports dir ---
API_REPORTS_DIR="/data/workspace/dominion/api/src/data/reports"
if [ -d "$API_REPORTS_DIR" ]; then
  cp "$REPORT_FILE" "$API_REPORTS_DIR/"
  echo "📋 Copied to API reports dir"
fi

# --- Log event to API ---
echo ""
echo "📡 Logging event to API..."
curl -s -X POST "${API_BASE}/api/events" \
  -H "Content-Type: application/json" \
  -d "{
    \"agent_id\": \"phantom\",
    \"kind\": \"security_scan\",
    \"title\": \"Weekly Security Scan — ${TODAY}\",
    \"description\": \"Health score: ${SCORE}% (${PASSED}/${TOTAL} checks passed, ${FAILED} failed)\",
    \"date\": \"${TODAY}\"
  }" --max-time 10 2>/dev/null || echo "  ⚠️ Could not log event to API"

# --- Queue notification ---
NOTIF_DIR="/data/workspace/dominion/notifications"
mkdir -p "$NOTIF_DIR"
cat > "${NOTIF_DIR}/phantom-security-${TODAY}.json" <<EOF
{
  "type": "security_scan",
  "general": "PHANTOM",
  "date": "${TODAY}",
  "summary": "🛡️ PHANTOM Security Scan: ${SCORE}% health (${PASSED}/${TOTAL} passed, ${FAILED} failed)",
  "report": "${REPORT_FILE}",
  "urgent": $([ "$SCORE" -lt 80 ] && echo "true" || echo "false")
}
EOF
echo "🔔 Notification queued"

echo ""
echo "🛡️ PHANTOM scan complete."
exit $([ "$FAILED" -eq 0 ] && echo 0 || echo 1)
