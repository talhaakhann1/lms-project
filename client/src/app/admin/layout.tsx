import type { Metadata } from "next";
import "@/src/app/globals.css";
import { AppShell } from "../../components/app-shell";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import AuthInitializer from "../AuthInitializer";


export const metadata: Metadata = {
  title: "Analytics | Edvra",
  description:
    "Monitor courses, enrollments, revenue, and platform performance with Edvra analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthInitializer>
      <ProtectedRoute
        allowedRoles={["admin", "instructor"]}
        fallback="/dashboard"
        >
        <AppShell variant="admin">
          {children}
        </AppShell>
      </ProtectedRoute>
        </AuthInitializer>
    </div>
  );
}
