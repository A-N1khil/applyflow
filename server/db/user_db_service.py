from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from server.db.base_db_service import BaseDBService
from server.models.user import UserModel


class UserDBService(BaseDBService[UserModel]):
    def __init__(self, database_session: Session) -> None:
        super().__init__(database_session)

    def get_users_by_first_name(self, first_name: str) -> list[UserModel]:
        statement = select(UserModel).where(UserModel.first_name == first_name)
        return list(self.database_session.scalars(statement).all())

    def get_all_users(self) -> list[UserModel]:
        return list(self.database_session.scalars(select(UserModel)).all())

    def get_user_by_id(self, user_id: UUID) -> UserModel | None:
        return self.database_session.get(UserModel, user_id)

    def get_users_by_email(self, email: str) -> list[UserModel]:
        statement = select(UserModel).where(UserModel.email == email)
        return list(self.database_session.scalars(statement).all())
