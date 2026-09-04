import type { ApplicationActivity } from "@/models/application-activity"
import { httpService } from "@/services/http-service"

export class ApplicationActivityService {
  async getAllActivities(
    userId: string,
    applicationId: string
  ): Promise<ApplicationActivity[]> {
    const query = new URLSearchParams({
      user_id: userId,
      application_id: applicationId,
    })
    const response = await httpService.get<ApplicationActivity[]>(
      `/application-activities/all?${query.toString()}`
    )

    if (response.status_code < 200 || response.status_code >= 300) {
      throw new Error(
        response.message ?? "Unable to fetch application activities"
      )
    }

    if (response.data === null) {
      throw new Error("The server did not return application activities")
    }

    return response.data
  }
}

export const applicationActivityService = new ApplicationActivityService()
