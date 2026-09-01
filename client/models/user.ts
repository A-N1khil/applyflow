export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string | null
}

export interface UserCreate {
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface UserUpdate {
  email?: string
  first_name?: string
  last_name?: string
}
