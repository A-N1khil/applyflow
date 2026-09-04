from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column

from server.core.database import Base
from server.schemas.application_activity_schema import ApplicationChangeType


class ApplicationActivityModel(Base):
    __tablename__ = "applications_activity"

    activity_id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    activity_index: Mapped[int] = mapped_column(Integer, unique=True)
    activity_time: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    user_id: Mapped[UUID] = mapped_column(
        "done_by",
        Uuid,
        ForeignKey("users.id"),
    )
    application_id: Mapped[UUID] = mapped_column(
        "done_on",
        Uuid,
        ForeignKey("applications.application_id"),
    )
    change_type: Mapped[ApplicationChangeType] = mapped_column(
        Enum(
            ApplicationChangeType,
            name="application_change_type",
            values_callable=lambda change_types: [
                change_type.value for change_type in change_types
            ],
        ),
        server_default=text("'update'::application_change_type"),
    )
    old_value: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    new_value: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
