"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { columns } from "../../../components/admin/enrollments/columns";
import { Enrollment } from "@/src/types/interfaces/enrollment.interface";

export interface EnrollmentsTableProps {
  enrollments?: Enrollment[] ;
  isLoading?: boolean;
  onViewEnrollment?: (enrollment: Enrollment) => void;
  onViewStudent?: (enrollment: Enrollment) => void;
  onViewCourse?: (enrollment: Enrollment) => void;
}

export function EnrollmentsTable({
  enrollments = [],
  isLoading = false,
  onViewEnrollment,
  onViewStudent,
  onViewCourse,
}: EnrollmentsTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "enrolledAt",
      desc: true,
    },
  ]);

  const table = useReactTable({
    data: enrollments,
    columns,
    state: {
      sorting,
      globalFilter,
    },

    globalFilterFn: (row, _columnId, filterValue: string) => {
      const query = filterValue.trim().toLowerCase();

      if (!query) return true;

      const enrollment = row.original;

      return (
        enrollment.user?.fullName?.toLowerCase().includes(query) ||
        enrollment.user?.email?.toLowerCase().includes(query) ||
        enrollment.course?.title?.toLowerCase().includes(query) ||
        enrollment.course?.instructor?.fullName
          ?.toLowerCase()
          .includes(query) ||
        enrollment.id.toLowerCase().includes(query)
      );
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 8,
      },
    },

    meta: {
      onViewEnrollment,
      onViewStudent,
      onViewCourse,
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4"
    >
    
      <Input
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        placeholder="Search student, course, ID..."
        aria-label="Search enrollments"
        className="rounded-lg"
      />


      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <Table className="min-w-[880px]">
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full max-w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <UsersIcon className="size-5" strokeWidth={1.5} />
                    </span>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        No enrollments found
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" strokeWidth={1.75} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default EnrollmentsTable;

