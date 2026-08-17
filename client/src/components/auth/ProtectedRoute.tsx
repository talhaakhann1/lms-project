"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/store/hook";

type Role = "student" | "admin" | "instructor";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  fallback = "/dashboard",
}: ProtectedRouteProps) {
  const router = useRouter();

  const { user, isLoggedIn } = useAppSelector(
    (state) => state.auth
  );

  const isAuthorized =
    !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.replace("/sign-in");
      return;
    }

    if (!isAuthorized) {
      router.replace(fallback);
    }
  }, [isLoggedIn, user, isAuthorized, fallback, router]);

  if (!isLoggedIn || !user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}