"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  Globe2Icon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts"

const monthlyActivity = [
  { month: "Jan", applications: 4, interviews: 1 },
  { month: "Feb", applications: 6, interviews: 2 },
  { month: "Mar", applications: 5, interviews: 1 },
  { month: "Apr", applications: 9, interviews: 3 },
  { month: "May", applications: 7, interviews: 2 },
  { month: "Jun", applications: 11, interviews: 4 },
  { month: "Jul", applications: 8, interviews: 3 },
  { month: "Aug", applications: 10, interviews: 4 },
]

const applicationStatuses = [
  { status: "Applied", value: 18, fill: "var(--color-applied)" },
  { status: "Interviewing", value: 9, fill: "var(--color-interviewing)" },
  { status: "Offers", value: 2, fill: "var(--color-offers)" },
  { status: "Closed", value: 19, fill: "var(--color-closed)" },
]

const activityChartConfig = {
  applications: {
    label: "Applications",
    color: "var(--chart-1)",
  },
  interviews: {
    label: "Interviews",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const statusChartConfig = {
  applied: {
    label: "Applied",
    color: "var(--chart-1)",
  },
  interviewing: {
    label: "Interviewing",
    color: "var(--chart-2)",
  },
  offers: {
    label: "Offers",
    color: "var(--chart-3)",
  },
  closed: {
    label: "Closed",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

const recentApplications = [
  {
    company: "Northstar Labs",
    role: "Backend Engineer",
    status: "Technical interview",
    date: "Aug 26, 2026",
  },
  {
    company: "Greenfield Health",
    role: "Python Developer",
    status: "Recruiter contact",
    date: "Aug 23, 2026",
  },
  {
    company: "Summit Finance",
    role: "API Engineer",
    status: "Applied",
    date: "Aug 19, 2026",
  },
]

export default function UserPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div>
            <p className="font-heading text-sm font-medium">User profile</p>
            <p className="text-xs text-muted-foreground">
              Your job search activity and progress
            </p>
          </div>
        </header>

        <main className="grid flex-1 gap-4 p-4 md:grid-cols-[280px_minmax(0,1fr)] md:p-6">
          <aside className="space-y-4">
            <Card>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-14">
                    <AvatarFallback className="text-base font-semibold">
                      NA
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h1 className="truncate font-heading text-lg font-semibold">
                      Nikhil Anand
                    </h1>
                    <p className="truncate text-sm text-muted-foreground">
                      nikhil@example.com
                    </p>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <PencilIcon />
                  Edit profile
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="size-4 text-muted-foreground" />
                    <span>New York, United States</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MailIcon className="size-4 text-muted-foreground" />
                    <span className="truncate">nikhil@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe2Icon className="size-4 text-muted-foreground" />
                    <span>Open to remote roles</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="mb-3 font-heading text-sm font-medium">
                    Target roles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Backend", "Python", "FastAPI"].map((role) => (
                      <span
                        key={role}
                        className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProfileStat
                  icon={<BriefcaseBusinessIcon />}
                  label="Applications this month"
                  value="10"
                />
                <ProfileStat
                  icon={<CalendarDaysIcon />}
                  label="Upcoming interviews"
                  value="3"
                />
                <ProfileStat
                  icon={<Clock3Icon />}
                  label="Average response time"
                  value="6 days"
                />
              </CardContent>
            </Card>
          </aside>

          <section className="min-w-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={<BriefcaseBusinessIcon />}
                label="Total applications"
                value="48"
                detail="10 this month"
              />
              <MetricCard
                icon={<TrendingUpIcon />}
                label="Response rate"
                value="37.5%"
                detail="Up 6% this quarter"
              />
              <MetricCard
                icon={<CalendarDaysIcon />}
                label="Interviews"
                value="9"
                detail="3 upcoming"
              />
              <MetricCard
                icon={<CheckCircle2Icon />}
                label="Offers"
                value="2"
                detail="4.2% offer rate"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
              <Card>
                <CardHeader>
                  <CardTitle>Application activity</CardTitle>
                  <CardDescription>
                    Applications and interviews over the past eight months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={activityChartConfig}
                    className="h-[280px] w-full"
                  >
                    <BarChart accessibilityLayer data={monthlyActivity}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar
                        dataKey="applications"
                        fill="var(--color-applications)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="interviews"
                        fill="var(--color-interviews)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Application status</CardTitle>
                  <CardDescription>
                    Current pipeline distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <ChartContainer
                      config={statusChartConfig}
                      className="mx-auto h-[210px] w-full max-w-[280px]"
                    >
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={applicationStatuses}
                          dataKey="value"
                          nameKey="status"
                          innerRadius={62}
                          outerRadius={88}
                          strokeWidth={4}
                        />
                      </PieChart>
                    </ChartContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-heading text-3xl font-semibold tabular-nums">
                        48
                      </span>
                      <span className="text-xs text-muted-foreground">
                        applications
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {applicationStatuses.map((item) => (
                      <div
                        key={item.status}
                        className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-xs"
                      >
                        <span className="text-muted-foreground">
                          {item.status}
                        </span>
                        <span className="font-medium tabular-nums">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent applications</CardTitle>
                <CardDescription>
                  Your latest job application activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentApplications.map((application) => (
                  <div
                    key={`${application.company}-${application.role}`}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Building2Icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {application.role}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {application.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                        {application.status}
                      </span>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {application.date}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium">{label}</span>
          <span className="[&_svg]:size-4">{icon}</span>
        </div>
        <p className="font-heading text-2xl font-semibold tabular-nums">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}

function ProfileStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
      <span className="flex-1 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}
