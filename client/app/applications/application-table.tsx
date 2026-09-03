"use client"

import { ApplicationDrawer } from "@/app/applications/application-drawer"
import { ApplicationStatusSelect } from "@/app/applications/application-status-select"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { useUser } from "@/contexts/user-context"
import type { ApplicationTableRow } from "@/models/application"
import { applicationService } from "@/services/application-service"
import { useEffect, useState } from "react"

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
})

function formatAppliedOn(appliedOn: string): string {
  const date = new Date(appliedOn)
  return Number.isNaN(date.getTime()) ? appliedOn : dateFormatter.format(date)
}

function getColumns(
  onStatusChange: (applicationId: string, status: string) => void
): DataTableColumn<ApplicationTableRow>[] {
  return [
    {
      id: "application-index",
      header: null,
      cell: (application) => application.application_index,
      headerClassName: "w-12",
      cellClassName: "w-12 text-muted-foreground",
    },
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
        <div onClick={(event) => event.stopPropagation()}>
          <ApplicationStatusSelect
            value={application.status}
            onValueChange={(status) => onStatusChange(application.id, status)}
            ariaLabel={`Change status for ${application.company}`}
          />
        </div>
      ),
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
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationTableRow | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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
          setApplications(
            [...rows].sort(
              (firstApplication, secondApplication) =>
                firstApplication.application_index -
                secondApplication.application_index
            )
          )
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

  function handleRowClick(application: ApplicationTableRow) {
    setSelectedApplication(application)
    setIsDrawerOpen(true)
  }

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
        onRowClick={handleRowClick}
        emptyMessage={
          !user
            ? "No user available."
            : applications === null
              ? "Loading applications..."
              : "No applications found."
        }
      />
      <ApplicationDrawer
        key={selectedApplication?.id ?? "no-application"}
        application={selectedApplication}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  )
}
