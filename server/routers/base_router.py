from fastapi import status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


class DataHolder:
    def __init__(self, data, status_code, message):
        self.data = data
        self.status_code = status_code
        self.message = message


def success_response(data, status_code=status.HTTP_200_OK, message="Success"):
    return DataHolder(data=data, status_code=status_code, message=message)


def error_response(
    message,
    status_code=status.HTTP_400_BAD_REQUEST,
) -> JSONResponse:
    response_body = DataHolder(
        data=None,
        status_code=status_code,
        message=message,
    )
    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder(response_body),
    )
