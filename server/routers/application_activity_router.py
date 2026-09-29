from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from server.dependencies.application_activity_dependency import (
    get_application_activity_service,
)
from server.routers.base_router import DataHolder, success_response
from server.schemas.application_activity_schema import (
    ApplicationActivityCreate,
    ApplicationActivityUpdate,
)
from server.services.application_activity_service import (
    ApplicationActivityService,
)

router = APIRouter(
    prefix="/application-activities",
    tags=["application activities"],
)

ApplicationActivityServiceDependency = Annotated[
    ApplicationActivityService,
    Depends(get_application_activity_service),
]


@router.post("/add", response_model=None, status_code=status.HTTP_201_CREATED)
def create_activity(
    activity_create: ApplicationActivityCreate,
    activity_service: ApplicationActivityServiceDependency,
) -> DataHolder:
    activity = activity_service.create_activity(activity_create)
    return success_response(activity, status_code=status.HTTP_201_CREATED)


@router.patch("/update", response_model=None, status_code=status.HTTP_200_OK)
def update_activity(
    activity_update: ApplicationActivityUpdate,
    activity_service: ApplicationActivityServiceDependency,
) -> DataHolder:
    activity = activity_service.update_activity(activity_update)
    return success_response(activity)


@router.get("/all", response_model=None, status_code=status.HTTP_200_OK)
def get_all_activities(
    user_id: Annotated[UUID, Query()],
    application_id: Annotated[UUID, Query()],
    activity_service: ApplicationActivityServiceDependency,
) -> DataHolder:
    activities = activity_service.get_all_activities(user_id, application_id)
    return success_response(activities)


@router.get("/byId", response_model=None, status_code=status.HTTP_200_OK)
def get_activity(
    activity_id: Annotated[UUID, Query()],
    user_id: Annotated[UUID, Query()],
    application_id: Annotated[UUID, Query()],
    activity_service: ApplicationActivityServiceDependency,
) -> DataHolder:
    activity = activity_service.get_activity(
        activity_id,
        user_id,
        application_id,
    )
    return success_response(activity)


@router.delete("/delete", response_model=None, status_code=status.HTTP_200_OK)
def delete_activity(
    activity_id: Annotated[UUID, Query()],
    user_id: Annotated[UUID, Query()],
    application_id: Annotated[UUID, Query()],
    activity_service: ApplicationActivityServiceDependency,
) -> DataHolder:
    activity_service.delete_activity(activity_id, user_id, application_id)
    return success_response(
        None,
        message="Application activity deleted successfully",
    )
