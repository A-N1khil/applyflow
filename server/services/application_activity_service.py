from uuid import UUID

from fastapi import HTTPException, status

from server.db.application_activity_db_service import (
    ApplicationActivityDBService,
)
from server.models.application_activity_model import ApplicationActivityModel
from server.schemas.application_activity_schema import (
    ApplicationActivity,
    ApplicationActivityCreate,
    ApplicationActivityUpdate,
)


class ApplicationActivityService:
    def __init__(self, activity_db_service: ApplicationActivityDBService) -> None:
        self.activity_db_service = activity_db_service

    def create_activity(
        self,
        activity_create: ApplicationActivityCreate,
    ) -> ApplicationActivity:
        self._verify_application(
            activity_create.user_id,
            activity_create.application_id,
        )
        activity_model = ApplicationActivityModel(
            activity_index=self.activity_db_service.get_next_activity_index(),
            user_id=activity_create.user_id,
            application_id=activity_create.application_id,
            change_type=activity_create.change_type,
            old_value=activity_create.old_value,
            new_value=activity_create.new_value,
        )
        created_activity = self.activity_db_service.create_activity(
            activity_model
        )
        return ApplicationActivity.model_validate(created_activity)

    def update_activity(
        self,
        activity_update: ApplicationActivityUpdate,
    ) -> ApplicationActivity:
        activity = self._get_activity_model(
            activity_update.activity_id,
            activity_update.user_id,
            activity_update.application_id,
        )
        update_fields = activity_update.model_dump(
            exclude_unset=True,
            exclude={"activity_id", "user_id", "application_id"},
        )
        if update_fields.get("change_type") is None:
            update_fields.pop("change_type", None)

        for field_name, field_value in update_fields.items():
            setattr(activity, field_name, field_value)

        updated_activity = self.activity_db_service.update_activity(activity)
        return ApplicationActivity.model_validate(updated_activity)

    def get_activity(
        self,
        activity_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> ApplicationActivity:
        activity = self._get_activity_model(
            activity_id,
            user_id,
            application_id,
        )
        return ApplicationActivity.model_validate(activity)

    def get_all_activities(
        self,
        user_id: UUID,
        application_id: UUID,
    ) -> list[ApplicationActivity]:
        activities = self.activity_db_service.get_all_activities(
            user_id,
            application_id,
        )
        return [
            ApplicationActivity.model_validate(activity)
            for activity in activities
        ]

    def delete_activity(
        self,
        activity_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> None:
        activity = self._get_activity_model(
            activity_id,
            user_id,
            application_id,
        )
        self.activity_db_service.delete_activity(activity)

    def _verify_application(self, user_id: UUID, application_id: UUID) -> None:
        if not self.activity_db_service.application_exists(
            user_id,
            application_id,
        ):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

    def _get_activity_model(
        self,
        activity_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> ApplicationActivityModel:
        activity = self.activity_db_service.get_activity_by_id(
            activity_id,
            user_id,
            application_id,
        )
        if activity is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application activity not found",
            )
        return activity
