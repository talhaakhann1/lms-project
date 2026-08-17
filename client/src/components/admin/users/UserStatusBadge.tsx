import { CheckCircle2, CircleOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "../../../components/ui/badge";
import { cn } from "@/src/lib/utils";
import { UserStatus } from "@/src/types/enums/user.enum";

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
}

const statusConfig: Record<UserStatus, StatusConfig> = {
  [UserStatus.ACTIVE]: {
    label: "Active",
    icon: CheckCircle2,
    className: "border-primary/20 bg-primary/10 text-primary",
  },

  [UserStatus.INACTIVE]: {
    label: "Inactive",
    icon: CircleOff,
    className:
      "border-muted-foreground/20 bg-muted text-muted-foreground",
  },
};

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function UserStatusBadge({
  status,
  className,
}: UserStatusBadgeProps) {
  const config = statusConfig[status];

  // Protect against unexpected API values
  if (!config) {
    return (
      <Badge variant="outline" className={cn("font-medium", className)}>
        Unknown
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium",
        config.className,
        className
      )}
    >
      <Icon
        className="size-3"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      {config.label}
    </Badge>
  );
}