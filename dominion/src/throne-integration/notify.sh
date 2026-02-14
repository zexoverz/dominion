#!/usr/bin/env bash
set -euo pipefail

# notify.sh — Queue a notification for Telegram delivery via heartbeat
# Usage: ./notify.sh --type <type> --message <text> [--priority normal|high]

NOTIFICATIONS_DIR="/data/workspace/dominion/notifications"
mkdir -p "$NOTIFICATIONS_DIR"

TYPE=""
MESSAGE=""
PRIORITY="normal"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --type) TYPE="$2"; shift 2 ;;
    --message) MESSAGE="$2"; shift 2 ;;
    --priority) PRIORITY="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

[ -z "$TYPE" ] && { echo "Error: --type required"; exit 1; }
[ -z "$MESSAGE" ] && { echo "Error: --message required"; exit 1; }

# RPG-themed emoji per type
case "$TYPE" in
  mission-complete)     EMOJI="⚔️✅" ; HEADER="QUEST COMPLETE" ;;
  proposal-needs-approval) EMOJI="📜⚠️" ; HEADER="PROPOSAL AWAITS YOUR DECREE" ;;
  budget-warning)       EMOJI="💰🔥" ; HEADER="TREASURY WARNING" ;;
  btc-alert)            EMOJI="🔮📊" ; HEADER="ORACLE ALERT" ;;
  auto-review-summary)  EMOJI="🏰📋" ; HEADER="DOMINION AUTO-REVIEW" ;;
  *)                    EMOJI="🏴" ; HEADER="DOMINION ALERT" ;;
esac

FORMATTED="${EMOJI} *${HEADER}*\n\n${MESSAGE}"
CREATED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
FILENAME="notif-$(date -u +%s)-$$-${TYPE}.json"

python3 -c "
import json, sys
data = {
    'type': sys.argv[1],
    'message': sys.argv[2],
    'formatted': sys.argv[3],
    'priority': sys.argv[4],
    'created_at': sys.argv[5]
}
print(json.dumps(data, indent=2))
" "$TYPE" "$MESSAGE" "$FORMATTED" "$PRIORITY" "$CREATED_AT" > "$NOTIFICATIONS_DIR/$FILENAME"

echo "Notification queued: $NOTIFICATIONS_DIR/$FILENAME"
