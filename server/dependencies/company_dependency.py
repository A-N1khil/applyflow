from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from server.core.database import get_db
from server.db.company_db_service import CompanyDBService
from server.services.company_service import CompanyService


DatabaseSessionDependency = Annotated[Session, Depends(get_db)]


def get_company_db_service(
    database_session: DatabaseSessionDependency,
) -> CompanyDBService:
    return CompanyDBService(database_session)


CompanyDBServiceDependency = Annotated[
    CompanyDBService,
    Depends(get_company_db_service),
]


def get_company_service(
    company_db_service: CompanyDBServiceDependency,
) -> CompanyService:
    return CompanyService(company_db_service)
