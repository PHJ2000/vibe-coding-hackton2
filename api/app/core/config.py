from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    app_name: str = "BeachHub API"
    environment: Literal["local", "mock", "prod"] = Field(
        default="mock", description="Adapter backend environment switch"
    )
    database_url: str = Field(
        default="postgresql+psycopg://beachhub:beachhub@db:5432/beachhub",
        description="SQLAlchemy connection URL",
    )
    redis_url: str = Field(
        default="redis://redis:6379/0", description="Redis cache URL"
    )
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173"],
        description="Allowed CORS origins",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
