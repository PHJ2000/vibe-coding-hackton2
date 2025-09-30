import { EventItem } from "../types";

type Props = {
  events: EventItem[];
  limit?: number;
};

export function EventList({ events, limit = 6 }: Props) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        행사 데이터가 늦고 있어요. 잠시 후 다시 시도하거나 다른 해변을 확인해 보세요.
      </div>
    );
  }

  return (
    <ul className="event-list" aria-label="주변 행사">
      {events.slice(0, limit).map((event) => (
        <li key={event.id} className="event-list__item">
          <div className="event-list__body">
            <strong className="event-list__title">{event.title}</strong>
            <p className="event-list__description">{event.description}</p>
            <div className="event-list__meta">
              <span>{new Date(event.startsAt).toLocaleString("ko-KR")}</span>
              {event.price && <span className="event-list__price">{event.price}</span>}
            </div>
          </div>
          <a className="btn btn-secondary" href={`https://map.kakao.com/?q=${encodeURIComponent(event.title)}`} target="_blank" rel="noreferrer">
            길찾기
          </a>
        </li>
      ))}
    </ul>
  );
}
