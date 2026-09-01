import { httpService } from "@/services/http-service"

export class UserService {
  async emailExists(email: string): Promise<boolean> {
    const response = await httpService.get<boolean>(
      `/users/email-exists?email=${encodeURIComponent(email)}`
    )

    if (response.status_code < 200 || response.status_code >= 300) {
      throw new Error(response.message ?? "Unable to verify email")
    }

    if (response.data === null) {
      throw new Error("The server did not return an email validation result")
    }

    return response.data
  }
}

export const userService = new UserService()
