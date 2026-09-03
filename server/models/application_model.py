from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column

from server.core.database import Base
from server.schemas.application_schema import ApplicationStatus


class ApplicationModel(Base):
    __tablename__ = "applications"

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey("users.id"))
    company_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("companies.company_id"),
    )
    role: Mapped[str] = mapped_column(String(255))
    location: Mapped[str | None] = mapped_column(
        String(255), nullable=True, server_default=text("'Remote'")
    )
    url: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=text("CURRENT_TIMESTAMP")
    )
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"),
        server_default=text("'APPLIED'::application_status"),
    )
    applied_on: Mapped[datetime] = mapped_column(
        DateTime, server_default=text("CURRENT_TIMESTAMP")
    )
