from uuid import UUID

from sqlalchemy import String, Text, Uuid, text
from sqlalchemy.orm import Mapped, mapped_column

from server.core.database import Base


class CompanyModel(Base):
    __tablename__ = "companies"

    company_id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    name: Mapped[str] = mapped_column(String(255))
    website: Mapped[str | None] = mapped_column(Text, nullable=True)
