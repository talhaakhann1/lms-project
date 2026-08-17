"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
  createOrderColumns,
  type OrderAction,
} from "../../../components/admin/orders/columns";

import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Skeleton } from "../../../components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { Order } from "@/src/types/interfaces/order.interface";

const PAGE_SIZE = 8;
const SKELETON_ROWS = 6;

const searchOrders: FilterFn<Order> = (
  row,
  _columnId,
  filterValue
) => {
  const query = String(filterValue ?? "")
    .trim()
    .toLowerCase();

  if (!query) return true;

  const order = row.original;

  return [
    order.id,
    order.user?.fullName,
    order.user?.email,
    order.course?.title,
    order.status,
    order.isPaid ? "paid" : "unpaid",
  ].some((field) =>
    String(field ?? "")
      .toLowerCase()
      .includes(query)
  );
};

interface OrdersTableProps {
  data: Order[];
  isLoading?: boolean;
  onAction?: (action: OrderAction, order: Order) => void;
}

export function OrdersTable({
  data,
  isLoading = false,
  onAction,
}: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState("");

  const reduceMotion = useReducedMotion();

  /**
   * Handle order actions
   */
  const handleAction = useCallback(
    (action: OrderAction, order: Order) => {
      onAction?.(action, order);
    },
    [onAction]
  );

  const columns = useMemo<ColumnDef<Order>[]>(
    () => createOrderColumns(handleAction),
    [handleAction]
  );

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      rowSelection,
      globalFilter,
    },

    globalFilterFn: searchOrders,

    getRowId: (row) => row.id,

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
  });

  const rows = table.getRowModel().rows;

  const selectedCount =
    table.getSelectedRowModel().rows.length;

  const filteredCount =
    table.getFilteredRowModel().rows.length;

  return (
    <motion.section
      aria-label="Orders"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 8 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
        delay: 0.15,
      }}
    >
      <h2 className="sr-only">All orders</h2>

      <Card>
        <CardContent className="space-y-4 px-0">
          {/* Search */}
          <div className="px-4">
            <Label
              className="sr-only"
              htmlFor="orders-search"
            >
              Search orders
            </Label>

            <div className="relative max-w-sm">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              />

              <Input
                id="orders-search"
                type="search"
                value={globalFilter}
                onChange={(event) =>
                  setGlobalFilter(event.target.value)
                }
                placeholder="Search by customer, email or course"
                className="pl-8"
              />
            </div>
          </div>

          {/* Table */}
         <div className="overflow-x-auto rounded-lg">
          <Table className="min-w-[880px] border-t-2">
            <TableCaption className="sr-only">
              Orders with customer, course, amount, payment
              status, order status and purchase date.
            </TableCaption>

            <TableHeader>
              {table.getHeaderGroups().map(
                (headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header, index) => (
                        <TableHead
                          key={header.id}
                          className={
                            index === 0
                              ? "pl-4"
                              : undefined
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column
                                  .columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    )}
                  </TableRow>
                )
              )}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableSkeleton
                  columnCount={columns.length}
                />
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                  >
                    <EmptyState
                      hasQuery={
                        globalFilter.trim().length > 0
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="h-14"
                    data-state={
                      row.getIsSelected()
                        ? "selected"
                        : undefined
                    }
                  >
                    {row
                      .getVisibleCells()
                      .map((cell, index) => (
                        <TableCell
                          key={cell.id}
                          className={
                            index === 0
                              ? "pl-4"
                              : undefined
                          }
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
          <div className="flex flex-col gap-3 border-t px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              aria-live="polite"
              className="text-sm text-muted-foreground"
            >
              {selectedCount} of {filteredCount} order(s)
              selected
            </p>

            <div className="flex items-center gap-3">
              <span className="text-sm tabular-nums text-muted-foreground">
                Page{" "}
                {table.getState().pagination.pageIndex + 1}{" "}
                of{" "}
                {Math.max(
                  table.getPageCount(),
                  1
                )}
              </span>

              <Button
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                size="sm"
                variant="outline"
              >
                <ChevronLeftIcon aria-hidden="true" />
                Previous
              </Button>

              <Button
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                size="sm"
                variant="outline"
              >
                Next
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

function TableSkeleton({
  columnCount,
}: {
  columnCount: number;
}) {
  return (
    <>
      {Array.from({
        length: SKELETON_ROWS,
      }).map((_, rowIndex) => (
        <TableRow
          className="h-14"
          key={`skeleton-row-${rowIndex}`}
        >
          {Array.from({
            length: columnCount,
          }).map((_, cellIndex) => (
            <TableCell
              key={`skeleton-cell-${rowIndex}-${cellIndex}`}
              className={
                cellIndex === 0
                  ? "pl-4"
                  : undefined
              }
            >
              <Skeleton className="h-5 w-full max-w-32" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyState({
  hasQuery,
}: {
  hasQuery: boolean;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center">
      <p className="text-sm font-medium">
        No orders found
      </p>

      <p className="max-w-sm text-sm text-muted-foreground">
        {hasQuery
          ? "No orders match your search. Try a different customer, email or course."
          : "Orders will appear here as soon as customers start purchasing courses."}
      </p>
    </div>
  );
}

export default OrdersTable;