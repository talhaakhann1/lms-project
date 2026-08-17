import { studentNavGroups } from "../components/app-shared";
import { AppHeader } from "../components/app-header";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { FullWidthDivider } from "./ui/full-width-divider";

interface AppShellProps {
  children: React.ReactNode;
  variant: "admin" | "student";
}

export function AppShell({
  children,
  variant,
}: AppShellProps) {
  return (
   <div className="flex h-svh overflow-hidden">
  <SidebarProvider className="relative mx-auto h-full w-full lg:border-x">
    <FullWidthDivider className="top-14 z-60 -translate-y-px" />

    <AppSidebar variant={variant} />

    <SidebarInset className="min-h-0 min-w-0">
      <AppHeader variant={variant} />

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
        {children}
      </div>
    </SidebarInset>
  </SidebarProvider>
</div>
  );
}