from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from server.dependencies.user_dependency import get_user_service
from server.routers.base_router import DataHolder, success_response
from server.schemas.user_schema import UserCreate, UserUpdate
from server.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

UserServiceDependency = Annotated[UserService, Depends(get_user_service)]


@router.post(
    "/add",
    response_model=None,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_create: UserCreate,
    user_service: UserServiceDependency,
) -> DataHolder:
    user = user_service.create_user(user_create)
    return success_response(user, status_code=status.HTTP_201_CREATED)


@router.patch(
    "/update/{user_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def update_user(
    user_id: UUID,
    user_update: UserUpdate,
    user_service: UserServiceDependency,
) -> DataHolder:
    user = user_service.update_user(user_id, user_update)
    return success_response(user)


@router.get(
    "/all",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def get_all_users(
    user_service: UserServiceDependency,
) -> DataHolder:
    users = user_service.get_all_users()
    return success_response(users)


@router.get(
    "/by-first-name/{first_name}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def get_users_by_first_name(
    first_name: str,
    user_service: UserServiceDependency,
) -> DataHolder:
    users = user_service.get_users_by_first_name(first_name)
    return success_response(users)


@router.get(
    "/email-exists",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def check_if_email_exists(
    email: str,
    user_service: UserServiceDependency,
) -> DataHolder:
    users = user_service.get_users_by_email(email)
    return success_response(len(users) > 0)


@router.get(
    "/user/{user_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def get_user(
    user_id: UUID,
    user_service: UserServiceDependency,
) -> DataHolder:
    user = user_service.get_user(user_id)
    return success_response(user)


@router.delete(
    "/delete/{user_id}",
    response_model=None,
    status_code=status.HTTP_200_OK,
)
def delete_user(
    user_id: UUID,
    user_service: UserServiceDependency,
) -> DataHolder:
    user_service.delete_user(user_id)
    return success_response(None, message="User deleted successfully")
