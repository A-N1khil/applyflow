export interface User {
  id: string
  firstname: string
  lastname: string
  location: string
}

export interface UserCreate {
  firstname: string
  lastname: string
  location: string
}

export interface UserUpdate {
  id: string
  firstname?: string
  lastname?: string
  location?: string
}
