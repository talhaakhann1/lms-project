"use client";

import type { ComponentProps } from "react";
import SettingsProfile, { UpdateProfileFormValues } from "../../../../components/profile/page"
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { updateUserDetail } from "@/src/store/authSlice";
import { authService } from "@/src/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";

export default function SettingsProfileDemo() {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const updateProfile = async (
    data: UpdateProfileFormValues
  ) => {

    try {
      console.log("formdata", data);

      const updatedUser = await authService.profileUpdate(data)
      console.log(updatedUser);

      dispatch(updateUserDetail(updatedUser))

      showSuccess(
        "Profile updated",
        "Your profile has been updated successfully."
      );

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      showError(errorMessage);
    }
  };
  return (
    <SettingsProfile
      onSave={updateProfile}
      user={user}
    />
  );
}
