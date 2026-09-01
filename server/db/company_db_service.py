from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from server.db.base_db_service import BaseDBService
from server.models.company_model import CompanyModel


class CompanyDBService(BaseDBService[CompanyModel]):
    def __init__(self, database_session: Session) -> None:
        super().__init__(database_session)

    def get_all_companies(self) -> list[CompanyModel]:
        return list(self.database_session.scalars(select(CompanyModel)).all())

    def get_company_by_id(self, company_id: UUID) -> CompanyModel | None:
        return self.database_session.get(CompanyModel, company_id)

    def get_companies_by_name(self, name: str) -> list[CompanyModel]:
        statement = select(CompanyModel).where(CompanyModel.name == name)
        return list(self.database_session.scalars(statement).all())
