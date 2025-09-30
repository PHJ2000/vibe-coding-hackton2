from datetime import datetime
from typing import Literal, Sequence

from pydantic import BaseModel, ConfigDict, Field


class CamelModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class Metadata(CamelModel):
    source: str
    updatedAt: datetime
    reliability: Literal[0, 1, 2]


class BeachSummary(CamelModel):
    id: str
    name: str
    region: str
    latitude: float
    longitude: float
    amenities: list[str]
    safetyLevel: str | None = Field(default=None, alias="safety_level")


class ObservationPayload(CamelModel):
    observedAt: datetime = Field(alias="observed_at")
    seaSurfaceTemp: float = Field(alias="sea_surface_temp")
    waveHeight: float = Field(alias="wave_height")
    windSpeed: float = Field(alias="wind_speed")
    tideLevel: float = Field(alias="tide_level")


class ObservationResponse(CamelModel):
    data: ObservationPayload
    meta: Metadata


class BeachDetail(BeachSummary):
    openSeason: str | None = Field(default=None, alias="open_season")


class PaginatedResponse(CamelModel):
    data: Sequence
    meta: dict[str, int | str | None]


class SafetyAlertPayload(CamelModel):
    alertType: str = Field(alias="alert_type")
    severity: str
    message: str
    startsAt: datetime = Field(alias="starts_at")
    endsAt: datetime | None = Field(alias="ends_at")


class SafetyAlertResponse(CamelModel):
    data: list[SafetyAlertPayload]
    meta: Metadata


class EventPayload(CamelModel):
    id: int
    title: str
    description: str
    startsAt: datetime = Field(alias="starts_at")
    endsAt: datetime | None = Field(alias="ends_at")
    latitude: float
    longitude: float
    tags: list[str]
    price: str | None


class RecommendationItem(CamelModel):
    beach: BeachSummary
    score: float
    reason: str
    meta: Metadata


class RecommendationResponse(CamelModel):
    data: list[RecommendationItem]
    meta: dict[str, int | str | None]


class GroupPayload(CamelModel):
    id: int | None = None
    beachId: str | None = Field(default=None, alias="beach_id")
    title: str
    scheduledFor: datetime = Field(alias="scheduled_for")
    capacity: int
    requirements: str | None
    status: str


class GroupResponse(CamelModel):
    data: list[GroupPayload]
    meta: dict[str, int | str | None]
