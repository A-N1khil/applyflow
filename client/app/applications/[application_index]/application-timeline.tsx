"use client"

import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"

type ApplicationTimelineRecord = {
  id: string
  title: string
  date: string
  type: "activity" | "note"
  time?: string
}

type ApplicationTimelineProps = {
  records: ApplicationTimelineRecord[]
}

export default function ApplicationTimeline({ records }: ApplicationTimelineProps) {
  const { user } = useUser()

  const groupedRecords: ApplicationTimelineRecord[][] = records.reduce((group, record) => {
    const lastGroup = group[group.length - 1]
    if (lastGroup && lastGroup[0].type === record.type) {
      lastGroup.push(record)
    } else {
      group.push([record])
    }
    return group
  }, [] as ApplicationTimelineRecord[][])
}
