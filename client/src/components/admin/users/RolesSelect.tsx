"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";

import { UserRoles } from "@/src/types/enums/user.enum";

const roleLabels: Record<UserRoles, string> = {
  [UserRoles.STUDENT]: "Student",
  [UserRoles.INSTRUCTOR]: "Instructor",
  [UserRoles.ADMIN]: "Admin",
};

const roleOptions = Object.values(UserRoles);

export interface RoleSelectProps {
  value: UserRoles;
  onValueChange: (value: UserRoles) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}

export function RoleSelect({
  value,
  onValueChange,
  disabled = false,
  loading = false,
  label = "Change role",
}: RoleSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [pendingRole, setPendingRole] = React.useState<UserRoles | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const isDisabled = disabled || loading || isUpdating;

  const handleRoleChange = (nextRole: UserRoles) => {
    if (nextRole === value) return;

    setPendingRole(nextRole);
    setOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingRole) return;

    try {
      setIsUpdating(true);

      await onValueChange(pendingRole);

      setOpen(false);
      setPendingRole(null);
    } catch (error) {
      // Keep the dialog open if the API request fails.
      console.error("Failed to update user role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (isUpdating) return;

    setOpen(false);
    setPendingRole(null);
  };

  return (
    <>
      <Select
        value={value}
        onValueChange={(next) =>
          handleRoleChange(next as UserRoles)
        }
        disabled={isDisabled}
      >
        <SelectTrigger
          aria-label={label}
          className="h-8 w-[140px] gap-1.5 text-sm data-[disabled]:opacity-60"
        >
          {loading || isUpdating ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2
                className="size-3.5 animate-spin"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>Updating...</span>
            </span>
          ) : (
            <SelectValue placeholder="Select role">
              {roleLabels[value]}
            </SelectValue>
          )}
        </SelectTrigger>

        <SelectContent align="end">
          {roleOptions.map((role) => (
            <SelectItem key={role} value={role}>
              {roleLabels[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Change user role?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to change this user&apos;s role from{" "}
              <strong>{roleLabels[value]}</strong> to{" "}
              <strong>
                {pendingRole ? roleLabels[pendingRole] : ""}
              </strong>
              ? This may change the user&apos;s permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isUpdating}
            >
              {isUpdating && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {isUpdating ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}