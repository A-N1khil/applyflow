"use client"

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

export default function ApplicationTimeline() {}
