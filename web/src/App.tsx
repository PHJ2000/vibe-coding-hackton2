import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { AlertBanner } from "./components/AlertBanner";
import { BeachList } from "./components/BeachList";
import { BeachDetailPanel } from "./components/BeachDetailPanel";
import { EventList } from "./components/EventList";
import { FilterChips } from "./components/FilterChips";
import { RecommendationList } from "./components/RecommendationList";
import { StickySummary } from "./components/StickySummary";
import {
  Beach,
  EventItem,
  ObservationResponse,
  RecommendationItem,
  SafetyAlert,
  SafetyAlertResponse,
} from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
});

type ObservationsMap = Record<string, ObservationResponse | undefined>;

function useBeaches() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  useEffect(() => {
    api.get<{ data: Beach[] }>("/beaches").then((res) => setBeaches(res.data.data));
  }, []);
  return beaches;
}

function useObservationsMap(beaches: Beach[]): ObservationsMap {
  const [observations, setObservations] = useState<ObservationsMap>({});

  useEffect(() => {
    if (beaches.length === 0) return;
    let active = true;
    Promise.all(
      beaches.map(async (beach) => {
        const res = await api.get<ObservationResponse>(`/beaches/${beach.id}/observations`);
        return [beach.id, res.data] as const;
      })
    )
      .then((entries) => {
        if (!active) return;
        setObservations(Object.fromEntries(entries));
      })
      .catch(() => {
        /* no-op */
      });
    return () => {
      active = false;
    };
  }, [beaches]);

  return observations;
}

function useRecommendations() {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  useEffect(() => {
    api.get<{ data: RecommendationItem[] }>("/recommendations").then((res) => setItems(res.data.data));
  }, []);
  return items;
}

function useEvents(region?: string) {
  const [events, setEvents] = useState<EventItem[]>([]);
  useEffect(() => {
    if (!region) return;
    let active = true;
    api
      .get<{ data: EventItem[] }>("/events", { params: { region } })
      .then((res) => {
        if (active) setEvents(res.data.data);
      })
      .catch(() => setEvents([]));
    return () => {
      active = false;
    };
  }, [region]);
  return events;
}

function useAlerts(beachId?: string) {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  useEffect(() => {
    if (!beachId) return;
    let active = true;
    api
      .get<SafetyAlertResponse>(`/beaches/${beachId}/alerts`)
      .then((res) => {
        if (active) setAlerts(res.data.data);
      })
      .catch(() => setAlerts([]));
    return () => {
      active = false;
    };
  }, [beachId]);
  return alerts;
}

function computeDistanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(R * c * 10) / 10;
}

function riskRank(level?: string | null) {
  const normalized = level?.toLowerCase();
  if (normalized === "low") return 1;
  if (normalized === "medium" || normalized === "mid") return 2;
  if (normalized === "high") return 3;
  return 4;
}

const FILTERS: Record<string, (beach: Beach, observation?: ObservationResponse) => boolean> = {
  family: (beach) => beach.amenities.includes("샤워장"),
  surfing: (_, observation) => (observation?.data.waveHeight ?? 0) >= 0.5,
  "low-crowd": () => true,
  warm: (_, observation) => (observation?.data.seaSurfaceTemp ?? 0) >= 23,
};

export default function App() {
  const beaches = useBeaches();
  const observations = useObservationsMap(beaches);
  const recommendations = useRecommendations();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && beaches.length > 0) {
      setSelectedId(beaches[0].id);
    }
  }, [beaches, selectedId]);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("위치 권한이 필요합니다. 수동으로 검색하세요.");
        } else {
          setLocationError("위치를 확인할 수 없습니다. 수동으로 검색하세요.");
        }
      }
    );
  }, []);

  const selectedBeach = useMemo(
    () => beaches.find((beach) => beach.id === selectedId) ?? null,
    [beaches, selectedId]
  );
  const alerts = useAlerts(selectedBeach?.id);
  const events = useEvents(selectedBeach?.region);
  const selectedObservation = selectedBeach ? observations[selectedBeach.id] : undefined;

  useEffect(() => {
    setAlertDismissed(false);
  }, [selectedId]);

  const highSeverityAlert = useMemo(
    () => alerts.find((alert) => alert.severity === "high"),
    [alerts]
  );

  const distanceMap = useMemo(() => {
    if (!location) return {} as Record<string, number>;
    return Object.fromEntries(
      beaches.map((beach) => [
        beach.id,
        computeDistanceKm(
          { lat: location.lat, lon: location.lon },
          { lat: beach.latitude, lon: beach.longitude }
        ),
      ])
    );
  }, [beaches, location]);

  const filteredBeaches = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return beaches
      .map((beach) => ({ ...beach, distanceKm: distanceMap[beach.id] }))
      .filter((beach) => {
        if (!keyword) return true;
        return beach.name.toLowerCase().includes(keyword) || beach.region.toLowerCase().includes(keyword);
      })
      .filter((beach) =>
        filters.every((filter) => {
          const predicate = FILTERS[filter];
          if (!predicate) return true;
          return predicate(beach, observations[beach.id]);
        })
      )
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }, [beaches, distanceMap, filters, observations, searchTerm]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((item) =>
      filters.every((filter) => {
        const predicate = FILTERS[filter];
        if (!predicate) return true;
        return predicate(item.beach, observations[item.beach.id]);
      })
    );
  }, [filters, observations, recommendations]);

  const observationSummaries = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(observations).map(([id, value]) => [
          id,
          value
            ? {
                data: {
                  seaSurfaceTemp: value.data.seaSurfaceTemp,
                  waveHeight: value.data.waveHeight,
                  windSpeed: value.data.windSpeed,
                },
                meta: value.meta,
              }
            : undefined,
        ])
      ),
    [observations]
  );

  const heroCTA = () => {
    const candidates = filteredBeaches.filter((beach) => riskRank(beach.safetyLevel) <= 2);
    if (candidates.length === 0) {
      const fallback = [...recommendations].sort((a, b) => b.score - a.score)[0];
      if (fallback) setSelectedId(fallback.beach.id);
      return;
    }
    const sorted = [...candidates].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    setSelectedId(sorted[0].id);
  };

  const selectPersonalized = () => {
    const byRecommendation = filteredRecommendations[0];
    if (byRecommendation) {
      setSelectedId(byRecommendation.beach.id);
      return;
    }
    const fallback = filteredBeaches[0];
    if (fallback) {
      setSelectedId(fallback.id);
    }
  };

  const requestLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationError(null);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("위치 권한이 필요합니다. 수동으로 검색하세요.");
        } else {
          setLocationError("위치를 확인할 수 없습니다. 수동으로 검색하세요.");
        }
      }
    );
  };

  return (
    <div className="app">
      {highSeverityAlert && !alertDismissed && (
        <AlertBanner
          severity="high"
          message={highSeverityAlert.message}
          startsAt={highSeverityAlert.startsAt}
          onDismiss={() => setAlertDismissed(true)}
        />
      )}
      <header className="hero">
        <div className="hero__copy">
          <h1>오늘 가장 안전한 해변을 5초 만에.</h1>
          <p>실시간 안전 지표·행사·동행 정보를 한 화면에 모았습니다.</p>
        </div>
        <div className="hero__controls">
          <div className="search-bar">
            <span className="search-bar__icon" aria-hidden>
              🔍
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="해변명 또는 지역으로 검색"
              aria-label="해변 검색"
            />
          </div>
          <FilterChips selected={filters} onChange={setFilters} />
          <div className="hero__cta-row">
            <button type="button" className="btn btn-primary" onClick={heroCTA}>
              가까운 안전한 해변 보기
            </button>
            <button type="button" className="btn btn-tertiary" onClick={selectPersonalized}>
              내 조건 맞춤 추천
            </button>
          </div>
          {locationError && (
            <div className="location-banner" role="status">
              {locationError}
              <button type="button" onClick={requestLocation} className="btn-link">
                위치 다시 요청
              </button>
            </div>
          )}
        </div>
      </header>

      <StickySummary
        beach={selectedBeach}
        observation={selectedObservation ?? null}
        onNavigate={() => document.querySelector(".map-container")?.scrollIntoView({ behavior: "smooth" })}
      />

      <main className="layout">
        <section className="layout__column layout__column--recommendations">
          <h2>추천 해변</h2>
          <RecommendationList
            items={filteredRecommendations}
            observations={observationSummaries}
            onSelect={setSelectedId}
          />
          <h2>전체 해변</h2>
          <BeachList
            beaches={filteredBeaches}
            selectedId={selectedId ?? undefined}
            onSelect={setSelectedId}
            observations={observationSummaries}
          />
        </section>

        <section className="layout__column layout__column--detail">
          {selectedBeach && (
            <BeachDetailPanel
              beach={selectedBeach}
              observation={selectedObservation ?? null}
              alerts={alerts}
              events={events}
            />
          )}
        </section>

        <aside className="layout__column layout__column--events">
          <h2>주요 행사</h2>
          <EventList events={events} />
        </aside>
      </main>

      <nav className="bottom-nav" aria-label="주요 메뉴">
        <button type="button" className="bottom-nav__item" aria-label="홈">
          🏠
          <span>홈</span>
        </button>
        <button type="button" className="bottom-nav__item" aria-label="지도 보기">
          🗺
          <span>지도</span>
        </button>
        <button type="button" className="bottom-nav__item" aria-label="커뮤니티">
          🤝
          <span>커뮤니티</span>
        </button>
        <button type="button" className="bottom-nav__item" aria-label="알림">
          🔔
          <span>알림</span>
        </button>
      </nav>
    </div>
  );
}
