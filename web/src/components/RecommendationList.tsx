import { RecommendationItem } from "../types";
import { RiskBadge } from "./RiskBadge";

export type RecommendationListProps = {
  items: RecommendationItem[];
  observations: Record<string, {
    data?: {
      seaSurfaceTemp?: number;
      waveHeight?: number;
      windSpeed?: number;
    };
    meta?: {
      reliability?: number;
    };
  } | undefined>;
  onSelect: (beachId: string) => void;
};

function formatScore(score?: number) {
  if (score === undefined) return "-";
  return Math.round((score ?? 0) * 100);
}

function formatMetric(value?: number, unit = "") {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `${value.toFixed(1)}${unit}`;
}

export function RecommendationList({ items, observations, onSelect }: RecommendationListProps) {
  if (items.length === 0) {
    return <p className="empty-state">추천 데이터를 준비 중입니다.</p>;
  }

  return (
    <ul className="recommendation-list" aria-label="추천 해변">
      {items.slice(0, 5).map((item) => {
        const observation = observations[item.beach.id];
        return (
          <li key={item.beach.id} className="recommendation-list__item" onClick={() => onSelect(item.beach.id)}>
            <div className="recommendation-list__headline">
              <div>
                <strong className="recommendation-list__name">{item.beach.name}</strong>
                <span className="recommendation-list__reason">{item.reason}</span>
              </div>
              <RiskBadge level={item.beach.safetyLevel} reliability={observation?.meta?.reliability} />
            </div>
            <div className="recommendation-list__metrics">
              <span>수온 {formatMetric(observation?.data?.seaSurfaceTemp, "°C")}</span>
              <span>파고 {formatMetric(observation?.data?.waveHeight, "m")}</span>
              <span>풍속 {formatMetric(observation?.data?.windSpeed, "m/s")}</span>
              <span className="recommendation-list__score">추천 {formatScore(item.score)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
