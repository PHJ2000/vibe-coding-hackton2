import clsx from "clsx";

const LEVEL_CONFIG = {
  low: {
    label: "안전", // safe
    icon: "✔",
    colorVar: "--color-success",
  },
  medium: {
    label: "주의",
    icon: "⚠",
    colorVar: "--color-warning",
  },
  high: {
    label: "위험",
    icon: "!",
    colorVar: "--color-danger",
  },
};

type RiskLevelKey = keyof typeof LEVEL_CONFIG;

type Props = {
  level?: string | null;
  reliability?: number;
  compact?: boolean;
};

function formatLevel(level?: string | null): RiskLevelKey | "unknown" {
  if (!level) return "unknown";
  const normalized = level.toLowerCase();
  if (normalized === "mid") return "medium";
  if (normalized in LEVEL_CONFIG) {
    return normalized as RiskLevelKey;
  }
  return "unknown";
}

function getReliabilityLabel(value?: number) {
  switch (value) {
    case 2:
      return "신뢰도: 높음";
    case 1:
      return "신뢰도: 중간";
    case 0:
      return "신뢰도: 낮음";
    default:
      return "신뢰도 정보 없음";
  }
}

export function RiskBadge({ level, reliability, compact = false }: Props) {
  const normalized = formatLevel(level);
  const config = normalized === "unknown" ? LEVEL_CONFIG.low : LEVEL_CONFIG[normalized];
  const labelText = normalized === "unknown" ? level ?? "정보 없음" : config.label;

  return (
    <span
      className={clsx(
        "risk-badge",
        compact && "risk-badge--compact",
        `risk-${normalized}`,
        normalized === "unknown" ? "risk-unknown" : null
      )}
      style={normalized !== "unknown" ? { color: `var(${config.colorVar})` } : undefined}
    >
      <span className="risk-badge__icon" aria-hidden>
        {normalized === "unknown" ? "?" : config.icon}
      </span>
      <span className="risk-badge__label">{labelText}</span>
      {typeof reliability === "number" && (
        <span className="risk-badge__reliability" role="img" aria-label={getReliabilityLabel(reliability)}>
          {Array.from({ length: 3 }).map((_, index) => (
            <span key={index} className={clsx("reliability-dot", index <= reliability - 1 && "filled")} />
          ))}
        </span>
      )}
    </span>
  );
}
