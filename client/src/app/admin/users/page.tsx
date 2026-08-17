"use client"

import { UserStats } from "../../../components/admin/users/UserStats";
import { UsersTable } from "../../../components/admin/users/UserTable";
import { UserRoles } from "@/src/types/enums/user.enum";
import { useCallback, useEffect, useState } from "react";
import { authService } from "@/src/services/auth.service";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { User } from "@/src/types/interfaces/user.interface";

function getUserStats(users: User[]) {
  return {
    totalUsers: users.length,
    totalStudents: users.filter((user) => user.role === UserRoles.STUDENT).length,
    totalInstructors: users.filter((user) => user.role === UserRoles.INSTRUCTOR).length,
    totalAdmins: users.filter((user) => user.role === UserRoles.ADMIN).length,
  };
}


export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const stats = getUserStats(users);

  const changeUserRole = useCallback(
    async (userId: string, role: string) => {
      console.log(userId, role);

      try {
        const res = await authService.updateRole(userId, role);
        showSuccess("Successfully changed the user role")
        await fetchUsers()
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;

        const errorMessage =
          axiosError.response?.data.message ?? "Something went wrong";

        showError(errorMessage);
      }
  }, [])

  const fetchUsers =useCallback(
    async () => {
    setIsLoading(true)
    try {
      const res = await authService.getUsers();
      setUsers(res);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "aSomething went wrong";

      console.error(errorMessage);

      showError("Something went wrong", errorMessage);
    } finally {
      setIsLoading(false)
    }
  },[])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <main className="w-full max-w-5xl min-w-0 space-y-8 overflow-x-hidden px-2 pb-16 sm:px-3 lg:px-4">
      <div className="min-w-0 space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          Users
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base">
          Manage students, instructors, and administrators across your platform.
        </p>
      </div>

      <div className="min-w-0 w-full">
        <UserStats
          stats={stats}
          isLoading={isLoading}
        />
      </div>

      <div className="min-w-0 w-full overflow-x-auto">
        <UsersTable
          data={users}
          isLoading={isLoading}
          onRoleChange={(userId, role) => changeUserRole(userId, role)}
        />
      </div>
    </main>
  );
}