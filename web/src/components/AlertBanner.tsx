import clsx from "clsx";

type Severity = "info" | "warning" | "high";

type Props = {
  severity: Severity;
  message: string;
  startsAt?: string;
  onDismiss?: () => void;
};

const SEVERITY_ICON: Record<Severity, string> = {
  info: "ℹ",
  warning: "⚠",
  high: "!",
};

export function AlertBanner({ severity, message, startsAt, onDismiss }: Props) {
  return (
    <div className={clsx("alert-banner", `alert-${severity}`)} role="alert">
      <span className="alert-banner__icon" aria-hidden>
        {SEVERITY_ICON[severity]}
      </span>
      <div className="alert-banner__content">
        <p>{message}</p>
        {startsAt && <span className="alert-banner__timestamp">발효 {new Date(startsAt).toLocaleString("ko-KR")}</span>}
      </div>
      <div className="alert-banner__actions">
        <a className="btn btn-inverted" href="tel:119">구조대 전화</a>
        {onDismiss && (
          <button type="button" className="alert-banner__dismiss" onClick={onDismiss} aria-label="경보 숨기기">
            닫기
          </button>
        )}
      </div>
    </div>
  );
}
