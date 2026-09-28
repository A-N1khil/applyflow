import type { ApplicationActivity } from "@/models/application-activity"
import type { ApplicationNote } from "@/models/application-note"
import type { User } from "@/models/user"

export const appliedOnFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function formatAppliedOn(appliedOn: string): string {
  const date = new Date(appliedOn)
  return Number.isNaN(date.getTime()) ? appliedOn : appliedOnFormatter.format(date)
}

export type ApplicationTimelineRecord =
  (ApplicationNote & { type: "note" }) | (ApplicationActivity & { type: "activity" })

export function timelineTimestamp(record: ApplicationTimelineRecord): number {
  return new Date(record.type === "note" ? record.note_date : record.activity_time).getTime()
}

export function activityTitle(name: string | undefined, activity: ApplicationActivity): string {
  name = name ?? "System"
  if (activity.change_type === "create") {
    return `${name} created the application`
  }
  if (activity.change_type === "delete") {
    return `${name} deleted the application`
  }
  const field: string = activity.what_change?.replaceAll("_", " ") || "Application"
  return `${name} changed ${field} from ${activity.old_value ?? "Not set"} to ${activity.new_value ?? "Not set"}`
}

export const timelineDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})
export const timelineTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
})
