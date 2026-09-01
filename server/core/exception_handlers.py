import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

from server.routers.base_router import error_response


logger = logging.getLogger(__name__)


def _format_validation_errors(exception: RequestValidationError) -> str:
    messages: list[str] = []

    for error in exception.errors():
        location = ".".join(str(part) for part in error["loc"])
        messages.append(f"{location}: {error['msg']}")

    return ", ".join(messages)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request,
        exception: StarletteHTTPException,
    ) -> JSONResponse:
        return error_response(
            message=str(exception.detail),
            status_code=exception.status_code,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exception: RequestValidationError,
    ) -> JSONResponse:
        return error_response(
            message=_format_validation_errors(exception),
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    @app.exception_handler(SQLAlchemyError)
    async def database_exception_handler(
        request: Request,
        exception: SQLAlchemyError,
    ) -> JSONResponse:
        logger.exception(
            "Database error while handling %s %s",
            request.method,
            request.url.path,
        )
        return error_response(
            message="A database error occurred",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        exception: Exception,
    ) -> JSONResponse:
        logger.exception(
            "Unexpected error while handling %s %s",
            request.method,
            request.url.path,
        )
        return error_response(
            message="An unexpected error occurred",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
