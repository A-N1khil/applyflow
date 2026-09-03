"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUser } from "@/contexts/user-context"
import { cn } from "@/lib/utils"
import type { ApplicationTableRow } from "@/models/application"
import { applicationService } from "@/services/application-service"
import { useEffect, useState } from "react"
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

const statusIconColorMap: Record<string, string> = {
  APPLIED: "!text-yellow-500 dark:!text-yellow-400",
  RECRUITER_CONTACT: "!text-blue-500 dark:!text-blue-400",
  ASSESSMENT: "!text-indigo-500 dark:!text-indigo-400",
  INTERVIEW: "!text-orange-500 dark:!text-orange-400",
  FINAL_INTERVIEW: "!text-orange-600 dark:!text-orange-500",
  OFFER: "!text-green-500 dark:!text-green-400",
  REJECTED: "!text-red-500 dark:!text-red-400",
  WITHDRAWN: "!text-gray-500 dark:!text-gray-400",
}

const applicationStatuses = Object.keys(statusIconMap)

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
})

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatAppliedOn(appliedOn: string): string {
  const date = new Date(appliedOn)
  return Number.isNaN(date.getTime()) ? appliedOn : dateFormatter.format(date)
}

function StatusOption({ status }: { status: string }) {
  const StatusIcon = statusIconMap[status] ?? IconProgress
  const iconColor =
    statusIconColorMap[status] ?? "!text-gray-500 dark:!text-gray-400"

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

function getColumns(
  onStatusChange: (applicationId: string, status: string) => void
): DataTableColumn<ApplicationTableRow>[] {
  return [
    {
      id: "company",
      header: "Company",
      cell: (application) => application.company,
      cellClassName: "font-medium",
    },
    {
      id: "role",
      header: "Role",
      cell: (application) => application.role,
    },
    {
      id: "status",
      header: "Status",
      cell: (application) => {
        return (
          <Select
            value={application.status}
            onValueChange={(status) => {
              if (status) {
                onStatusChange(application.id, status)
              }
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-auto rounded-full border-input bg-background px-2.5 py-1 text-foreground dark:bg-input/30"
              aria-label={`Change status for ${application.company}`}
            >
              <SelectValue>
                <StatusOption status={application.status} />
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
      },
    },
    {
      id: "applied-on",
      header: "Applied on",
      cell: (application) => formatAppliedOn(application.applied_on),
    },
  ]
}

export default function ApplicationsTable() {
  // user from context
  const { user } = useUser()

  // Applications state
  const [applications, setApplications] = useState<
    ApplicationTableRow[] | null
  >(null)
  const [applicationError, setApplicationError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    let ignoreResponse = false

    const skeletonDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 3000)
    })

    Promise.all([applicationService.getApplications(user.id), skeletonDelay])
      .then(([rows]) => {
        if (!ignoreResponse) {
          setApplications(rows)
          setApplicationError(null)
        }
      })
      .catch((error: unknown) => {
        if (!ignoreResponse) {
          setApplicationError(
            error instanceof Error
              ? error.message
              : "Unable to fetch applications"
          )
          setApplications([])
        }
      })

    return () => {
      ignoreResponse = true
    }
  }, [user])

  function handleStatusChange(applicationId: string, status: string) {
    setApplications(
      (currentApplications) =>
        currentApplications?.map((application) =>
          application.id === applicationId
            ? { ...application, status }
            : application
        ) ?? null
    )

    // FIXME: Persist the selected application status to the database.
  }

  const columns = getColumns(handleStatusChange)

  return (
    <div className="space-y-4">
      {applicationError && (
        <p className="px-4 text-sm text-destructive lg:px-6">
          {applicationError}
        </p>
      )}
      <DataTable
        columns={columns}
        data={applications ?? []}
        getRowKey={(application) => application.id}
        isLoading={Boolean(user) && applications === null}
        skeletonRowCount={5}
        emptyMessage={
          !user
            ? "No user available."
            : applications === null
              ? "Loading applications..."
              : "No applications found."
        }
      />
    </div>
  )
}
