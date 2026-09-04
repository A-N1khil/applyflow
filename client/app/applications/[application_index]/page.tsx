"use client"

import {
  ApplicationStatusBadge,
  ApplicationStatusSelect,
} from "@/app/applications/application-status-select"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/contexts/user-context"
import type { ApplicationDetails } from "@/models/application"
import { applicationService } from "@/services/application-service"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const appliedOnFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

function formatAppliedOn(appliedOn: string): string {
  const date = new Date(appliedOn)
  return Number.isNaN(date.getTime())
    ? appliedOn
    : appliedOnFormatter.format(date)
}

export default function ApplicationExpandedPage() {
  const { user } = useUser()
  const params = useParams<{ application_index: string }>()
  const applicationIndex = Number(params.application_index)
  const hasValidApplicationIndex =
    Number.isInteger(applicationIndex) && applicationIndex > 0
  const [application, setApplication] = useState<ApplicationDetails | null>(
    null
  )
  const [initialApplication, setInitialApplication] =
    useState<ApplicationDetails | null>(null)
  const [applicationError, setApplicationError] = useState<string | null>(null)
  const [note, setNote] = useState("")

  useEffect(() => {
    if (!user || !hasValidApplicationIndex) {
      return
    }

    let ignoreResponse = false

    applicationService
      .getApplicationByIndex(user.id, applicationIndex)
      .then((fetchedApplication) => {
        if (!ignoreResponse) {
          setApplication(fetchedApplication)
          setInitialApplication(fetchedApplication)
          setApplicationError(null)
        }
      })
      .catch((error: unknown) => {
        if (!ignoreResponse) {
          setApplicationError(
            error instanceof Error
              ? error.message
              : "Unable to fetch application"
          )
        }
      })

    return () => {
      ignoreResponse = true
    }
  }, [applicationIndex, hasValidApplicationIndex, user])

  function updateApplication<FieldName extends keyof ApplicationDetails>(
    fieldName: FieldName,
    value: ApplicationDetails[FieldName]
  ) {
    setApplication((currentApplication) =>
      currentApplication
        ? { ...currentApplication, [fieldName]: value }
        : currentApplication
    )
  }

  const pageMessage = !hasValidApplicationIndex
    ? "Invalid application index"
    : !user
      ? "No user available"
      : applicationError

  const detailsHaveChanged =
    application !== null &&
    initialApplication !== null &&
    (application.company !== initialApplication.company ||
      application.role !== initialApplication.role ||
      application.location !== initialApplication.location ||
      application.url !== initialApplication.url ||
      application.status !== initialApplication.status ||
      application.applied_on !== initialApplication.applied_on)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-4">
          <main className="p-6 lg:col-span-3 lg:p-8">
            {pageMessage ? (
              <p className="text-sm text-destructive">{pageMessage}</p>
            ) : !application ? (
              <p className="text-sm text-muted-foreground">
                Loading application...
              </p>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="font-heading text-2xl font-semibold tracking-tight">
                    {application.role}, {application.company} - #
                    {application.application_index}
                  </h1>
                  <ApplicationStatusBadge
                    status={application.status}
                    size="large"
                  />
                </div>

                <Field>
                  <FieldLabel htmlFor="application-note">Note</FieldLabel>
                  <Textarea
                    id="application-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Write a note in Markdown..."
                    className="min-h-28"
                  />
                </Field>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" disabled={!note.trim()}>
                    Submit Note
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNote("")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </main>
          {application && !pageMessage && (
            <aside
              className="border-t bg-muted/20 p-6 lg:col-span-1 lg:border-t-0 lg:border-l lg:p-8"
              aria-label="Application details"
            >
              <div className="space-y-6">
                <h2 className="font-heading text-lg font-semibold tracking-tight">
                  Details
                </h2>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="expanded-company">Company</FieldLabel>
                    <Input
                      id="expanded-company"
                      value={application.company}
                      onChange={(event) =>
                        updateApplication("company", event.target.value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expanded-role">Role</FieldLabel>
                    <Input
                      id="expanded-role"
                      value={application.role}
                      onChange={(event) =>
                        updateApplication("role", event.target.value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expanded-location">
                      Location
                    </FieldLabel>
                    <Input
                      id="expanded-location"
                      value={application.location ?? ""}
                      onChange={(event) =>
                        updateApplication("location", event.target.value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expanded-url">URL</FieldLabel>
                    <Input
                      id="expanded-url"
                      value={application.url ?? ""}
                      onChange={(event) =>
                        updateApplication("url", event.target.value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <ApplicationStatusSelect
                      value={application.status}
                      onValueChange={(status) =>
                        updateApplication("status", status)
                      }
                      ariaLabel={`Change status for ${application.company}`}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expanded-applied-on">
                      Applied on
                    </FieldLabel>
                    <Input
                      id="expanded-applied-on"
                      value={formatAppliedOn(application.applied_on)}
                      onChange={(event) =>
                        updateApplication("applied_on", event.target.value)
                      }
                    />
                  </Field>
                </FieldGroup>
                {detailsHaveChanged && (
                  <Button className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                    Save changes
                  </Button>
                )}
              </div>
            </aside>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
