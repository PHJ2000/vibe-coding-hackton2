from datetime import UTC, datetime, timedelta
from typing import Any

from app.schemas.base import Metadata


def _default_observation() -> dict[str, Any]:
    now = datetime.now(UTC)
    return {
        "observed_at": now - timedelta(hours=1),
        "sea_surface_temp": 22.0,
        "wave_height": 0.8,
        "wind_speed": 4.2,
        "tide_level": 0.0,
        "reliability": 1,
        "source": "mock-marine",
    }


MOCK_OBSERVATIONS: dict[str, dict[str, Any]] = {
    "haeundae": {
        **_default_observation(),
        "observed_at": datetime.now(UTC) - timedelta(minutes=10),
        "sea_surface_temp": 23.8,
        "wave_height": 0.6,
        "wind_speed": 3.2,
        "reliability": 2,
    },
    "gwangalli": {
        **_default_observation(),
        "observed_at": datetime.now(UTC) - timedelta(minutes=7),
        "sea_surface_temp": 24.1,
        "wave_height": 0.4,
        "wind_speed": 2.5,
        "reliability": 2,
    },
}


def get_latest_observation(beach_id: str) -> tuple[dict[str, Any], Metadata]:
    record = MOCK_OBSERVATIONS.get(beach_id, _default_observation())
    metadata = Metadata(
        source=record["source"],
        updatedAt=datetime.now(UTC),
        reliability=record["reliability"],
    )
    return record, metadata
