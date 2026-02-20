"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getEvents, getMissions, getGenerals } from "./api";

export interface RealEvent {
  id: string;
  type: string;
  generalId?: string;
  emoji?: string;
  message: string;
  timestamp: string;
}

export interface RealMission {
  id: string;
  title: string;
  status: string;
  progress?: number;
  assignedGeneral?: string;
}

export interface GeneralStatus {
  id: string;
  name: string;
  emoji: string;
  status: string;
}

export interface ActivityData {
  events: RealEvent[];
  missions: RealMission[];
  generals: GeneralStatus[];
  loading: boolean;
  lastUpdate: number | null;
  eventCount: number;
  missionCount: number;
}

export function useActivity(): ActivityData {
  const [events, setEvents] = useState<RealEvent[]>([]);
  const [missions, setMissions] = useState<RealMission[]>([]);
  const [generals, setGenerals] = useState<GeneralStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const mountedRef = useRef(true);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      if (!mountedRef.current) return;
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data.slice(0, 50));
        setLastUpdate(Date.now());
      }
    } catch {
      // API may not be available yet — silent fail
    }
  }, []);

  const fetchMissions = useCallback(async () => {
    try {
      const data = await getMissions();
      if (!mountedRef.current) return;
      if (Array.isArray(data)) {
        setMissions(data);
        setLastUpdate(Date.now());
      }
    } catch {
      // silent fail
    }
  }, []);

  const fetchGenerals = useCallback(async () => {
    try {
      const data = await getGenerals();
      if (!mountedRef.current) return;
      if (Array.isArray(data)) {
        setGenerals(data);
      }
    } catch {
      // silent fail
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    mountedRef.current = true;
    fetchEvents();
    fetchMissions();
    fetchGenerals();
    return () => { mountedRef.current = false; };
  }, [fetchEvents, fetchMissions, fetchGenerals]);

  // Poll events every 5s
  useEffect(() => {
    const iv = setInterval(fetchEvents, 5000);
    return () => clearInterval(iv);
  }, [fetchEvents]);

  // Poll missions every 10s
  useEffect(() => {
    const iv = setInterval(fetchMissions, 10000);
    return () => clearInterval(iv);
  }, [fetchMissions]);

  // Poll generals every 15s
  useEffect(() => {
    const iv = setInterval(fetchGenerals, 15000);
    return () => clearInterval(iv);
  }, [fetchGenerals]);

  return {
    events,
    missions,
    generals,
    loading,
    lastUpdate,
    eventCount: events.length,
    missionCount: missions.length,
  };
}
