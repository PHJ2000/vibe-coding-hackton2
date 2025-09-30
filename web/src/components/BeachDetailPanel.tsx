import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { EventItem } from "../App";
import { MetricCard } from "./MetricCard";
import { RiskBadge } from "./RiskBadge";

type Props = {
  beach: {
    id: string;
    name: string;
    region: string;
    latitude: number;
    longitude: number;
    amenities: string[];
    openSeason?: string;
    safetyLevel?: string | null;
  };
  observation?: {
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
  alerts: Array<{
    alertType: string;
    severity: string;
    message: string;
    startsAt: string;
    endsAt?: string | null;
  }>;
  events: EventItem[];
};

export function BeachDetailPanel({ beach, observation, alerts, events }: Props) {
  const center = useMemo(() => [beach.latitude, beach.longitude] as [number, number], [beach]);

  return (
    <section className="detail">
      <header className="detail-header">
        <div>
          <h2>{beach.name}</h2>
          <p>{beach.region} · {beach.amenities.join(", ")}</p>
        </div>
        <RiskBadge level={beach.safetyLevel ?? "정보없음"} />
      </header>

      <div className="metrics">
        <MetricCard label="수온" value={`${observation?.data.seaSurfaceTemp ?? "-"}℃`} caption="관측" />
        <MetricCard label="파고" value={`${observation?.data.waveHeight ?? "-"} m`} caption="관측" />
        <MetricCard label="풍속" value={`${observation?.data.windSpeed ?? "-"} m/s`} caption="관측" />
        <MetricCard label="조석" value={`${observation?.data.tideLevel ?? "-"} m`} caption="관측" />
      </div>

      <section className="alerts">
        <h3>안전 경보</h3>
        {alerts.length === 0 ? (
          <p>현재 등록된 경보가 없습니다.</p>
        ) : (
          <ul>
            {alerts.map((alert) => (
              <li key={`${alert.alertType}-${alert.startsAt}`}>
                <strong>{alert.alertType}</strong>
                <span className={`severity ${alert.severity}`}>{alert.severity}</span>
                <p>{alert.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="map">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: 240 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={center}>
            <Popup>
              {beach.name}<br />{beach.region}
            </Popup>
          </Marker>
        </MapContainer>
      </section>

      <section className="events-inline">
        <h3>주요 이벤트</h3>
        {events.length === 0 ? <p>선택한 해변 주변 일정이 없습니다.</p> : (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.title}</strong>
                <span>{new Date(event.startsAt).toLocaleString("ko-KR")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
