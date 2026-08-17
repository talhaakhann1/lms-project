"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  UsersRound,
} from "lucide-react";

import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import {
  columns,
} from "../../../components/admin/users/Columns";

import { UserRoles } from "@/src/types/enums/user.enum";
import { User } from "@/src/types/interfaces/user.interface";

export interface UsersTableProps {
  data: User[];
  isLoading?: boolean;
  onRoleChange?: (userId: string, role: UserRoles) => void;
  onViewProfile?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onResetPassword?: (user: User) => void;
  onSuspendUser?: (user: User) => void;
  onActivateUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
  updatingRoleUserId?: string | null;
}

const SKELETON_ROWS = 8;

export function UsersTable({
  data,
  isLoading = false,
  onRoleChange,
  onViewProfile,
  onEditUser,
  onResetPassword,
  onSuspendUser,
  onActivateUser,
  onDeleteUser,
  updatingRoleUserId = null,
}: UsersTableProps) {
  const [sorting, setSorting] = React.useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,

    globalFilterFn: (row, _columnId, filterValue: string) => {
      const query = filterValue.trim().toLowerCase();

      if (!query) return true;

      const user = row.original;

      return (
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.title?.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    },

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
      onRoleChange,
      onViewProfile,
      onEditUser,
      onResetPassword,
      onSuspendUser,
      onActivateUser,
      onDeleteUser,
      updatingRoleUserId,
    },
  });

  const rows = table.getRowModel().rows;
  const selectedCount =
    table.getFilteredSelectedRowModel().rows.length;

  const columnCount = columns.length;
 
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Input
            value={globalFilter}
            onChange={(event) =>
              setGlobalFilter(event.target.value)
            }
            placeholder="Search by name or email"
            aria-label="Search users"
            className="pl-9"
          />
        </div>

        {selectedCount > 0 && (
          <p className="whitespace-nowrap text-sm text-muted-foreground">
            {selectedCount} of {rows.length} row(s) selected
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table className="min-w-[880px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
              Array.from({ length: SKELETON_ROWS }).map(
                (_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {Array.from({ length: columnCount }).map(
                      (__, cellIndex) => (
                        <TableCell
                          key={`skeleton-cell-${cellIndex}`}
                        >
                          <Skeleton className="h-5 w-full max-w-[140px]" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                )
              )
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.15,
                    ease: "easeOut",
                  }}
                  data-state={
                    row.getIsSelected()
                      ? "selected"
                      : undefined
                  }
                  className="border-b border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="h-64 p-0"
                >
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <UsersRound
                        className="size-6"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-foreground">
                        No users found
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search to find what
                        you&apos;re looking for.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page{" "}
          {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(table.getPageCount(), 1)}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="gap-1.5"
          >
            <ChevronLeft
              className="size-4"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="gap-1.5"
          >
            Next

            <ChevronRight
              className="size-4"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UsersTable;