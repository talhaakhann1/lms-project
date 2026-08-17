"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { RoleSelect } from "../../../components/admin/users/RolesSelect";
import {
  UserStatusBadge
} from "../../../components/admin/users/UserStatusBadge";
import { UserRoles, UserStatus } from "@/src/types/enums/user.enum";

export interface User {
  id: string;
  fullName: string;
  email: string;
  title: string;
  bio: string;
  password: string;
  isVerified: boolean;
  avatar: {
    url: string;
    publicId: string;
  };
  role: UserRoles;
  status: UserStatus;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    onRoleChange?: (
      userId: string,
      role: UserRoles
    ) => void | Promise<void>;
    onViewProfile?: (user: TData) => void;
    onEditUser?: (user: TData) => void;
    onResetPassword?: (user: TData) => void;
    onSuspendUser?: (user: TData) => void;
    onActivateUser?: (user: TData) => void;
    onDeleteUser?: (user: TData) => void;
    updatingRoleUserId?: string | null;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SortableHeader({
  label,
  column,
}: {
  label: string;
  column: {
    toggleSorting: (desc?: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
}) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="-ml-3 h-8 gap-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="size-3.5" />
    </Button>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected())
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.fullName}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar className="size-9">
          {user.avatar?.url ? (
            <AvatarImage
              src={user?.avatar?.url}
              alt={`${user.fullName} avatar`}
            />
          ) : null}

          <AvatarFallback>
            {getInitials(user.fullName)}
          </AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <SortableHeader label="Name" column={column} />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.fullName}
      </span>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta;

      return (
        <RoleSelect
          value={user.role}
          onValueChange={async (role) => {
            await meta?.onRoleChange?.(user.id, role);
          }}
          loading={meta?.updatingRoleUserId === user.id}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <UserStatusBadge status={row.original.status} />
    ),
  },

  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.isVerified ? "Verified" : "Not verified"}
      </span>
    ),
  },
];