#!/usr/bin/env bash
# Live-site smoke test for Rights Within Reach.
# Usage:  bash scripts/smoke_test.sh
#   or override hosts:  API=https://api.rightswithinreach.org WEB=https://www.rightswithinreach.org bash scripts/smoke_test.sh
#
# Checks the things that break a demo: health, search, CORS, a structured answer
# with confidence + sources, a translated answer, a safe refusal, and the frontend.
# Needs: curl + python3 (no jq required).

set -u
API="${API:-https://api.rightswithinreach.org}"
WEB="${WEB:-https://www.rightswithinreach.org}"
PASS=0; FAIL=0
ok()   { echo "  ✅ $1"; PASS=$((PASS+1)); }
bad()  { echo "  ❌ $1"; FAIL=$((FAIL+1)); }
jqp()  { python3 -c "import sys,json;d=json.load(sys.stdin);print($1)" 2>/dev/null; }

echo "API=$API"
echo "WEB=$WEB"
echo "================================================"

echo "[1] Backend health"
curl -fsS -m 15 "$API/health" | grep -q '"status":"ok"' && ok "GET /health -> ok" || bad "/health not ok"

echo "[2] Retrieval (corpus deployed)"
CNT=$(curl -fsS -m 20 "$API/api/search?q=eviction%20notice&k=2" | jqp "d.get('count',0)")
[ "${CNT:-0}" -ge 1 ] 2>/dev/null && ok "/api/search returned $CNT results" || bad "/api/search returned no results"

echo "[3] CORS (browser calls allowed from the site)"
ACAO=$(curl -fsS -m 20 -D - -o /dev/null \
  -H "Origin: $WEB" -H 'Content-Type: application/json' \
  -X POST "$API/api/ask" -d '{"question":"test","language":"en"}' 2>/dev/null \
  | tr -d '\r' | awk -F': ' 'tolower($1)=="access-control-allow-origin"{print $2}')
[ -n "$ACAO" ] && ok "access-control-allow-origin: $ACAO" || bad "NO CORS header — set ALLOWED_ORIGINS on Railway"

echo "[4] Structured English answer (answer + confidence + sources + contact)"
R=$(curl -fsS -m 90 -H 'Content-Type: application/json' -X POST "$API/api/ask" \
  -d '{"question":"How much notice must my landlord give before raising my rent in Chicago?","language":"en","area":"chicago","subject":"housing"}')
echo "$R" | jqp "len(d.get('answer','')) > 40" | grep -q True && ok "answer present" || bad "answer missing/short (Anthropic key?)"
CONF=$(echo "$R" | jqp "d.get('confidence')"); case "$CONF" in high|medium|low) ok "confidence=$CONF";; *) bad "confidence invalid: $CONF";; esac
NS=$(echo "$R" | jqp "len(d.get('sources',[]))"); [ "${NS:-0}" -ge 1 ] 2>/dev/null && ok "sources=$NS" || bad "no sources"
echo "$R" | jqp "bool(d.get('contact'))" | grep -q True && ok "contact card present" || bad "no contact card"
echo "$R" | jqp "len(d.get('disclaimer','')) > 20" | grep -q True && ok "disclaimer present" || bad "no disclaimer"

echo "[5] Translated answer (Spanish)"
ES=$(curl -fsS -m 90 -H 'Content-Type: application/json' -X POST "$API/api/ask" \
  -d '{"question":"¿Cuánto tiempo tiene mi arrendador para devolver mi depósito?","language":"es","subject":"housing"}' | jqp "d.get('answer','')")
echo "$ES" | grep -qiE '[áéíóúñ¿]|arrendador|depósito|inquilino' && ok "answer is in Spanish" || bad "answer not clearly Spanish: ${ES:0:60}"

echo "[6] Safe refusal (out of scope)"
curl -fsS -m 60 -H 'Content-Type: application/json' -X POST "$API/api/ask" \
  -d '{"question":"My spouse and I are divorcing, who gets custody of our kids?","language":"en"}' \
  | jqp "d.get('refused')" | grep -q True && ok "out-of-scope question refused" || bad "did NOT refuse an out-of-scope question"

echo "[7] Feedback endpoint"
curl -fsS -m 15 -H 'Content-Type: application/json' -X POST "$API/api/feedback" \
  -d '{"helpful":true,"language":"en","topic":"housing"}' | grep -q '"ok":true' \
  && ok "POST /api/feedback -> ok" || bad "/api/feedback failed"

echo "[8] Frontend serves"
curl -fsS -m 15 -o /dev/null -w "%{http_code}" "$WEB/" | grep -q 200 && ok "GET $WEB/ -> 200" || bad "frontend not serving 200"

echo "================================================"
echo "PASS=$PASS  FAIL=$FAIL"
[ "$FAIL" -eq 0 ] && echo "🎉 all automated checks passed" || echo "⚠️  fix the ❌ items above"
exit $([ "$FAIL" -eq 0 ] && echo 0 || echo 1)
