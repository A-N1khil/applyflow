import type { ApplicationNote } from "@/models/application-note"
import { httpService } from "@/services/http-service"

export class ApplicationNoteService {
  async getAllNotes(
    userId: string,
    applicationId: string
  ): Promise<ApplicationNote[]> {
    const query = new URLSearchParams({
      user_id: userId,
      application_id: applicationId,
    })
    const response = await httpService.get<ApplicationNote[]>(
      `/application-notes/all?${query.toString()}`
    )

    if (response.status_code < 200 || response.status_code >= 300) {
      throw new Error(response.message ?? "Unable to fetch application notes")
    }

    if (response.data === null) {
      throw new Error("The server did not return application notes")
    }

    return response.data
  }
}

export const applicationNoteService = new ApplicationNoteService()
