from uuid import UUID

from fastapi import HTTPException, status

from server.db.company_db_service import CompanyDBService
from server.models.company_model import CompanyModel
from server.schemas.company_schema import Company, CompanyCreate, CompanyUpdate


class CompanyService:
    def __init__(self, company_db_service: CompanyDBService) -> None:
        self.company_db_service = company_db_service

    def create_company(self, company_create: CompanyCreate) -> Company:
        company_model = CompanyModel(**company_create.model_dump())
        created_company = self.company_db_service.add(company_model)
        return Company.model_validate(created_company)

    def update_company(
        self,
        company_id: UUID,
        company_update: CompanyUpdate,
    ) -> Company:
        existing_company = self._get_company_model(company_id)
        update_fields: dict[str, object] = company_update.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        for field_name, field_value in update_fields.items():
            setattr(existing_company, field_name, field_value)

        updated_company = self.company_db_service.add(existing_company)
        return Company.model_validate(updated_company)

    def get_company(self, company_id: UUID) -> Company:
        return Company.model_validate(self._get_company_model(company_id))

    def get_all_companies(self) -> list[Company]:
        companies = self.company_db_service.get_all_companies()
        return [Company.model_validate(company) for company in companies]

    def get_companies_by_name(self, name: str) -> list[Company]:
        companies = self.company_db_service.get_companies_by_name(name)
        return [Company.model_validate(company) for company in companies]

    def delete_company(self, company_id: UUID) -> None:
        company = self._get_company_model(company_id)
        self.company_db_service.delete(company)

    def _get_company_model(self, company_id: UUID) -> CompanyModel:
        company = self.company_db_service.get_company_by_id(company_id)
        if company is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
            )
        return company
