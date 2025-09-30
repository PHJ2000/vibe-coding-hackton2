import { EventItem } from "../App";

type Props = {
  events: EventItem[];
};

export function EventList({ events }: Props) {
  if (events.length === 0) {
    return <p>현재 예정된 일정이 없습니다.</p>;
  }

  return (
    <ul className="event-list">
      {events.map((event) => (
        <li key={event.id}>
          <div>
            <strong>{event.title}</strong>
            <p>{event.description}</p>
          </div>
          <span>{new Date(event.startsAt).toLocaleString("ko-KR")}</span>
        </li>
      ))}
    </ul>
  );
}
