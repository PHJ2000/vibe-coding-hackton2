import { RiskBadge } from "./RiskBadge";

export type StickySummaryProps = {
  beach?: {
    id: string;
    name: string;
    safetyLevel?: string | null;
  } | null;
  observation?: {
    data: {
      seaSurfaceTemp: number;
      waveHeight: number;
      windSpeed: number;
      observedAt: string;
    };
    meta: {
      reliability?: number;
      source?: string;
      updatedAt?: string;
    };
  } | null;
  onNavigate?: () => void;
};

export function StickySummary({ beach, observation, onNavigate }: StickySummaryProps) {
  if (!beach) return null;
  const metrics = [
    { label: "수온", value: observation?.data.seaSurfaceTemp, unit: "°C" },
    { label: "파고", value: observation?.data.waveHeight, unit: "m" },
    { label: "풍속", value: observation?.data.windSpeed, unit: "m/s" },
  ];

  return (
    <div className="sticky-summary">
      <div className="sticky-summary__info">
        <div>
          <span className="sticky-summary__title">{beach.name}</span>
          <RiskBadge level={beach.safetyLevel} reliability={observation?.meta.reliability} compact />
        </div>
        <dl className="sticky-summary__metrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>
                {metric.value !== undefined && metric.value !== null
                  ? `${metric.value.toFixed(1)}${metric.unit}`
                  : "-"}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="sticky-summary__actions">
        <button type="button" className="btn btn-secondary" onClick={onNavigate}>
          지도 열기
        </button>
        <a className="btn btn-primary" href="tel:119" aria-label="구조대에 전화하기">
          구조대 전화
        </a>
      </div>
    </div>
  );
}
