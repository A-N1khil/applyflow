import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const pageNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  applications: "Applications",
  companies: "Companies",
  interviews: "Interviews",
}

export function SiteHeader() {
  const pathname: string = usePathname()
  const pageName: string = pathname.split("/").filter(Boolean)[0]

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">
          {pageNameMap[pageName] || "Dashboard"}
        </h1>
      </div>
    </header>
  )
}
