"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { KeyboardEvent, ReactNode } from "react"

export interface DataTableColumn<RowData> {
  id: string
  header: ReactNode
  cell: (row: RowData) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

interface DataTableProps<RowData> {
  columns: DataTableColumn<RowData>[]
  data: RowData[]
  getRowKey: (row: RowData) => string | number
  emptyMessage?: string
  className?: string
  isLoading?: boolean
  skeletonRowCount?: number
  onRowClick?: (row: RowData) => void
}

export function DataTable<RowData>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No results found.",
  className,
  isLoading = false,
  skeletonRowCount = 5,
  onRowClick,
}: DataTableProps<RowData>) {
  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    row: RowData
  ) {
    if (
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault()
      onRowClick?.(row)
    }
  }

  return (
    <div className={cn("px-4 lg:px-6", className)}>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.cellClassName}>
                      <Skeleton className="h-5 w-full max-w-36" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length ? (
              data.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  className={cn(onRowClick && "cursor-pointer")}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(event) => handleRowKeyDown(event, row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.cellClassName}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
