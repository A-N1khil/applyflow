"use client"

import { DataTable, type DataTableColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import type { ApplicationTableRow } from "@/models/application"
import { applicationService } from "@/services/application-service"
import { useEffect, useState } from "react"

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

function formatAppliedOn(createdAt: string): string {
  const date = new Date(createdAt)
  return Number.isNaN(date.getTime()) ? createdAt : dateFormatter.format(date)
}

const columns: DataTableColumn<ApplicationTableRow>[] = [
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
    cell: (application) => (
      <Badge variant="outline" className="text-muted-foreground">
        {formatStatus(application.status)}
      </Badge>
    ),
  },
  {
    id: "applied-on",
    header: "Applied on",
    cell: (application) => formatAppliedOn(application.applied_on),
  },
]

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

    applicationService
      .getApplications(user.id)
      .then((rows) => {
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
