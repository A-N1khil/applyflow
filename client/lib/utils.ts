import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const siteMetadata = {
  title: "ApplyFlow",
  description: "A simple job application tracker built with Next.js and Tailwind CSS.",
  keywords: ["job", "application", "tracker", "nextjs", "tailwindcss"],
} as const;