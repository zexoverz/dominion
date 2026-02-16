#!/usr/bin/env bash
# dispatch-missions.sh — Read trigger files and output spawn commands
# Called by THRONE heartbeat to know which sub-agents to spawn
# Outputs JSON lines: {"mission_id":"...","agent_id":"...","prompt_file":"...","label":"..."}

TRIGGERS_DIR="/data/workspace/dominion/missions/triggers"
DONE_DIR="/data/workspace/dominion/missions/dispatched"

mkdir -p "$TRIGGERS_DIR" "$DONE_DIR"

shopt -s nullglob
for trigger in "$TRIGGERS_DIR"/*.trigger; do
  [ -f "$trigger" ] || continue
  
  # Parse the trigger file safely (don't source — titles can have special chars)
  MISSION_ID=$(grep '^MISSION_ID=' "$trigger" | head -1 | cut -d= -f2-)
  AGENT_ID=$(grep '^AGENT_ID=' "$trigger" | head -1 | cut -d= -f2-)
  PROMPT_FILE=$(grep '^PROMPT_FILE=' "$trigger" | head -1 | cut -d= -f2-)
  
  [ -z "$MISSION_ID" ] && continue
  
  # Skip if already dispatched
  [ -f "$DONE_DIR/${MISSION_ID}.done" ] && continue
  
  # Read the prompt
  PROMPT=""
  [ -f "$PROMPT_FILE" ] && PROMPT=$(cat "$PROMPT_FILE")
  [ -z "$PROMPT" ] && continue
  
  LABEL=$(echo "${AGENT_ID}-mission-${MISSION_ID}" | cut -c1-40)
  
  # Output as JSON for THRONE to parse and spawn
  python3 -c "
import json
print(json.dumps({
    'mission_id': '$MISSION_ID',
    'agent_id': '$AGENT_ID',
    'prompt_file': '$PROMPT_FILE',
    'label': '$LABEL'
}))
"
  
  # Mark as dispatched
  echo "dispatched=$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$DONE_DIR/${MISSION_ID}.done"
done
