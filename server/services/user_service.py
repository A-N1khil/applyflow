from uuid import UUID, uuid4

from fastapi import HTTPException, status

from server.schemas.user_schema import User, UserCreate, UserUpdate


class UserService:
    def __init__(self) -> None:
        self._users: dict[UUID, User] = {}

    def create_user(self, user_create: UserCreate) -> User:
        user_id: UUID = uuid4()
        user: User = User(id=user_id, **user_create.model_dump())
        self._users[user_id] = user
        return user

    def update_user(self, user_update: UserUpdate) -> User:
        existing_user: User = self.get_user(user_update.id)
        update_fields: dict[str, object] = user_update.model_dump(
            exclude={"id"},
            exclude_unset=True,
        )
        updated_user: User = existing_user.model_copy(update=update_fields)
        self._users[user_update.id] = updated_user
        return updated_user

    def get_user(self, user_id: UUID) -> User:
        user: User | None = self._users.get(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user
