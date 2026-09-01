from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from server.dependencies.company_dependency import get_company_service
from server.routers.base_router import DataHolder, success_response
from server.schemas.company_schema import CompanyCreate, CompanyUpdate
from server.services.company_service import CompanyService

router = APIRouter(prefix="/companies", tags=["companies"])

CompanyServiceDependency = Annotated[CompanyService, Depends(get_company_service)]


@router.post(
    "/add",
    response_model=None,
    status_code=status.HTTP_201_CREATED,
)
def create_company(
    company_create: CompanyCreate,
    company_service: CompanyServiceDependency,
) -> DataHolder:
    company = company_service.create_company(company_create)
    return success_response(company, status_code=status.HTTP_201_CREATED)


@router.patch(
    "/update/{company_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def update_company(
    company_id: UUID,
    company_update: CompanyUpdate,
    company_service: CompanyServiceDependency,
) -> DataHolder:
    company = company_service.update_company(company_id, company_update)
    return success_response(company)


@router.get(
    "/all",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def get_all_companies(
    company_service: CompanyServiceDependency,
) -> DataHolder:
    companies = company_service.get_all_companies()
    return success_response(companies)


@router.get(
    "/by-name/{name}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def get_companies_by_name(
    name: str,
    company_service: CompanyServiceDependency,
) -> DataHolder:
    companies = company_service.get_companies_by_name(name)
    return success_response(companies)


@router.get(
    "/{company_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def get_company(
    company_id: UUID,
    company_service: CompanyServiceDependency,
) -> DataHolder:
    company = company_service.get_company(company_id)
    return success_response(company)


@router.delete(
    "/{company_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def delete_company(
    company_id: UUID,
    company_service: CompanyServiceDependency,
) -> DataHolder:
    company_service.delete_company(company_id)
    return success_response(None, message="Company deleted successfully")
