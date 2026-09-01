from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from server.db.user_db_service import UserDBService
from server.models.user_model import UserModel
from server.schemas.user_schema import User, UserCreate, UserUpdate, UserLoginRequest


class UserService:
    def __init__(self, user_db_service: UserDBService) -> None:
        self.user_db_service = user_db_service
        self.hasher: PasswordHash = PasswordHash((Argon2Hasher(),))

    def create_user(self, user_create: UserCreate) -> User:
        user_hashed_pwd: str = self.hasher.hash(user_create.password)
        user_model = UserModel(
            **user_create.model_dump(exclude={"password"}),
            password_hash=user_hashed_pwd
        )
        try:
            created_user = self.user_db_service.add(user_model)
        except IntegrityError as error:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            ) from error
        return User.model_validate(created_user)

    def update_user(self, user_id: UUID, user_update: UserUpdate) -> User:
        existing_user = self._get_user_model(user_id)
        update_fields: dict[str, object] = user_update.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        for field_name, field_value in update_fields.items():
            setattr(existing_user, field_name, field_value)

        try:
            updated_user = self.user_db_service.add(existing_user)
        except IntegrityError as error:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            ) from error
        return User.model_validate(updated_user)

    def get_user(self, user_id: UUID) -> User:
        return User.model_validate(self._get_user_model(user_id))

    def get_all_users(self) -> list[User]:
        users = self.user_db_service.get_all_users()
        return [User.model_validate(user) for user in users]

    def get_users_by_first_name(self, first_name: str) -> list[User]:
        users = self.user_db_service.get_users_by_first_name(first_name)
        return [User.model_validate(user) for user in users]

    def delete_user(self, user_id: UUID) -> None:
        user = self._get_user_model(user_id)
        self.user_db_service.delete(user)

    def _get_user_model(self, user_id: UUID) -> UserModel:
        user = self.user_db_service.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    def get_users_by_email(self, email: str) -> list[str]:
        users = self.user_db_service.get_users_by_email(email)
        return [user.email for user in users]

    def user_login(self, user_login_request: UserLoginRequest) -> User:
        user = self.user_db_service.get_users_by_email(user_login_request.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        user_model = user[0]
        if not self.hasher.verify(
            user_login_request.password, user_model.password_hash
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        return User.model_validate(user_model)
