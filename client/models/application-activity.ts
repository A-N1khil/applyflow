export type ApplicationChangeType = "create" | "update" | "delete"

export interface ApplicationActivity {
  activity_id: string
  activity_index: number
  activity_time: string
  user_id: string
  application_id: string
  change_type: ApplicationChangeType
  old_value: string | null
  new_value: string | null
}
