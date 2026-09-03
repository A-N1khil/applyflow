"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
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
  LayoutDashboardIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  Form,
  Building2,
  TvMinimal,
  User,
  FileText,
  FileUser,
  Brain,
  Code,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Applications",
      url: "#",
      icon: <FileText />,
    },
    {
      title: "Companies",
      url: "#",
      icon: <Building2 />,
    },
    {
      title: "Interviews",
      url: "#",
      icon: <TvMinimal />,
    },
    {
      title: "Portfolio",
      url: "#",
      icon: <User />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Resumes",
      url: "#",
      icon: <FileUser />,
    },
    {
      name: "Skills",
      url: "#",
      icon: <Brain />,
    },
    {
      name: "Projects",
      url: "#",
      icon: <Code />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <Form className="size-5!" />
              <span className="text-base font-semibold">ApplyFlow</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
