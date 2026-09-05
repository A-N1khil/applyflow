"use client"

import { ApplicationStatusSelect } from "@/app/applications/application-status-select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ApplicationTableRow } from "@/models/application"
import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

interface ApplicationDrawerProps {
  application: ApplicationTableRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function parseAppliedOn(appliedOn: string): Date | undefined {
  const date = new Date(appliedOn)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatDateInput(date: Date | undefined): string {
  if (!date) {
    return ""
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function parseDateInput(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined
  }

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

export function ApplicationDrawer({
  application,
  open,
  onOpenChange,
}: ApplicationDrawerProps) {
  const [company, setCompany] = useState(application?.company ?? "")
  const [role, setRole] = useState(application?.role ?? "")
  const [status, setStatus] = useState(application?.status ?? "APPLIED")
  const initialAppliedOn = application
    ? parseAppliedOn(application.applied_on)
    : undefined
  const initialAppliedOnInput = formatDateInput(initialAppliedOn)
  const [appliedOn, setAppliedOn] = useState<Date | undefined>(initialAppliedOn)
  const [appliedOnInput, setAppliedOnInput] = useState(initialAppliedOnInput)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  if (!application) {
    return null
  }

  const hasChanges =
    company !== application.company ||
    role !== application.role ||
    status !== application.status ||
    appliedOnInput !== initialAppliedOnInput

  function handleAppliedOnInputChange(value: string) {
    setAppliedOnInput(value)

    const parsedDate = parseDateInput(value)
    if (parsedDate) {
      setAppliedOn(parsedDate)
    }
  }

  function handleAppliedOnSelect(date: Date | undefined) {
    if (!date) {
      return
    }

    setAppliedOn(date)
    setAppliedOnInput(formatDateInput(date))
    setIsCalendarOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader className="border-b pb-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle>Quick Edit</DrawerTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Open full application"
              render={
                <Link href={`/applications/${application.application_index}`} />
              }
            >
              <IconExternalLink
                className="h-auto w-5 shrink-0"
                aria-hidden="true"
              />
            </Button>
          </div>
          <DrawerDescription>
            #{application.application_index} - {application.role},{" "}
            {application.company}
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="application-company">Company</FieldLabel>
              <Input
                id="application-company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="application-role">Role</FieldLabel>
              <Input
                id="application-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <ApplicationStatusSelect
                value={status}
                onValueChange={setStatus}
                ariaLabel={`Change status for ${application.company}`}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="application-applied-on">
                Applied on
              </FieldLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger
                  render={
                    <Input
                      id="application-applied-on"
                      inputMode="numeric"
                      placeholder="YYYY-MM-DD"
                      value={appliedOnInput}
                      onChange={(event) =>
                        handleAppliedOnInputChange(event.target.value)
                      }
                    />
                  }
                />
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={appliedOn}
                    onSelect={handleAppliedOnSelect}
                    defaultMonth={appliedOn}
                  />
                </PopoverContent>
              </Popover>
            </Field>
          </FieldGroup>
        </div>

        <DrawerFooter className="bg-text-background border-t pt-4">
          {hasChanges && (
            <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
              Save changes
            </Button>
          )}
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
