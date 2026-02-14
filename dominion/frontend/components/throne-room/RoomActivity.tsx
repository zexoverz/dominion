"use client";

import { useCallback, useEffect, useRef } from "react";
import { GeneralRoomState } from "./GeneralInRoom";
import { SpriteState } from "../sprites";
import { RealEvent } from "../../lib/use-activity";

const ROUND_TABLE = { x: 400, y: 370 };

const ACTIVITIES: Record<string, string[]> = {
  throne: [
    "Reviewing mission reports",
    "Issuing royal decrees",
    "Consulting the war map",
    "Meditating on strategy",
  ],
  seer: [
    "Consulting the crystal ball",
    "Reading the star charts",
    "Analyzing data streams",
    "Channeling visions",
  ],
  phantom: [
    "Deploying shadow code",
    "Running stealth protocols",
    "Debugging in the dark",
    "Compiling executables",
  ],
  grimoire: [
    "Reading ancient scrolls",
    "Writing documentation",
    "Cataloging knowledge",
    "Deciphering runes",
  ],
  echo: [
    "Broadcasting updates",
    "Composing announcements",
    "Amplifying signals",
    "Tuning frequencies",
  ],
  mammon: [
    "Counting treasury gold",
    "Balancing the ledgers",
    "Calculating ROI",
    "Auditing expenses",
  ],
  "wraith-eye": [
    "Scanning perimeter",
    "Monitoring shadows",
    "Tracking anomalies",
    "Surveillance sweep",
  ],
};

const COLLAB_ACTIONS = [
  { from: "throne", to: "seer", text: "reviewing SEER's analysis" },
  { from: "throne", to: "phantom", text: "inspecting PHANTOM's deployment" },
  { from: "throne", to: "grimoire", text: "consulting GRIMOIRE's archives" },
  { from: "seer", to: "grimoire", text: "cross-referencing with GRIMOIRE" },
  { from: "phantom", to: "mammon", text: "requesting budget from MAMMON" },
  { from: "echo", to: "throne", text: "reporting to THRONE" },
  { from: "mammon", to: "throne", text: "presenting treasury report" },
  { from: "wraith-eye", to: "seer", text: "sharing intel with SEER" },
  { from: "grimoire", to: "echo", text: "sending docs to ECHO" },
];

export interface ActivityEvent {
  id: number;
  emoji: string;
  text: string;
  timestamp: number;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface UseRoomActivityOptions {
  generals: GeneralRoomState[];
  setGenerals: React.Dispatch<React.SetStateAction<GeneralRoomState[]>>;
  addEvent: (emoji: string, text: string) => void;
  realEvents?: RealEvent[];
}

// Map general IDs from API events to room general IDs
const GENERAL_ID_MAP: Record<string, string> = {
  THRONE: 'throne',
  SEER: 'seer',
  PHANTOM: 'phantom',
  GRIMOIRE: 'grimoire',
  ECHO: 'echo',
  MAMMON: 'mammon',
  'WRAITH-EYE': 'wraith-eye',
};

export function useRoomActivity({ generals, setGenerals, addEvent, realEvents }: UseRoomActivityOptions) {
  const generalsRef = useRef(generals);
  generalsRef.current = generals;
  const processedEventsRef = useRef<Set<string>>(new Set());

  // Process real events — trigger general animations when new events come in
  useEffect(() => {
    if (!realEvents || realEvents.length === 0) return;
    
    for (const evt of realEvents.slice(0, 5)) {
      if (processedEventsRef.current.has(evt.id)) continue;
      processedEventsRef.current.add(evt.id);

      // Trigger the relevant general to animate
      const generalId = evt.generalId ? GENERAL_ID_MAP[evt.generalId] || evt.generalId.toLowerCase() : null;
      if (generalId) {
        const offset = { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 30 };
        setGenerals((prev) =>
          prev.map((gen) =>
            gen.id === generalId
              ? {
                  ...gen,
                  targetPosition: { x: ROUND_TABLE.x + offset.x, y: ROUND_TABLE.y + offset.y },
                  currentState: "walking" as SpriteState,
                  currentActivity: evt.message,
                }
              : gen
          )
        );
      }

      addEvent(evt.emoji || '⚡', evt.message);
    }

    // Keep processed set from growing unbounded
    if (processedEventsRef.current.size > 200) {
      const arr = Array.from(processedEventsRef.current);
      processedEventsRef.current = new Set(arr.slice(-100));
    }
  }, [realEvents, setGenerals, addEvent]);

  const triggerAction = useCallback(() => {
    const gens = generalsRef.current;
    const roll = Math.random();

    if (roll < 0.3) {
      // Solo work at station
      const g = pick(gens);
      const activity = pick(ACTIVITIES[g.id] || ["Working..."]);
      const state: SpriteState = Math.random() > 0.5 ? "working" : "thinking";
      setGenerals((prev) =>
        prev.map((gen) =>
          gen.id === g.id
            ? { ...gen, targetPosition: gen.stationPosition, currentState: state, currentActivity: activity }
            : gen
        )
      );
      addEvent(g.emoji, `${g.name} is ${activity.toLowerCase()}`);
    } else if (roll < 0.55) {
      // Go to roundtable
      const g = pick(gens);
      const offset = { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 30 };
      setGenerals((prev) =>
        prev.map((gen) =>
          gen.id === g.id
            ? {
                ...gen,
                targetPosition: { x: ROUND_TABLE.x + offset.x, y: ROUND_TABLE.y + offset.y },
                currentState: "walking" as SpriteState,
                currentActivity: "Heading to the roundtable",
              }
            : gen
        )
      );
      addEvent(g.emoji, `${g.name} walks to the roundtable`);
    } else if (roll < 0.8) {
      // Collaboration
      const collab = pick(COLLAB_ACTIONS);
      const target = gens.find((g) => g.id === collab.to);
      if (target) {
        const offset = { x: (Math.random() - 0.5) * 30, y: 20 };
        setGenerals((prev) =>
          prev.map((gen) =>
            gen.id === collab.from
              ? {
                  ...gen,
                  targetPosition: { x: target.stationPosition.x + offset.x, y: target.stationPosition.y + offset.y },
                  currentState: "walking" as SpriteState,
                  currentActivity: collab.text,
                }
              : gen
          )
        );
        const fromGen = gens.find((g) => g.id === collab.from);
        if (fromGen) addEvent(fromGen.emoji, `${fromGen.name} is ${collab.text}`);
      }
    } else {
      // Return to station
      const g = pick(gens);
      setGenerals((prev) =>
        prev.map((gen) =>
          gen.id === g.id
            ? {
                ...gen,
                targetPosition: gen.stationPosition,
                currentState: "walking" as SpriteState,
                currentActivity: "Returning to station",
              }
            : gen
        )
      );
      addEvent(g.emoji, `${g.name} returns to their station`);
    }
  }, [setGenerals, addEvent]);

  // Trigger random actions
  useEffect(() => {
    const schedule = () => {
      const delay = 3000 + Math.random() * 5000;
      return setTimeout(() => {
        triggerAction();
        timerRef.current = schedule();
      }, delay);
    };
    const timerRef = { current: schedule() };
    return () => clearTimeout(timerRef.current);
  }, [triggerAction]);

  // Movement interpolation
  useEffect(() => {
    const iv = setInterval(() => {
      setGenerals((prev) =>
        prev.map((gen) => {
          if (!gen.targetPosition) return gen;
          const dx = gen.targetPosition.x - gen.position.x;
          const dy = gen.targetPosition.y - gen.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 3) {
            // Arrived
            const arrivedState: SpriteState =
              gen.currentActivity.includes("roundtable") || gen.currentActivity.includes("report")
                ? "talking"
                : gen.currentActivity.includes("Returning") || gen.currentActivity.includes("station")
                ? "working"
                : Math.random() > 0.5
                ? "working"
                : "thinking";
            return {
              ...gen,
              position: gen.targetPosition,
              targetPosition: null,
              currentState: arrivedState,
            };
          }
          const speed = 2.5;
          const nx = gen.position.x + (dx / dist) * speed;
          const ny = gen.position.y + (dy / dist) * speed;
          return { ...gen, position: { x: nx, y: ny }, currentState: "walking" };
        })
      );
    }, 33);
    return () => clearInterval(iv);
  }, [setGenerals]);
}
