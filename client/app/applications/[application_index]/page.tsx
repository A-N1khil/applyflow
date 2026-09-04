"use client"

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

export default function ApplicationExpandedPage() {
  const { user } = useUser()
  const params = useParams<{ application_index: string }>()
  const applicationIndex = Number(params.application_index)
  const hasValidApplicationIndex =
    Number.isInteger(applicationIndex) && applicationIndex > 0
  const [application, setApplication] = useState<ApplicationDetails | null>(
    null
  )
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
        <div className="grid flex-1 grid-cols-1 lg:grid-cols-5">
          <main className="p-6 lg:col-span-3 lg:p-8">
            {pageMessage ? (
              <p className="text-sm text-destructive">{pageMessage}</p>
            ) : !application ? (
              <p className="text-sm text-muted-foreground">
                Loading application...
              </p>
            ) : (
              <div className="space-y-8">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  #{application.role}, {application.company} - #
                  {application.application_index}
                </h1>

                <FieldGroup className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="expanded-application-index">
                      Application index
                    </FieldLabel>
                    <Input
                      id="expanded-application-index"
                      type="number"
                      value={application.application_index}
                      onChange={(event) =>
                        updateApplication(
                          "application_index",
                          Number(event.target.value)
                        )
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expanded-user-id">User ID</FieldLabel>
                    <Input
                      id="expanded-user-id"
                      value={application.user_id}
                      onChange={(event) =>
                        updateApplication("user_id", event.target.value)
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="expanded-company-id">
                      Company ID
                    </FieldLabel>
                    <Input
                      id="expanded-company-id"
                      value={application.company_id}
                      onChange={(event) =>
                        updateApplication("company_id", event.target.value)
                      }
                    />
                  </Field>
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
                    <FieldLabel htmlFor="expanded-status">Status</FieldLabel>
                    <Input
                      id="expanded-status"
                      value={application.status}
                      onChange={(event) =>
                        updateApplication("status", event.target.value)
                      }
                    />
                  </Field>
                  <Field className="sm:col-span-2">
                    <FieldLabel htmlFor="expanded-applied-on">
                      Applied on
                    </FieldLabel>
                    <Input
                      id="expanded-applied-on"
                      value={application.applied_on}
                      onChange={(event) =>
                        updateApplication("applied_on", event.target.value)
                      }
                    />
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel htmlFor="application-note">Note</FieldLabel>
                  <Textarea
                    id="application-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Write a note in Markdown..."
                    className="min-h-40"
                  />
                </Field>

                <div className="flex flex-wrap gap-3">
                  <Button type="button">Submit Note</Button>
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
          <aside
            className="hidden border-l bg-muted/20 lg:col-span-2 lg:block"
            aria-label="Application details secondary panel"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
