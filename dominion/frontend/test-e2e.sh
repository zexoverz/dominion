#!/bin/bash
# E2E smoke test for Dominion Frontend + API
# Run before every deploy

set -e

API="https://dominion-api-production.up.railway.app"
FE="https://dominion-frontend-production.up.railway.app"
PASS=0
FAIL=0
ERRORS=""

check() {
  local name="$1" url="$2" expect="$3"
  local status body
  status=$(curl -s -o /tmp/e2e_body -w "%{http_code}" "$url" 2>/dev/null)
  body=$(cat /tmp/e2e_body 2>/dev/null)
  
  if [ "$status" != "$expect" ]; then
    FAIL=$((FAIL+1))
    ERRORS="$ERRORS\n❌ $name — expected $expect, got $status"
    return
  fi
  PASS=$((PASS+1))
  echo "✅ $name — $status"
}

check_json_array() {
  local name="$1" url="$2"
  local status body
  status=$(curl -s -o /tmp/e2e_body -w "%{http_code}" "$url" 2>/dev/null)
  body=$(cat /tmp/e2e_body 2>/dev/null)
  
  if [ "$status" != "200" ]; then
    FAIL=$((FAIL+1))
    ERRORS="$ERRORS\n❌ $name — HTTP $status"
    return
  fi
  
  # Check it's a JSON array
  if echo "$body" | python3 -c "import sys,json; d=json.load(sys.stdin); assert isinstance(d,list), 'not array'; assert len(d)>0, 'empty'" 2>/dev/null; then
    PASS=$((PASS+1))
    local count=$(echo "$body" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
    echo "✅ $name — 200, $count items"
  else
    FAIL=$((FAIL+1))
    ERRORS="$ERRORS\n❌ $name — not a valid JSON array or empty"
  fi
}

check_html() {
  local name="$1" url="$2" needle="$3"
  local status body
  status=$(curl -s -o /tmp/e2e_body -w "%{http_code}" "$url" 2>/dev/null)
  body=$(cat /tmp/e2e_body 2>/dev/null)
  
  if [ "$status" != "200" ]; then
    FAIL=$((FAIL+1))
    ERRORS="$ERRORS\n❌ $name — HTTP $status"
    return
  fi
  
  if echo "$body" | grep -q "$needle"; then
    PASS=$((PASS+1))
    echo "✅ $name — 200, contains '$needle'"
  else
    FAIL=$((FAIL+1))
    ERRORS="$ERRORS\n❌ $name — missing '$needle' in response"
  fi
}

echo "═══════════════════════════════════════"
echo "  DOMINION E2E TEST SUITE"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "═══════════════════════════════════════"
echo ""

echo "── API ENDPOINTS ──"
check "API root" "$API/" "200"
check_json_array "GET /api/generals" "$API/api/generals"
check_json_array "GET /api/missions" "$API/api/missions"
check_json_array "GET /api/events" "$API/api/events"
check_json_array "GET /api/proposals" "$API/api/proposals"
check "GET /api/costs" "$API/api/costs" "200"
check_json_array "GET /api/relationships" "$API/api/relationships"
check_json_array "GET /api/roundtables" "$API/api/roundtables"

echo ""
echo "── FRONTEND PAGES ──"
check_html "Homepage" "$FE/" "THE DOMINION"
check_html "Missions" "$FE/missions" "MISSION"
check_html "Cost/Treasury" "$FE/cost" "TREASURY"
check_html "Roundtable" "$FE/roundtable" "ROUNDTABLE"
check_html "Throne Room" "$FE/throne-room" "throne"
check_html "Admin" "$FE/admin" "admin"
check_html "Logs" "$FE/logs" "LOG"
check_html "General Detail" "$FE/generals/throne" "THRONE"

echo ""
echo "── JS BUNDLE CHECK ──"
# Verify JS chunks load (no 404s)
CHUNKS=$(curl -s "$FE/" | grep -oP '/_next/static/chunks/[^"]+' | head -3)
for chunk in $CHUNKS; do
  check "JS chunk ${chunk##*/}" "$FE$chunk" "200"
done

echo ""
echo "── CROSS-ORIGIN (CORS) ──"
CORS_HEADER=$(curl -s -I -H "Origin: $FE" "$API/api/generals" 2>/dev/null | grep -i "access-control-allow-origin" || true)
if [ -n "$CORS_HEADER" ]; then
  PASS=$((PASS+1))
  echo "✅ CORS header present: $CORS_HEADER"
else
  # Not necessarily a fail if same-origin or wildcard
  echo "⚠️  No explicit CORS header (may use wildcard or proxy)"
fi

echo ""
echo "═══════════════════════════════════════"
echo "  RESULTS: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
  echo ""
  echo "FAILURES:"
  echo -e "$ERRORS"
  exit 1
fi

echo "🎉 ALL TESTS PASSED"
exit 0
