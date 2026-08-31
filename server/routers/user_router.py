from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from server.dependencies.user_dependency import get_user_service
from server.schemas.user_schema import User, UserCreate, UserUpdate
from server.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

UserServiceDependency = Annotated[UserService, Depends(get_user_service)]


@router.post(
    "/post",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_create: UserCreate,
    user_service: UserServiceDependency,
) -> User:
    return user_service.create_user(user_create)


@router.patch(
    "/update",
    response_model=User,
    status_code=status.HTTP_200_OK,
)
def update_user(
    user_update: UserUpdate,
    user_service: UserServiceDependency,
) -> User:
    return user_service.update_user(user_update)


@router.get(
    "/get/{user_id}",
    response_model=User,
    status_code=status.HTTP_200_OK,
)
def get_user(
    user_id: UUID,
    user_service: UserServiceDependency,
) -> User:
    return user_service.get_user(user_id)


@router.get(
    "/all",
    response_model=list[User],
    status_code=status.HTTP_200_OK,
)
def get_all_users(
    user_service: UserServiceDependency,
) -> list[User]:
    return list(user_service._users.values())
