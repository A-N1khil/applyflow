"use client"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  IconBrandZoom,
  IconBubbleText,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconListNumbers,
  IconMailSpark,
  IconProgress,
  IconVideoPlus,
  type TablerIcon,
} from "@tabler/icons-react"

const statusIconMap: Record<string, TablerIcon> = {
  APPLIED: IconProgress,
  RECRUITER_CONTACT: IconBubbleText,
  ASSESSMENT: IconListNumbers,
  INTERVIEW: IconBrandZoom,
  FINAL_INTERVIEW: IconVideoPlus,
  OFFER: IconMailSpark,
  REJECTED: IconCircleCheckFilled,
  WITHDRAWN: IconCircleXFilled,
}

const statusColorMap: Record<string, string> = {
  APPLIED: "!text-yellow-600 dark:!text-yellow-400",
  RECRUITER_CONTACT: "!text-blue-600 dark:!text-blue-400",
  ASSESSMENT: "!text-indigo-600 dark:!text-indigo-400",
  INTERVIEW: "!text-orange-600 dark:!text-orange-400",
  FINAL_INTERVIEW: "!text-orange-600 dark:!text-orange-400",
  OFFER: "!text-green-600 dark:!text-green-400",
  REJECTED: "!text-red-600 dark:!text-red-400",
  WITHDRAWN: "!text-gray-600 dark:!text-gray-400",
}

const applicationStatuses = Object.keys(statusIconMap)

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function StatusOption({ status }: { status: string }) {
  const StatusIcon = statusIconMap[status] ?? IconProgress
  const iconColor =
    statusColorMap[status] ?? "!text-gray-600 dark:!text-gray-400"

  return (
    <span className="flex items-center gap-1.5 text-foreground">
      <StatusIcon
        className={cn("h-auto w-[1em] shrink-0", iconColor)}
        aria-hidden="true"
      />
      {formatStatus(status)}
    </span>
  )
}

interface ApplicationStatusSelectProps {
  value: string
  onValueChange: (status: string) => void
  ariaLabel: string
}

export function ApplicationStatusSelect({
  value,
  onValueChange,
  ariaLabel,
}: ApplicationStatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(status) => {
        if (status) {
          onValueChange(status)
        }
      }}
    >
      <SelectTrigger
        size="sm"
        className="h-auto rounded-full border-input bg-background px-2.5 py-1 text-foreground dark:bg-input/30"
        aria-label={ariaLabel}
      >
        <SelectValue>
          <StatusOption status={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="min-w-52">
        <SelectGroup>
          {applicationStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              <Badge
                variant="outline"
                className="rounded-full border-border bg-background px-2.5 py-1 text-foreground dark:bg-input/30"
              >
                <StatusOption status={status} />
              </Badge>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
