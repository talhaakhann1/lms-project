"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { showSuccess, showError, showPromise } from "../../../components/ui/toaster";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../../components/ui/field";
import { Input } from "../../../components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/src/Schemas/user.schema";
import * as z from "zod"
import { useAppDispatch } from "@/src/store/hook";
import { useRouter } from "next/navigation";
import { api } from "@/src/libs/axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { User } from "next-auth";
import { AxiosError } from "axios";
import { authService } from "@/src/services/auth.service";

const GoogleIcon = (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GithubIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
    <path d="M12 1C5.92 1 1 5.92 1 12c0 4.87 3.15 8.99 7.52 10.45.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.04-3.06.66-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.61-1.22-1.61-1-.68.07-.67.07-.67 1.1.08 1.69 1.13 1.69 1.13.98 1.69 2.58 1.2 3.21.92.1-.71.39-1.2.7-1.48-2.45-.28-5.02-1.22-5.02-5.45 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.24-2.58 5.16-5.04 5.44.4.34.75 1.02.75 2.06 0 1.49-.01 2.69-.01 3.05 0 .29.2.64.76.53C19.85 20.99 23 16.87 23 12c0-6.08-4.92-11-11-11z" />
  </svg>
);



const socialProviders = [
  {
    label: "Continue with Google",
    icon: GoogleIcon,
    href: "#",
  },
  {
    label: "Continue with Github",
    icon: GithubIcon,
    href: "#",
  },
];

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fieldId = useId();



  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false
    }
  })



  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      await authService.register(data);

      showSuccess(
        "Account created successfully", " Please sign in to continue."
      );

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>;

      const errorMessage =
        axiosError.response?.data.message ?? "Something went wrong";

      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="flex min-h-screen w-full items-center justify-center px-4 py-16 md:py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Start building for free. No credit card required.
          </p>
        </div>

        <div className="rounded-md border bg-card p-6 md:p-8">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  size="lg"
                  render={<Link href="#" />}
                  nativeButton={false}
                >
                  {GoogleIcon}
                  Google
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  render={<Link href="#" />}
                  nativeButton={false}
                >
                  {GithubIcon}
                  GitHub
                </Button>
              </Field>

              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${fieldId}-name`}>
                      Full name
                    </FieldLabel>

                    <Input
                      {...field}
                      id={`${fieldId}-name`}
                      type="text"
                      placeholder="Jane Cooper"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                      autoComplete="name"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${fieldId}-email`}>
                      Email
                    </FieldLabel>

                    <Input
                      {...field}
                      id={`${fieldId}-email`}
                      type="email"
                      placeholder="you@example.com"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${fieldId}-password`}>
                      Password
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        {...field}
                        id={`${fieldId}-password`}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="h-11 pr-11"
                        aria-invalid={fieldState.invalid}
                        autoComplete="new-password"
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="terms"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div
                    className="w-full min-w-0"
                    data-invalid={fieldState.invalid}
                  >
                    <div className="flex w-full min-w-0 items-start gap-2">
                      <Checkbox
                        id={`${fieldId}-terms`}
                        className="mt-1 shrink-0"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />

                      <label
                        htmlFor={`${fieldId}-terms`}
                        className="min-w-0 flex-1 text-sm font-normal leading-relaxed text-muted-foreground"
                      >
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="font-medium text-foreground underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="font-medium text-foreground underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {fieldState.invalid && (
                      <div className="mt-1 ml-6">
                        <FieldError errors={[fieldState.error]} />
                      </div>
                    )}
                  </div>
                )}
              />

              <Field>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <FieldDescription className="!mt-6 text-center">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-foreground">
              Sign in
            </Link>
          </FieldDescription>
        </div>
      </div>
    </section>
  );
}