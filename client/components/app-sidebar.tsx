"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CalendarDaysIcon,
  CircleHelpIcon,
  ContactRoundIcon,
  Form,
  LayoutDashboardIcon,
  MessageSquareTextIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react"

const data = {
  // TODO: Replace user with actual user data from your user state manager
  user: {
    name: "ApplyFlow User",
    email: "user@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: "Applications",
      url: "/applications",
      icon: <BriefcaseBusinessIcon />,
      items: [
        {
          title: "All Applications",
          url: "/applications",
        },
        {
          title: "Add Application",
          url: "/applications/new",
        },
        {
          title: "Status Pipeline",
          url: "/applications/statuses",
        },
      ],
    },
    {
      title: "Companies",
      url: "/companies",
      icon: <Building2Icon />,
      items: [
        {
          title: "All Companies",
          url: "/companies",
        },
        {
          title: "Add Company",
          url: "/companies/new",
        },
      ],
    },
    {
      title: "Interviews",
      url: "/interviews",
      icon: <CalendarDaysIcon />,
      items: [
        {
          title: "Upcoming Interviews",
          url: "/interviews",
        },
        {
          title: "Schedule Interview",
          url: "/interviews/new",
        },
      ],
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: <ContactRoundIcon />,
      items: [
        {
          title: "All Contacts",
          url: "/contacts",
        },
        {
          title: "Add Contact",
          url: "/contacts/new",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/user",
      icon: <UserRoundIcon />,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <SettingsIcon />,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: <MessageSquareTextIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="bg-sidebar-secondary flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary">
                <Form className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">ApplyFlow</span>
                <span className="truncate text-xs">Free Tier</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
