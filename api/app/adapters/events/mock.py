from datetime import UTC, datetime, timedelta
from typing import Any


def _base_event() -> dict[str, Any]:
    now = datetime.now(UTC)
    return {
        "starts_at": now + timedelta(days=1),
        "ends_at": now + timedelta(days=1, hours=2),
        "latitude": 35.1587,
        "longitude": 129.1604,
        "tags": ["행사"],
        "price": "무료",
        "source": "mock-events",
        "reliability": 1,
    }


EVENTS: list[dict[str, Any]] = [
    {
        "id": 1,
        "title": "해운대 야간 버스킹",
        "description": "지역 뮤지션과 함께하는 야간 버스킹 공연",
        **_base_event(),
        "starts_at": datetime.now(UTC) + timedelta(days=1, hours=10),
        "ends_at": datetime.now(UTC) + timedelta(days=1, hours=12),
        "tags": ["공연", "야간"],
    },
    {
        "id": 2,
        "title": "광안리 비치 요가",
        "description": "일출을 보며 진행하는 비치 요가 클래스",
        **_base_event(),
        "starts_at": datetime.now(UTC) + timedelta(days=2, hours=6),
        "ends_at": datetime.now(UTC) + timedelta(days=2, hours=7),
        "latitude": 35.153,
        "longitude": 129.118,
        "tags": ["체험", "웰니스"],
        "price": "15,000원",
    },
]


def search_events(*, region: str | None = None) -> list[dict[str, Any]]:
    if region is None:
        return EVENTS
    return [event for event in EVENTS if region.lower() in event["title"].lower()]
