from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Beach(SQLModel, table=True):
    id: str = Field(primary_key=True, index=True)
    name: str
    region: str
    latitude: float
    longitude: float
    amenities: list[str] = Field(default_factory=list, sa_column_kwargs={"nullable": False})
    open_season: Optional[str] = None
    safety_level: Optional[str] = None


class Observation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    beach_id: str = Field(index=True, foreign_key="beach.id")
    observed_at: datetime = Field(index=True)
    sea_surface_temp: float
    wave_height: float
    wind_speed: float
    tide_level: float
    reliability: int
    source: str
    updated_at: datetime


class SafetyAlert(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    beach_id: str = Field(index=True, foreign_key="beach.id")
    alert_type: str
    severity: str
    message: str
    starts_at: datetime
    ends_at: datetime | None = None
    source: str
    reliability: int = Field(default=1)


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    beach_id: str | None = Field(default=None, foreign_key="beach.id")
    title: str
    description: str
    starts_at: datetime
    ends_at: datetime | None = None
    latitude: float
    longitude: float
    tags: list[str] = Field(default_factory=list, sa_column_kwargs={"nullable": False})
    price: str | None = None
    source: str
    reliability: int = Field(default=2)


class Group(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    beach_id: str | None = Field(default=None, foreign_key="beach.id")
    title: str
    scheduled_for: datetime
    capacity: int
    requirements: str | None = None
    status: str = Field(default="open")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nickname: str
    temp_min: float | None = None
    temp_max: float | None = None
    wave_max: float | None = None
    distance_km: float | None = None
    party_types: list[str] = Field(default_factory=list, sa_column_kwargs={"nullable": False})
