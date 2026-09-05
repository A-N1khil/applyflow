import * as React from "react"

import { cn } from "@/lib/utils"
import styles from "./timeline.module.css"

type TimelineEntry = {
  id: string
  title: React.ReactNode
  date: string
  time?: string
}

type TimelineProps = React.ComponentProps<"ol"> & {
  items: TimelineEntry[]
}

function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <ol
      data-slot="timeline"
      className={cn(styles.timeline, className)}
      {...props}
    >
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <span aria-hidden="true" className={styles.marker} />
          <div className={styles.heading}>
            <div className={styles.title}>{item.title}</div>
            {item.time && <span className={styles.time}>{item.time}</span>}
          </div>
          <p className={styles.date}>{item.date}</p>
        </li>
      ))}
    </ol>
  )
}

export { Timeline, type TimelineEntry, type TimelineProps }
