from uuid import UUID

from pydantic import BaseModel


class User(BaseModel):
    id: UUID
    firstname: str
    lastname: str
    location: str


class UserCreate(BaseModel):
    firstname: str
    lastname: str
    location: str


class UserUpdate(BaseModel):
    id: UUID
    firstname: str | None = None
    lastname: str | None = None
    location: str | None = None
