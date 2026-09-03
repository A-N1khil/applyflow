from uuid import UUID

from fastapi import HTTPException, status

from server.db.application_db_service import ApplicationDBService
from server.models.application_model import ApplicationModel
from server.schemas.application_schema import (
    Application,
    ApplicationCreate,
    ApplicationUpdate,
)


class ApplicationService:
    def __init__(self, application_db_service: ApplicationDBService) -> None:
        self.application_db_service = application_db_service

    def create_application(
        self, user_id: UUID, application_create: ApplicationCreate
    ) -> Application:
        application_index = (
            self.application_db_service.get_next_application_index(user_id)
        )
        application_model = ApplicationModel(
            user_id=user_id,
            application_index=application_index,
            **application_create.model_dump(exclude={"user_id"}),
        )
        created_application = self.application_db_service.create_application(
            user_id,
            application_model,
        )
        return Application.model_validate(created_application)

    def update_application(
        self,
        user_id: UUID,
        application_id: UUID,
        application_update: ApplicationUpdate,
    ) -> Application:
        existing_application = self._get_application_model(
            user_id, application_id
        )
        update_fields: dict[str, object] = application_update.model_dump(
            exclude_unset=True,
            exclude_none=True,
            exclude={"application_id", "user_id"},
        )

        for field_name, field_value in update_fields.items():
            setattr(existing_application, field_name, field_value)

        updated_application = self.application_db_service.update_application(
            user_id,
            existing_application,
        )
        return Application.model_validate(updated_application)

    def get_application(
        self, user_id: UUID, application_id: UUID
    ) -> Application:
        application = self._get_application_model(user_id, application_id)
        return Application.model_validate(application)

    def get_all_applications(self, user_id: UUID) -> list[Application]:
        applications = self.application_db_service.get_all_applications(user_id)
        return [
            Application.model_validate(application)
            for application in applications
        ]

    def delete_application(self, user_id: UUID, application_id: UUID) -> None:
        application = self._get_application_model(user_id, application_id)
        self.application_db_service.delete_application(user_id, application)

    def _get_application_model(
        self, user_id: UUID, application_id: UUID
    ) -> ApplicationModel:
        application = self.application_db_service.get_application_by_id(
            user_id, application_id
        )
        if application is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )
        return application
