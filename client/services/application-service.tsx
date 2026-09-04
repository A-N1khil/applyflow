import type {
  Application,
  ApplicationDetails,
  ApplicationTableRow,
} from "@/models/application"
import { httpService } from "@/services/http-service"

interface Company {
  company_id: string
  name: string
  website: string | null
}

export class ApplicationService {
  async getApplicationByIndex(
    userId: string,
    applicationIndex: number
  ): Promise<ApplicationDetails> {
    const query = new URLSearchParams({
      user_id: userId,
      application_index: String(applicationIndex),
    })
    const applicationResponse = await httpService.get<Application>(
      `/applications/byIndex?${query.toString()}`
    )

    if (
      applicationResponse.status_code < 200 ||
      applicationResponse.status_code >= 300
    ) {
      throw new Error(
        applicationResponse.message ?? "Unable to fetch application"
      )
    }

    if (applicationResponse.data === null) {
      throw new Error("The server did not return the application")
    }

    const application = applicationResponse.data
    const companyResponse = await httpService.get<Company>(
      `/companies/${encodeURIComponent(application.company_id)}`
    )

    if (
      companyResponse.status_code < 200 ||
      companyResponse.status_code >= 300
    ) {
      throw new Error(companyResponse.message ?? "Unable to fetch company")
    }

    if (companyResponse.data === null) {
      throw new Error("The server did not return the company")
    }

    return {
      ...application,
      company: companyResponse.data.name,
    }
  }

  async getApplications(userId: string): Promise<ApplicationTableRow[]> {
    const [applicationsResponse, companiesResponse] = await Promise.all([
      httpService.get<Application[]>(
        `/applications/all?user_id=${encodeURIComponent(userId)}`
      ),
      httpService.get<Company[]>("/companies/all"),
    ])

    if (
      applicationsResponse.status_code < 200 ||
      applicationsResponse.status_code >= 300
    ) {
      throw new Error(
        applicationsResponse.message ?? "Unable to fetch applications"
      )
    }

    if (
      companiesResponse.status_code < 200 ||
      companiesResponse.status_code >= 300
    ) {
      throw new Error(companiesResponse.message ?? "Unable to fetch companies")
    }

    if (applicationsResponse.data === null) {
      throw new Error("The server did not return applications")
    }

    if (companiesResponse.data === null) {
      throw new Error("The server did not return companies")
    }

    const companyNames = new Map(
      companiesResponse.data.map((company) => [
        company.company_id,
        company.name,
      ])
    )

    return applicationsResponse.data.map((application) => ({
      id: application.application_id,
      application_index: application.application_index,
      company: companyNames.get(application.company_id) ?? "Unknown company",
      role: application.role,
      status: application.status,
      applied_on: application.applied_on,
    }))
  }
}

export const applicationService = new ApplicationService()
