import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BeachList } from "./components/BeachList";
import { BeachDetailPanel } from "./components/BeachDetailPanel";
import { EventList } from "./components/EventList";
import { RecommendationList } from "./components/RecommendationList";

type Beach = {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  openSeason?: string;
  safetyLevel?: string | null;
};

type Observation = {
  data: {
    observedAt: string;
    seaSurfaceTemp: number;
    waveHeight: number;
    windSpeed: number;
    tideLevel: number;
  };
  meta: {
    source: string;
    updatedAt: string;
    reliability: number;
  };
};

type Alert = {
  alertType: string;
  severity: string;
  message: string;
  startsAt: string;
  endsAt?: string | null;
};

export type EventItem = {
  id: number;
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string | null;
  latitude: number;
  longitude: number;
  tags: string[];
  price?: string | null;
};

export type RecommendationItem = {
  beach: Beach;
  score: number;
  reason: string;
  meta: {
    source: string;
    updatedAt: string;
    reliability: number;
  };
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000"
});

function useBeaches() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [selected, setSelected] = useState<Beach | null>(null);

  useEffect(() => {
    api.get("/beaches").then((res) => {
      setBeaches(res.data.data);
      setSelected(res.data.data[0] ?? null);
    });
  }, []);

  return { beaches, selected, setSelected };
}

function useObservation(beachId?: string) {
  const [observation, setObservation] = useState<Observation | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!beachId) return;
    api.get(`/beaches/${beachId}/observations`).then((res) => setObservation(res.data));
    api.get(`/beaches/${beachId}/alerts`).then((res) => setAlerts(res.data.data));
  }, [beachId]);

  return { observation, alerts };
}

function useEvents(region?: string) {
  const [events, setEvents] = useState<EventItem[]>([]);
  useEffect(() => {
    api.get("/events", { params: { region } }).then((res) => setEvents(res.data.data));
  }, [region]);
  return events;
}

function useRecommendations() {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  useEffect(() => {
    api.get("/recommendations").then((res) => setItems(res.data.data));
  }, []);
  return items;
}

export default function App() {
  const { beaches, selected, setSelected } = useBeaches();
  const { observation, alerts } = useObservation(selected?.id);
  const events = useEvents(selected?.region);
  const recommendations = useRecommendations();

  const selectedEvents = useMemo(() => events.slice(0, 4), [events]);

  return (
    <div className="app">
      <header>
        <h1>BeachHub</h1>
        <p>부산/제주 대표 해변의 실시간 정보, 행사, 추천을 한눈에.</p>
      </header>
      <main>
        <section className="sidebar">
          <h2>추천 해변</h2>
          <RecommendationList items={recommendations} onSelect={(beachId) => {
            const found = beaches.find((beach) => beach.id === beachId);
            if (found) setSelected(found);
          }} />
          <h2>전체 해변</h2>
          <BeachList beaches={beaches} selectedId={selected?.id} onSelect={setSelected} />
        </section>
        <section className="content">
          {selected && (
            <BeachDetailPanel
              beach={selected}
              observation={observation ?? undefined}
              alerts={alerts}
              events={selectedEvents}
            />
          )}
          <section className="events">
            <h2>행사 & 체험</h2>
            <EventList events={events} />
          </section>
        </section>
      </main>
    </div>
  );
}
