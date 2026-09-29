from uuid import UUID

from fastapi import HTTPException, status

from server.db.application_note_db_service import ApplicationNoteDBService
from server.models.application_note_model import ApplicationNoteModel
from server.schemas.application_note_schema import (
    ApplicationNote,
    ApplicationNoteCreate,
    ApplicationNoteUpdate,
)


class ApplicationNoteService:
    def __init__(self, note_db_service: ApplicationNoteDBService) -> None:
        self.note_db_service = note_db_service

    def create_note(self, note_create: ApplicationNoteCreate) -> ApplicationNote:
        self._verify_application(note_create.user_id, note_create.application_id)
        note_index = self.note_db_service.get_next_note_index(
            note_create.user_id,
            note_create.application_id,
        )
        note_model = ApplicationNoteModel(
            user_id=note_create.user_id,
            application_id=note_create.application_id,
            note_index=note_index,
            note_data=note_create.note_data,
        )
        created_note = self.note_db_service.create_note(note_model)
        return ApplicationNote.model_validate(created_note)

    def update_note(self, note_update: ApplicationNoteUpdate) -> ApplicationNote:
        note = self._get_note_model(
            note_update.note_id,
            note_update.user_id,
            note_update.application_id,
        )
        note.note_data = note_update.note_data
        updated_note = self.note_db_service.update_note(note)
        return ApplicationNote.model_validate(updated_note)

    def get_note(
        self,
        note_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> ApplicationNote:
        note = self._get_note_model(note_id, user_id, application_id)
        return ApplicationNote.model_validate(note)

    def get_all_notes(
        self,
        user_id: UUID,
        application_id: UUID,
    ) -> list[ApplicationNote]:
        notes = self.note_db_service.get_all_notes(user_id, application_id)
        return [ApplicationNote.model_validate(note) for note in notes]

    def delete_note(
        self,
        note_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> None:
        note = self._get_note_model(note_id, user_id, application_id)
        self.note_db_service.delete_note(note)

    def _verify_application(self, user_id: UUID, application_id: UUID) -> None:
        if not self.note_db_service.application_exists(user_id, application_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

    def _get_note_model(
        self,
        note_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> ApplicationNoteModel:
        note = self.note_db_service.get_note_by_id(
            note_id,
            user_id,
            application_id,
        )
        if note is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application note not found",
            )
        return note
