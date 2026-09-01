from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from server.dependencies.user_dependency import get_user_service
from server.schemas.user_schema import User, UserCreate, UserUpdate
from server.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

UserServiceDependency = Annotated[UserService, Depends(get_user_service)]


@router.post(
    "",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_create: UserCreate,
    user_service: UserServiceDependency,
) -> User:
    return user_service.create_user(user_create)


@router.patch(
    "/{user_id}",
    response_model=User,
    status_code=status.HTTP_200_OK,
)
def update_user(
    user_id: UUID,
    user_update: UserUpdate,
    user_service: UserServiceDependency,
) -> User:
    return user_service.update_user(user_id, user_update)


@router.get(
    "",
    response_model=list[User],
    status_code=status.HTTP_200_OK,
)
def get_all_users(
    user_service: UserServiceDependency,
) -> list[User]:
    return user_service.get_all_users()


@router.get(
    "/by-first-name/{first_name}",
    response_model=list[User],
    status_code=status.HTTP_200_OK,
)
def get_users_by_first_name(
    first_name: str,
    user_service: UserServiceDependency,
) -> list[User]:
    return user_service.get_users_by_first_name(first_name)


@router.get(
    "/{user_id}",
    response_model=User,
    status_code=status.HTTP_200_OK,
)
def get_user(
    user_id: UUID,
    user_service: UserServiceDependency,
) -> User:
    return user_service.get_user(user_id)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(
    user_id: UUID,
    user_service: UserServiceDependency,
) -> None:
    user_service.delete_user(user_id)


@router.get(
    "/email-exists",
    response_model=bool,
    status_code=status.HTTP_200_OK,
)
def check_if_email_exists(
    email: str,
    user_service: UserServiceDependency,
) -> bool:
    users = user_service.get_users_by_email(email)
    return len(users) > 0
