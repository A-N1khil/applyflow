from uuid import UUID, uuid4

from sqlalchemy import String, Uuid, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from server.core.database import Base
class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    firstname: Mapped[str] = mapped_column(String(100))
    lastname: Mapped[str] = mapped_column(String(100))
    location: Mapped[str] = mapped_column(String(255))