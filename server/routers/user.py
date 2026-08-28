from uuid import UUID

from fastapi import APIRouter, status

from server.models.user import User, UserCreate, UserUpdate
from server.services.user import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.post(
    "/post",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
)
def create_user(user_create: UserCreate) -> User:
    return user_service.create_user(user_create)


@router.patch(
    "/update",
    response_model=User,
    status_code=status.HTTP_200_OK,
)
def update_user(user_update: UserUpdate) -> User:
    return user_service.update_user(user_update)


@router.get(
    "/get/{user_id}",
    response_model=User,
    status_code=status.HTTP_200_OK,
)
def get_user(user_id: UUID) -> User:
    return user_service.get_user(user_id)
