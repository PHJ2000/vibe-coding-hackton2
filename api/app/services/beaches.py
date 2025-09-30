from datetime import UTC, datetime, timedelta
from typing import Any

from app.adapters.events import mock as events_adapter
from app.adapters.marine import mock as marine_adapter
from app.adapters.safety import mock as safety_adapter
from app.schemas.base import BeachDetail, Metadata, RecommendationItem, RecommendationResponse
from app.services.scoring import SafetyContext, compute_recommendation_score, compute_safety_score

MOCK_BEACHES: list[dict[str, Any]] = [
    {
        "id": "haeundae",
        "name": "해운대 해수욕장",
        "region": "부산",
        "latitude": 35.1587,
        "longitude": 129.1604,
        "amenities": ["샤워장", "응급의료소", "주차장"],
        "open_season": "06-01~09-10",
        "safety_level": "medium",
    },
    {
        "id": "gwangalli",
        "name": "광안리 해수욕장",
        "region": "부산",
        "latitude": 35.1528,
        "longitude": 129.1186,
        "amenities": ["샤워장", "탈의실"],
        "open_season": "06-15~09-01",
        "safety_level": "low",
    },
    {
        "id": "jungmun",
        "name": "중문색달 해변",
        "region": "제주",
        "latitude": 33.2479,
        "longitude": 126.4085,
        "amenities": ["주차장", "포토존"],
        "open_season": "연중무휴",
        "safety_level": "low",
    },
]


def list_beaches() -> list[BeachDetail]:
    return [BeachDetail(**beach) for beach in MOCK_BEACHES]


def get_beach(beach_id: str) -> BeachDetail | None:
    beach = next((item for item in MOCK_BEACHES if item["id"] == beach_id), None)
    return BeachDetail(**beach) if beach else None


def get_observation(beach_id: str):
    return marine_adapter.get_latest_observation(beach_id)


def get_alerts(beach_id: str):
    return safety_adapter.get_alerts(beach_id)


def get_recommendations(user_preferences: dict[str, Any] | None = None) -> RecommendationResponse:
    user_preferences = user_preferences or {}
    items: list[RecommendationItem] = []
    for beach in MOCK_BEACHES:
        observation, obs_meta = marine_adapter.get_latest_observation(beach["id"])
        alerts, alert_meta = safety_adapter.get_alerts(beach["id"])
        safety_score, safety_meta = compute_safety_score(
            SafetyContext(
                wave_height=observation["wave_height"],
                sea_surface_temp=observation["sea_surface_temp"],
                wind_speed=observation["wind_speed"],
                alerts=[alert.severity for alert in alerts],
                user_wave_max=user_preferences.get("wave_max"),
                user_temp_min=user_preferences.get("temp_min"),
            )
        )
        has_events = any(
            event for event in events_adapter.search_events(region=beach["region"])
            if beach["name"].split()[0] in event["title"]
        )
        score = compute_recommendation_score(
            safety_score=safety_score,
            travel_distance_km=user_preferences.get("distance_km"),
            has_events=has_events,
        )
        metadata = Metadata(
            source="composite",
            updatedAt=max(obs_meta.updatedAt, alert_meta.updatedAt, safety_meta.updatedAt),
            reliability=min(obs_meta.reliability, alert_meta.reliability, safety_meta.reliability),
        )
        items.append(
            RecommendationItem(
                beach=BeachDetail(**beach),
                score=score,
                reason=f"안전점수 {safety_score}, 이벤트 {'있음' if has_events else '없음'}",
                meta=metadata,
            )
        )
    return RecommendationResponse(
        data=items,
        meta={"count": len(items), "generatedAt": datetime.now(UTC).isoformat()},
    )


def get_mock_groups() -> list[dict[str, Any]]:
    now = datetime.now(UTC)
    return [
        {
            "id": 1,
            "beach_id": "haeundae",
            "title": "새벽 서핑 버디 모집",
            "scheduled_for": now + timedelta(days=1, hours=6),
            "capacity": 6,
            "requirements": "중급 이상 서퍼",
            "status": "open",
        },
        {
            "id": 2,
            "beach_id": "gwangalli",
            "title": "야간 피크닉 번개",
            "scheduled_for": now + timedelta(days=2, hours=3),
            "capacity": 10,
            "requirements": None,
            "status": "open",
        },
    ]
