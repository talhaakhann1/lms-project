"use client";

import type { UpdateProfileFormValues } from "../../../components/profile/page";
import SettingsProfile from "../../../components/profile/page"
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { updateUserDetail } from "@/src/store/authSlice";
import { showError, showSuccess } from "@/src/components/ui/toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { authService } from "@/src/services/auth.service";

export default function ProfilePage() {

  const user=useAppSelector((state)=>state.auth.user)
  const dispatch=useAppDispatch()
 const updateProfile = async (
     data: UpdateProfileFormValues
   ) => {
    
     try {
       console.log("formdata",data);
 
       const updatedUser = await authService.profileUpdate(data)
       console.log(updatedUser);
       
       dispatch(updateUserDetail(updatedUser))
       showSuccess("Successfully edit the profile")
 
     } catch (error) {
       const axiosError = error as AxiosError<ApiResponse<unknown>>;
 
       const errorMessage =
         axiosError.response?.data.message ?? "Something went wrong";
 
       console.error(errorMessage);
 
       showError("Something went wrong", errorMessage);
     } 
   };
  return (
    <SettingsProfile
    onSave={updateProfile}
    user={user}
    />
  );
}
