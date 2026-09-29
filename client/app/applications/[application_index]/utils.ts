import type { ApplicationActivity } from "@/models/application-activity"
import type { ApplicationNote } from "@/models/application-note"

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

export function activityTitle(activity: ApplicationActivity): string {
  if (activity.change_type === "create") {
    return `You created the application`
  }
  if (activity.change_type === "delete") {
    return `You deleted the application`
  }
  const field: string = activity.what_change?.replaceAll("_", " ") || "Application"
  return `You changed ${field} from ${activity.old_value ?? "Not set"} to ${activity.new_value ?? "Not set"}`
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
