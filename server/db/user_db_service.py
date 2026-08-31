from sqlalchemy import select
from sqlalchemy.orm import Session

from server.models.user import UserModel
from server.db.base_db_service import BaseDBService


class UserDBService(BaseDBService[UserModel]):
    def __init__(self, database_session: Session) -> None:
        super().__init__(database_session)

    def get_users_by_first_name(self, first_name: str) -> list[UserModel]:
        statement = select(UserModel).where(UserModel.firstname == first_name)
        return list(self.database_session.scalars(statement).all())

    def get_all_users(self) -> list[UserModel]:
        return list(self.database_session.scalars(select(UserModel)).all())
