"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { ApplicationActivity } from "@/models/application-activity"
import { ApplicationNote } from "@/models/application-note"
import { Form, User } from "lucide-react"
import { activityTitle } from "@/app/applications/[application_index]/utils"

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

function ActivityBubble({ activityRecords }: { activityRecords: ApplicationActivity[] }) {
  return (
    <BubbleGroup>
      {activityRecords.map((activity: ApplicationActivity, index: number) => (
        <Bubble key={`activity-${index}`} variant={"muted"}>
          <BubbleContent>{activityTitle(activity)}</BubbleContent>
        </Bubble>
      ))}
    </BubbleGroup>
  )
}

function NoteBubble({ records }: { records: ApplicationNote[] }) {
  return (
    <BubbleGroup>
      {records.map((note: ApplicationNote, index: number) => (
        <Bubble key={`note-${index}`}>
          <BubbleContent>{note.note_data}</BubbleContent>
        </Bubble>
      ))}
    </BubbleGroup>
  )
}

export default function ApplicationTimeline({ records }: ApplicationTimelineProps) {
  const groupedRecords: ApplicationTimelineRecord[][] = records.reduce((group, record) => {
    const lastGroup = group[group.length - 1]
    if (lastGroup && lastGroup[0].type === record.type) {
      lastGroup.push(record)
    } else {
      group.push([record])
    }
    return group
  }, [] as ApplicationTimelineRecord[][])

  const renderMessageContent = (group: ApplicationTimelineRecord[]) => {
    if (group[0].type === "activity") {
      const activityRecords = group as unknown as ApplicationActivity[]
      return <ActivityBubble activityRecords={activityRecords} />
    } else if (group[0].type === "note") {
      const noteRecords = group as unknown as ApplicationNote[]
      return <NoteBubble records={noteRecords} />
    }
  }

  return (
    <>
      {groupedRecords.map((group: ApplicationTimelineRecord[], index: number) => (
        <Message key={`group-${index}`} align={group[0].type === "activity" ? "start" : "end"}>
          <MessageAvatar>
            <Avatar>
              <AvatarFallback>{group[0].type === "activity" ? <Form /> : <User />}</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>{renderMessageContent(group)}</MessageContent>
        </Message>
      ))}
    </>
  )
}
