import clsx from "clsx";
import { format } from "date-fns";

type Trend = "up" | "down" | "steady";

type Props = {
  label: string;
  value?: number | null;
  unit: string;
  updatedAt?: string;
  source?: string;
  reliability?: number;
  trend?: Trend;
  trendLabel?: string;
  sparkline?: number[];
  stale?: boolean;
};

function formatValue(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }
  const fixed = value >= 10 ? value.toFixed(1) : value.toFixed(2);
  return parseFloat(fixed).toString();
}

function formatTime(value?: string) {
  if (!value) return "-";
  try {
    return format(new Date(value), "HH:mm");
  } catch {
    return "-";
  }
}

function getReliabilityText(value?: number) {
  switch (value) {
    case 2:
      return "신뢰도 높음";
    case 1:
      return "신뢰도 중간";
    case 0:
      return "신뢰도 낮음";
    default:
      return "신뢰도 정보 없음";
  }
}

type SparklineProps = { values?: number[] };

function Sparkline({ values }: SparklineProps) {
  if (!values || values.length === 0) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const polygon = `0,100 ${points} 100,100`;

  return (
    <svg viewBox="0 0 100 100" className="sparkline" aria-hidden>
      <polygon points={polygon} className="sparkline__area" />
      <polyline points={points} className="sparkline__line" />
    </svg>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  updatedAt,
  source,
  reliability,
  sparkline,
  stale,
}: Props) {
  return (
    <article className={clsx("metric-card", stale && "metric-card--stale")}>
      <header className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        {trend && (
          <span className={clsx("metric-card__trend", `trend-${trend}`)}>
            {trend === "up" && "▲"}
            {trend === "down" && "▼"}
            {trend === "steady" && "■"}
            <span className="sr-only">{trendLabel ?? "최근 추세"}</span>
          </span>
        )}
      </header>
      <div className="metric-card__value">
        <span className="metric-card__number">{formatValue(value)}</span>
        <span className="metric-card__unit">{unit}</span>
      </div>
      <Sparkline values={sparkline} />
      <footer className="metric-card__meta">
        <span className="metric-card__source">
          {stale ? <span className="metric-card__badge">참고용(30+분)</span> : null}
          업데이트 {formatTime(updatedAt)} · {source ?? "출처 확인 중"}
        </span>
        <span className="metric-card__reliability" aria-label={getReliabilityText(reliability)}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <span key={idx} className={clsx("reliability-dot", idx <= (reliability ?? -1) - 1 && "filled")} />
          ))}
        </span>
      </footer>
    </article>
  );
}
