const OPTIONS = [
  { id: "family", label: "가족" },
  { id: "surfing", label: "서핑" },
  { id: "low-crowd", label: "혼잡도 낮음" },
  { id: "warm", label: "따뜻한 수온" },
];

type Props = {
  selected: string[];
  onChange: (values: string[]) => void;
};

export function FilterChips({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="filter-chips" role="group" aria-label="선호 필터">
      {OPTIONS.map((option) => {
        const isActive = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            className={isActive ? "filter-chip active" : "filter-chip"}
            onClick={() => toggle(option.id)}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
