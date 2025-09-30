const COLORS: Record<string, string> = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
  "정보없음": "#607d8b"
};

type Props = {
  level: string;
};

export function RiskBadge({ level }: Props) {
  const normalized = level.toLowerCase();
  const color = COLORS[normalized] ?? COLORS[level] ?? COLORS["정보없음"];
  return (
    <span className="badge" style={{ backgroundColor: color }}>
      {level}
    </span>
  );
}
