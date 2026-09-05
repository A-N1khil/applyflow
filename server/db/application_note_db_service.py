from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.db.base_db_service import BaseDBService
from server.models.application_model import ApplicationModel
from server.models.application_note_model import ApplicationNoteModel


class ApplicationNoteDBService(BaseDBService[ApplicationNoteModel]):
    def __init__(self, database_session: Session) -> None:
        super().__init__(database_session)

    def application_exists(self, user_id: UUID, application_id: UUID) -> bool:
        statement = select(ApplicationModel.application_id).where(
            ApplicationModel.application_id == application_id,
            ApplicationModel.user_id == user_id,
        )
        return self.database_session.scalar(statement) is not None

    def get_next_note_index(
        self,
        user_id: UUID,
        application_id: UUID,
    ) -> int:
        statement = select(
            func.coalesce(func.max(ApplicationNoteModel.note_index), 0) + 1
        ).where(
            ApplicationNoteModel.user_id == user_id,
            ApplicationNoteModel.application_id == application_id,
        )
        return int(self.database_session.scalar(statement))

    def create_note(self, note: ApplicationNoteModel) -> ApplicationNoteModel:
        return self.add(note)

    def update_note(self, note: ApplicationNoteModel) -> ApplicationNoteModel:
        return self.add(note)

    def delete_note(self, note: ApplicationNoteModel) -> None:
        self.delete(note)

    def get_note_by_id(
        self,
        note_id: UUID,
        user_id: UUID,
        application_id: UUID,
    ) -> ApplicationNoteModel | None:
        statement = select(ApplicationNoteModel).where(
            ApplicationNoteModel.note_id == note_id,
            ApplicationNoteModel.user_id == user_id,
            ApplicationNoteModel.application_id == application_id,
        )
        return self.database_session.scalar(statement)

    def get_all_notes(
        self,
        user_id: UUID,
        application_id: UUID,
    ) -> list[ApplicationNoteModel]:
        statement = (
            select(ApplicationNoteModel)
            .where(
                ApplicationNoteModel.user_id == user_id,
                ApplicationNoteModel.application_id == application_id,
            )
            .order_by(ApplicationNoteModel.note_index)
        )
        return list(self.database_session.scalars(statement).all())
