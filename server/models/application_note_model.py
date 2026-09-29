from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, Integer, Text, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column

from server.core.database import Base


class ApplicationNoteModel(Base):
    __tablename__ = "application_notes"

    note_id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[UUID | None] = mapped_column(
        "note_by",
        Uuid,
        ForeignKey("users.id"),
        nullable=True,
    )
    application_id: Mapped[UUID | None] = mapped_column(
        "note_on",
        Uuid,
        ForeignKey("applications.application_id"),
        nullable=True,
    )
    note_index: Mapped[int] = mapped_column(Integer)
    note_data: Mapped[str] = mapped_column(Text)
    note_date: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=text("CURRENT_TIMESTAMP"),
    )
