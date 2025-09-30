import { RecommendationItem } from "../App";
import { RiskBadge } from "./RiskBadge";

type Props = {
  items: RecommendationItem[];
  onSelect: (beachId: string) => void;
};

export function RecommendationList({ items, onSelect }: Props) {
  return (
    <ul className="recommendation-list">
      {items.map((item) => (
        <li key={item.beach.id} onClick={() => onSelect(item.beach.id)}>
          <div>
            <strong>{item.beach.name}</strong>
            <span className="score">추천 점수 {Math.round(item.score * 100)}</span>
          </div>
          <RiskBadge level={item.beach.safetyLevel ?? "정보없음"} />
        </li>
      ))}
    </ul>
  );
}
