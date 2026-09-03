"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

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
}

export function DataTable<RowData>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No results found.",
  className,
}: DataTableProps<RowData>) {
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
            {data.length ? (
              data.map((row) => (
                <TableRow key={getRowKey(row)}>
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
