import type { Application, ApplicationTableRow } from "@/models/application"
import { httpService } from "@/services/http-service"

interface Company {
  company_id: string
  name: string
  website: string | null
}

export class ApplicationService {
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
      id: application.id,
      company: companyNames.get(application.company_id) ?? "Unknown company",
      role: application.role,
      status: application.status,
      applied_on: application.created_at,
    }))
  }
}

export const applicationService = new ApplicationService()
