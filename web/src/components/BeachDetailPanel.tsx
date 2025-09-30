import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { EventItem, ObservationResponse, SafetyAlert } from "../types";
import { AccordionSection } from "./AccordionSection";
import { EventList } from "./EventList";
import { MetricCard } from "./MetricCard";
import { RiskBadge } from "./RiskBadge";

const mockSafetyGuides = [
  "수상 활동 전 구명조끼를 반드시 착용하세요.",
  "경보 발령 시 즉시 해변 밖으로 이동하고 구조대 지시에 따르세요.",
  "해파리 출현 시 물 밖으로 나오고 식염수로 씻어내세요.",
  "혼자 수영하지 말고 항상 동반자와 함께하세요.",
];

type Props = {
  beach: {
    id: string;
    name: string;
    region: string;
    latitude: number;
    longitude: number;
    amenities: string[];
    openSeason?: string | null;
    safetyLevel?: string | null;
  };
  observation?: ObservationResponse | null;
  alerts: SafetyAlert[];
  events: EventItem[];
};

function minutesDiff(from?: string) {
  if (!from) return Infinity;
  const observed = new Date(from).getTime();
  return (Date.now() - observed) / 1000 / 60;
}

export function BeachDetailPanel({ beach, observation, alerts, events }: Props) {
  const center = useMemo(() => [beach.latitude, beach.longitude] as [number, number], [beach]);
  const metrics = observation?.data;
  const meta = observation?.meta;
  const isStale = minutesDiff(observation?.data.observedAt) > 30;
  const hasCriticalAlert = alerts.some((alert) => ["high", "medium"].includes(alert.severity));

  return (
    <section className="detail-panel" aria-label={`${beach.name} 상세 정보`}>
      <header className="detail-panel__header">
        <div>
          <h2>{beach.name}</h2>
          <span className="detail-panel__region">{beach.region}</span>
        </div>
        <RiskBadge level={beach.safetyLevel} reliability={meta?.reliability} />
      </header>

      <AccordionSection title="실시간 지표" defaultOpen badge={meta?.source}>
        <div className="metric-grid">
          <MetricCard
            label="수온"
            value={metrics?.seaSurfaceTemp}
            unit="°C"
            updatedAt={meta?.updatedAt}
            source={meta?.source}
            reliability={meta?.reliability}
            sparkline={metrics ? generateSparkline(metrics.seaSurfaceTemp) : undefined}
            stale={isStale}
          />
          <MetricCard
            label="파고"
            value={metrics?.waveHeight}
            unit="m"
            updatedAt={meta?.updatedAt}
            source={meta?.source}
            reliability={meta?.reliability}
            sparkline={metrics ? generateSparkline(metrics.waveHeight) : undefined}
            stale={isStale}
          />
          <MetricCard
            label="풍속"
            value={metrics?.windSpeed}
            unit="m/s"
            updatedAt={meta?.updatedAt}
            source={meta?.source}
            reliability={meta?.reliability}
            sparkline={metrics ? generateSparkline(metrics.windSpeed) : undefined}
            stale={isStale}
          />
          <MetricCard
            label="조석"
            value={metrics?.tideLevel}
            unit="m"
            updatedAt={meta?.updatedAt}
            source={meta?.source}
            reliability={meta?.reliability}
            sparkline={metrics ? generateSparkline(metrics.tideLevel) : undefined}
            stale={isStale}
          />
        </div>
      </AccordionSection>

      <AccordionSection
        title="안전 경보"
        count={alerts.length}
        defaultOpen={hasCriticalAlert}
        badge={alerts.some((alert) => alert.severity === "high") ? "즉시 대피" : undefined}
      >
        {alerts.length === 0 ? (
          <p className="empty-state">현재 발효 중인 경보가 없습니다.</p>
        ) : (
          <ul className="alert-list">
            {alerts.map((alert) => (
              <li
                key={`${alert.alertType}-${alert.startsAt.toString()}`}
                className={`alert-list__item severity-${mapSeverity(alert.severity)}`}
              >
                <div>
                  <strong>{alert.alertType}</strong>
                  <p>{alert.message}</p>
                </div>
                <span className="alert-list__time">{new Date(alert.startsAt).toLocaleString("ko-KR")}</span>
              </li>
            ))}
          </ul>
        )}
      </AccordionSection>

      <AccordionSection title="편의시설 · 응급연락">
        <div className="amenities">
          <ul>
            {beach.amenities.map((amenity) => (
              <li key={amenity}>{amenity}</li>
            ))}
          </ul>
          <div className="amenities__contacts">
            <p>
              구조대 <a href="tel:119">119</a>
            </p>
            <p>
              해경 신고 <a href="tel:122">122</a>
            </p>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="행사 · 커뮤니티" count={events.length}>
        <EventList events={events} limit={3} />
      </AccordionSection>

      <AccordionSection title="보드 안전 수칙" defaultOpen>
        <ul className="safety-guide">
          {mockSafetyGuides.map((guide) => (
            <li key={guide}>{guide}</li>
          ))}
        </ul>
      </AccordionSection>

      <AccordionSection title="위치 안내">
        <div className="map-container">
          <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: 220 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={center}>
              <Popup>
                {beach.name}
                <br />
                {beach.region}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </AccordionSection>
    </section>
  );
}

function generateSparkline(base?: number) {
  if (base === undefined) return undefined;
  const values = Array.from({ length: 8 }).map((_, index) => base + Math.sin(index) * 0.2);
  return values;
}

function mapSeverity(severity: string) {
  const normalized = severity.toLowerCase();
  if (normalized === "medium" || normalized === "mid" || normalized === "low") {
    return "warning";
  }
  if (normalized === "high") return "high";
  return "info";
}
