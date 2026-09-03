export interface Application {
  application_id: string
  user_id: string
  company_id: string
  role: string
  location: string | null
  url: string | null
  status: string
  created_at: string
  applied_on: string
}

export interface ApplicationTableRow {
  id: string
  company: string
  role: string
  status: string
  applied_on: string
}
