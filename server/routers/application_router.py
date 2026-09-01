from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from server.dependencies.application_dependency import get_application_service
from server.routers.base_router import DataHolder, success_response
from server.schemas.application_schema import ApplicationCreate, ApplicationUpdate
from server.services.application_service import ApplicationService

router = APIRouter(prefix="/applications", tags=["applications"])

ApplicationServiceDependency = Annotated[
    ApplicationService,
    Depends(get_application_service),
]


@router.post("/add", response_model=None, status_code=status.HTTP_201_CREATED)
def create_application(
    application_create: ApplicationCreate,
    application_service: ApplicationServiceDependency,
) -> DataHolder:
    application = application_service.create_application(
        application_create.user_id,
        application_create,
    )
    return success_response(application, status_code=status.HTTP_201_CREATED)


@router.patch(
    "/update/{application_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def update_application(
    application_id: UUID,
    application_update: ApplicationUpdate,
    application_service: ApplicationServiceDependency,
) -> DataHolder:
    application = application_service.update_application(
        application_update.user_id,
        application_id,
        application_update,
    )
    return success_response(application)


@router.get("/all", response_model=None, status_code=status.HTTP_200_OK)
def get_all_applications(
    user_id: UUID,
    application_service: ApplicationServiceDependency,
) -> DataHolder:
    applications = application_service.get_all_applications(user_id)
    return success_response(applications)


@router.get(
    "/{application_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def get_application(
    user_id: UUID,
    application_id: UUID,
    application_service: ApplicationServiceDependency,
) -> DataHolder:
    application = application_service.get_application(user_id, application_id)
    return success_response(application)


@router.delete(
    "/{application_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def delete_application(
    user_id: UUID,
    application_id: UUID,
    application_service: ApplicationServiceDependency,
) -> DataHolder:
    application_service.delete_application(user_id, application_id)
    return success_response(None, message="Application deleted successfully")
