"use client";

import type { ColumnDef, RowData } from "@tanstack/react-table";
import { BookOpen, Eye, MoreHorizontal, User } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Enrollment } from "@/src/types/interfaces/enrollment.interface";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onViewEnrollment?: (enrollment: TData) => void;
    onViewStudent?: (enrollment: TData) => void;
    onViewCourse?: (enrollment: TData) => void;
  }
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export const columns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "user.fullName",
    header: "Student",
    cell: ({ row }) => row.original.user.fullName,
  },

  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => row.original.user.email,
  },

  {
    accessorKey: "course.title",
    header: "Course",
    cell: ({ row }) => row.original.course.title,
  },

  {
    accessorKey: "enrolledAt",
    header: "Enrolled At",
    cell: ({ row }) => formatDate(row.original.enrolledAt),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const enrollment = row.original;
      const meta = table.options.meta;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Actions for ${enrollment.user.fullName}`}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Enrollment</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => meta?.onViewEnrollment?.(enrollment)}
            >
              <Eye className="size-4" />
              View Enrollment
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => meta?.onViewStudent?.(enrollment)}
            >
              <User className="size-4" />
              View Student
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => meta?.onViewCourse?.(enrollment)}
            >
              <BookOpen className="size-4" />
              View Course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
];