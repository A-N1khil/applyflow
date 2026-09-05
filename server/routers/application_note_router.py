from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status

from server.dependencies.application_note_dependency import (
    get_application_note_service,
)
from server.routers.base_router import DataHolder, success_response
from server.schemas.application_note_schema import (
    ApplicationNoteCreate,
    ApplicationNoteUpdate,
)
from server.services.application_note_service import ApplicationNoteService

router = APIRouter(prefix="/application-notes", tags=["application notes"])

ApplicationNoteServiceDependency = Annotated[
    ApplicationNoteService,
    Depends(get_application_note_service),
]


@router.post("/add", response_model=None, status_code=status.HTTP_201_CREATED)
def create_note(
    note_create: ApplicationNoteCreate,
    note_service: ApplicationNoteServiceDependency,
) -> DataHolder:
    note = note_service.create_note(note_create)
    return success_response(note, status_code=status.HTTP_201_CREATED)


@router.patch("/update", response_model=None, status_code=status.HTTP_200_OK)
def update_note(
    note_update: ApplicationNoteUpdate,
    note_service: ApplicationNoteServiceDependency,
) -> DataHolder:
    note = note_service.update_note(note_update)
    return success_response(note)


@router.get("/all", response_model=None, status_code=status.HTTP_200_OK)
def get_all_notes(
    user_id: Annotated[UUID, Query()],
    application_id: Annotated[UUID, Query()],
    note_service: ApplicationNoteServiceDependency,
) -> DataHolder:
    notes = note_service.get_all_notes(user_id, application_id)
    return success_response(notes)


@router.get("/byId", response_model=None, status_code=status.HTTP_200_OK)
def get_note(
    note_id: Annotated[UUID, Query()],
    user_id: Annotated[UUID, Query()],
    application_id: Annotated[UUID, Query()],
    note_service: ApplicationNoteServiceDependency,
) -> DataHolder:
    note = note_service.get_note(note_id, user_id, application_id)
    return success_response(note)


@router.delete("/delete", response_model=None, status_code=status.HTTP_200_OK)
def delete_note(
    note_id: Annotated[UUID, Query()],
    user_id: Annotated[UUID, Query()],
    application_id: Annotated[UUID, Query()],
    note_service: ApplicationNoteServiceDependency,
) -> DataHolder:
    note_service.delete_note(note_id, user_id, application_id)
    return success_response(None, message="Application note deleted successfully")
