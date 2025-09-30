import { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  caption?: string;
};

export function MetricCard({ label, value, caption }: Props) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {caption && <span className="metric-caption">{caption}</span>}
    </div>
  );
}
