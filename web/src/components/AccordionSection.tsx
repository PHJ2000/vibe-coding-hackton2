import { PropsWithChildren, useState } from "react";

export type AccordionSectionProps = PropsWithChildren<{
  title: string;
  count?: number;
  defaultOpen?: boolean;
  badge?: string;
}>;

export function AccordionSection({ title, count, defaultOpen = false, badge, children }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="accordion-section">
      <button type="button" className="accordion-section__trigger" onClick={() => setOpen((prev) => !prev)}>
        <div>
          <span className="accordion-section__title">{title}</span>
          {typeof count === "number" && <span className="accordion-section__count">{count}</span>}
          {badge && <span className="accordion-section__badge">{badge}</span>}
        </div>
        <span className={open ? "accordion-section__icon open" : "accordion-section__icon"} aria-hidden>
          ▶
        </span>
      </button>
      <div className={open ? "accordion-section__content open" : "accordion-section__content"}>{children}</div>
    </section>
  );
}
