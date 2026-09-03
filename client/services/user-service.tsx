import type { User, UserCreate, UserLoginRequest } from "@/models/user"
import { httpService } from "@/services/http-service"

export class UserService {
  async login(userLogin: UserLoginRequest): Promise<User> {
    const response = await httpService.post<User, UserLoginRequest>(
      "/users/login",
      userLogin
    )

    if (response.status_code < 200 || response.status_code >= 300) {
      throw new Error(response.message ?? "Unable to log in")
    }

    if (response.data === null) {
      throw new Error("The server did not return the logged-in user")
    }

    return response.data
  }

  async createUser(userCreate: UserCreate): Promise<User> {
    const response = await httpService.post<User, UserCreate>(
      "/users/add",
      userCreate
    )

    if (response.status_code < 200 || response.status_code >= 300) {
      throw new Error(response.message ?? "Unable to create account")
    }

    if (response.data === null) {
      throw new Error("The server did not return the created user")
    }

    return response.data
  }

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
