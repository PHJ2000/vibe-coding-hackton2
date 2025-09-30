import clsx from "clsx";

import { RiskBadge } from "./RiskBadge";

export type BeachListItem = {
  id: string;
  name: string;
  region: string;
  safetyLevel?: string | null;
  distanceKm?: number;
};

type ObservationSummary = {
  data?: {
    seaSurfaceTemp?: number;
    waveHeight?: number;
    windSpeed?: number;
  };
  meta?: {
    reliability?: number;
  };
};

type Props = {
  beaches: BeachListItem[];
  selectedId?: string;
  onSelect: (beachId: string) => void;
  observations: Record<string, ObservationSummary | undefined>;
};

function formatDistance(value?: number) {
  if (value === undefined) return null;
  if (value < 1) return `${Math.round(value * 1000)}m`;
  return `${value.toFixed(1)}km`;
}

function formatMetric(value?: number, unit = "") {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `${value.toFixed(1)}${unit}`;
}

export function BeachList({ beaches, selectedId, onSelect, observations }: Props) {
  if (beaches.length === 0) {
    return <p className="empty-state">조건에 맞는 해변이 없습니다.</p>;
  }

  return (
    <ul className="beach-list" aria-label="해변 목록">
      {beaches.map((beach) => {
        const observation = observations[beach.id];
        const distanceLabel = formatDistance(beach.distanceKm);
        return (
          <li
            key={beach.id}
            className={clsx("beach-list__item", selectedId === beach.id && "active")}
            onClick={() => onSelect(beach.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(beach.id);
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={selectedId === beach.id}
          >
            <div className="beach-list__header">
              <div>
                <strong className="beach-list__name">{beach.name}</strong>
                <span className="beach-list__region">
                  {beach.region}
                  {distanceLabel && <span className="beach-list__distance">· {distanceLabel}</span>}
                </span>
              </div>
              <RiskBadge level={beach.safetyLevel} reliability={observation?.meta?.reliability} />
            </div>
            <div className="beach-list__metrics">
              <span>수온 {formatMetric(observation?.data?.seaSurfaceTemp, "°C")}</span>
              <span>파고 {formatMetric(observation?.data?.waveHeight, "m")}</span>
              <span>풍속 {formatMetric(observation?.data?.windSpeed, "m/s")}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
