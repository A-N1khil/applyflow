from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


CORE_DIRECTORY = Path(__file__).resolve().parent


class Settings(BaseSettings):
    database_url: str
    client_url: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=CORE_DIRECTORY / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
