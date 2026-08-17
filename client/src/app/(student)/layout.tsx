import type { Metadata } from "next";
import "@/src/app/globals.css"
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "@/src/app/globals.css"
import { AppShell } from "../../components/app-shell";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: "My Learning | Edvra",
  description:
    "Continue your courses, track your progress, and keep learning with Edvra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-full flex flex-col">
        <ProtectedRoute
          allowedRoles={["student"]}
          fallback="/admin"
        >
        
          <AppShell variant="student">
            {children}
          </AppShell>
     
        </ProtectedRoute>
      </div>
  );
}
