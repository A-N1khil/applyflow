import { Geist_Mono, Oxanium, Instrument_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const instrumentSansHeading = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        oxanium.variable,
        instrumentSansHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <UserProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
