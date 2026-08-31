from server.services.user_service import UserService


_user_service = UserService()


def get_user_service() -> UserService:
    """Return the shared in-memory user service."""
    return _user_service
