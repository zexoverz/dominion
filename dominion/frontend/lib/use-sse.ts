"use client";

import { useEffect, useRef, useCallback } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dominion-api-production.up.railway.app";

export interface SSEEvent {
  type: string;
  payload: any;
}

interface UseSSEOptions {
  /** Called on every SSE event */
  onEvent: (event: SSEEvent) => void;
  /** Whether to connect (default true) */
  enabled?: boolean;
}

/**
 * SSE hook with auto-reconnect and exponential backoff.
 * Returns { connected } state.
 */
export function useSSE({ onEvent, enabled = true }: UseSSEOptions) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connectedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let es: EventSource | null = null;
    let retryDelay = 1000;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let unmounted = false;

    function connect() {
      if (unmounted) return;
      try {
        es = new EventSource(`${API_BASE}/api/stream`);
      } catch {
        scheduleRetry();
        return;
      }

      es.onopen = () => {
        retryDelay = 1000; // reset backoff on successful connect
        connectedRef.current = true;
      };

      es.onmessage = (ev) => {
        try {
          const data: SSEEvent = JSON.parse(ev.data);
          onEventRef.current(data);
        } catch {
          // ignore malformed events
        }
      };

      es.onerror = () => {
        connectedRef.current = false;
        es?.close();
        es = null;
        scheduleRetry();
      };
    }

    function scheduleRetry() {
      if (unmounted) return;
      retryTimer = setTimeout(() => {
        connect();
      }, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30000); // max 30s
    }

    connect();

    return () => {
      unmounted = true;
      connectedRef.current = false;
      es?.close();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [enabled]);
}
