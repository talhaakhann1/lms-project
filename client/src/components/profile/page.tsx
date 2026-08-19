"use client";

import { Camera, Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "../../components/ui/input-group";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";

import {
  updateUserProfileSchema,

} from "@/src/Schemas/user.schema";

import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { showError, showSuccess } from "../ui/toaster";;
import { User } from "@/src/types/interfaces/user.interface";


export interface SettingsProfileProps {
  user?: User|null;
  onSave?: (
    data: z.infer<typeof updateUserProfileSchema>
  ) => Promise<void>;
  onEmailChange?: (
    newEmail: string,
    currentPassword: string
  ) => Promise<void>;
  onAvatarUpload?: (file: File) => Promise<string>;
  onAvatarRemove?: () => Promise<void>;
  className?: string;
  showEmailVerification?: boolean;
}

export type UpdateProfileFormValues = z.infer<
  typeof updateUserProfileSchema
>;

export default function SettingsProfile({
  user,
  onSave,
  onEmailChange,
  onAvatarUpload,
  onAvatarRemove,
  className,
  showEmailVerification = true,
}: SettingsProfileProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<File | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      avatar: null,
      fullName: user?.fullName ?? "",
      title: user?.title ?? "",
      bio: user?.bio ?? "",
    },
  });

  const {
    control,
    setValue,
    setError,
    clearErrors,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    reset({
      avatar: null,
      fullName: user?.fullName ?? "",
      title: user?.title ?? "",
      bio: user?.bio ?? "",
    });

    avatarFileRef.current = null;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setAvatarPreview(user?.avatar?.url ?? null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [user, reset]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleAvatarSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("avatar", {
          type: "manual",
          message: "Please select an image file",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("avatar", {
          type: "manual",
          message: "Image size must be less than 5MB",
        });
        return;
      }

      clearErrors("avatar");

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const previewUrl = URL.createObjectURL(file);

      objectUrlRef.current = previewUrl;
      avatarFileRef.current = file;

      setValue("avatar", file, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setAvatarPreview(previewUrl);
    },
    [setValue, setError, clearErrors]
  );

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarRemove = useCallback(() => {
    setValue("avatar", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    avatarFileRef.current = null;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setAvatarPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    clearErrors("avatar");
  }, [setValue, clearErrors]);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];

      if (file) {
        handleAvatarSelect(file);
      }
    },
    [handleAvatarSelect]
  );

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;


    handleAvatarSelect(file);
  };

  const handleSave = async (
    data: UpdateProfileFormValues
  ) => {
    setIsSaving(true);

    try {
      await onSave?.(data);

  
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data?.message ??
        "Something went wrong";

      showError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn("w-full shadow-xs", className)}>
      <form onSubmit={handleSubmit(handleSave)}>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <CardTitle className="wrap-break-word">Profile Settings</CardTitle>
              <CardDescription className="wrap-break-word">
                Manage your profile information and avatar
              </CardDescription>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                className="w-full sm:w-auto"
                disabled={isSubmitting || isSaving}
                type="submit"

              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span className="whitespace-nowrap">Saving…</span>
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    <span className="whitespace-nowrap">Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">

            <div className="flex flex-col gap-4">
              <FieldLabel>Profile Picture</FieldLabel>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className={cn(
                    "relative flex size-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors",
                    isUploadingAvatar
                      ? "border-primary bg-primary/5"
                      : "border-muted bg-muted/30 hover:border-primary/50"
                  )}
                  onClick={handleAvatarClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {avatarPreview ? (
                    <>
                      <Image
                        alt="Profile avatar"
                        className="object-cover"
                        fill
                        sizes="96px"
                        src={avatarPreview}
                        unoptimized
                      />
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                          <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                      )}
                    </>
                  ) : (
                    <Camera className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={handleAvatarClick}
                      type="button"
                      variant="outline"
                    >
                      <Camera className="size-4" />
                      {avatarPreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    {avatarPreview && (
                      <Button
                        onClick={handleAvatarRemove}
                        type="button"
                        variant="outline"
                      >
                        <X className="size-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Drag and drop an image here, or click to browse. Max size: 5MB
                  </p>
                  {errors.avatar && (
                    <p className="text-destructive text-xs">{errors.avatar.message}</p>
                  )}
                </div>
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                  ref={fileInputRef}
                  type="file"
                />
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="name">
                      Name <span className="text-destructive">*</span>
                    </FieldLabel>

                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          id="name"
                          placeholder="Your full name"
                          {...field}
                        />
                      </InputGroup>

                      {errors.fullName && (
                        <FieldError>{errors.fullName.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      id="role"
                      value={user?.role ?? ""}
                      readOnly
                    />
                  </InputGroup>
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      value={user?.email ?? ""}
                      readOnly
                    />
                  </InputGroup>
                </FieldContent>
              </Field>

              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>

                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          id="title"
                          placeholder="e.g. Full Stack Developer"
                          {...field}
                        />
                      </InputGroup>

                      {errors.title && (
                        <FieldError>{errors.title.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="bio"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>

                    <FieldContent>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        rows={4}
                        {...field}
                        value={field.value ?? ""}
                      />

                      <FieldDescription>
                        A brief description about yourself (max 500 characters)
                      </FieldDescription>

                      {errors.bio && (
                        <FieldError>{errors.bio.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
