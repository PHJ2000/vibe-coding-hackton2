from dataclasses import dataclass
from datetime import UTC, datetime
from math import exp
from typing import Iterable

from app.schemas.base import Metadata


@dataclass
class SafetyContext:
    wave_height: float
    sea_surface_temp: float
    wind_speed: float
    alerts: Iterable[str]
    user_wave_max: float | None = None
    user_temp_min: float | None = None


def compute_safety_score(context: SafetyContext) -> tuple[int, Metadata]:
    base = 100
    penalties = 0

    if context.user_wave_max is not None:
        penalties += max((context.wave_height - context.user_wave_max) * 20, 0)
    else:
        penalties += max((context.wave_height - 1.2) * 20, 0)

    if context.user_temp_min is not None and context.sea_surface_temp < context.user_temp_min:
        penalties += 20
    elif context.sea_surface_temp < 20:
        penalties += 15

    high_alert = any(level == "high" for level in context.alerts)
    if high_alert:
        penalties += 40
    elif any(context.alerts):
        penalties += 15

    if context.wind_speed > 6:
        penalties += min((context.wind_speed - 6) * 5, 25)

    score = max(int(base - penalties), 0)
    metadata = Metadata(source="mock", updatedAt=datetime.now(UTC), reliability=1)
    return score, metadata


def compute_recommendation_score(
    safety_score: int,
    travel_distance_km: float | None,
    has_events: bool,
    popularity: float = 0.5,
) -> float:
    safety_component = safety_score / 100
    distance_component = exp(-(travel_distance_km or 20) / 80)
    event_boost = 0.1 if has_events else 0
    score = min(1.0, 0.5 * safety_component + 0.2 * distance_component + event_boost + 0.3 * popularity)
    return round(score, 3)
