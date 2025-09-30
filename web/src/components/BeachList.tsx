import { Dispatch, SetStateAction } from "react";

import { RiskBadge } from "./RiskBadge";

type Beach = {
  id: string;
  name: string;
  region: string;
  safetyLevel?: string | null;
};

type Props = {
  beaches: Beach[];
  selectedId?: string;
  onSelect: Dispatch<SetStateAction<Beach | null>>;
};

export function BeachList({ beaches, selectedId, onSelect }: Props) {
  return (
    <ul className="list">
      {beaches.map((beach) => (
        <li
          key={beach.id}
          className={selectedId === beach.id ? "list-item selected" : "list-item"}
          onClick={() => onSelect(beach)}
        >
          <div>
            <strong>{beach.name}</strong>
            <p>{beach.region}</p>
          </div>
          <RiskBadge level={beach.safetyLevel ?? "정보없음"} />
        </li>
      ))}
    </ul>
  );
}
