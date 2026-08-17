"use client";

import * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      expand={false}
      richColors={false}
      closeButton
      gap={8}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: [
            "group flex items-start gap-3",
            "w-full rounded-xl border border-border",
            "bg-card text-card-foreground",
            "shadow-md px-4 py-3.5",
            "text-sm font-medium",
            "data-[type=success]:border-primary/20 data-[type=success]:bg-primary/5",
            "data-[type=error]:border-destructive/20 data-[type=error]:bg-destructive/5",
          ].join(" "),
          title: "font-semibold text-foreground leading-snug",
          description: "text-muted-foreground text-xs font-normal mt-0.5 leading-relaxed",
          closeButton: [
            "!bg-transparent !border-0 !text-muted-foreground",
            "hover:!text-foreground transition-colors duration-150",
            "!top-3 !right-3",
          ].join(" "),
          actionButton: "!bg-primary !text-primary-foreground !rounded-lg !text-xs",
          cancelButton: "!bg-muted !text-muted-foreground !rounded-lg !text-xs",
          loader: "!text-primary",
        },
        style: {},
      }}
      style={
        {
          "--width": "360px",
          "--border-radius": "0.75rem",
        } as React.CSSProperties
      }
    />
  );
}

// ─── Icon wrappers ────────────────────────────────────────────────────────────

function SuccessIcon() {
  return <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} />;
}

function ErrorIcon() {
  return <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />;
}

function WarningIcon() {
  return <AlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-500" strokeWidth={1.75} />;
}

function InfoIcon() {
  return <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />;
}

function LoadingIcon() {
  return <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground" strokeWidth={1.75} />;
}

// ─── Toast content renderer ────────────────────────────────────────────────────

interface ToastContentProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

function ToastContent({ icon, title, description }: ToastContentProps) {
  return (
    <>
      <div className="flex items-start gap-3">
        {icon}

        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-semibold text-sm leading-snug text-foreground">
            {title}
          </span>

          {description && (
            <span className="text-xs leading-relaxed text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Helper functions ─────────────────────────────────────────────────────────

export function showSuccess(title: string, description?: string): string | number {
  return toast.custom(() => (
    <ToastContent icon={<SuccessIcon />} title={title} description={description} />
  ), { duration: 4000 });
}

export function showError(title: string, description?: string): string | number {
  return toast.custom(() => (
    <ToastContent icon={<ErrorIcon />} title={title} description={description} />
  ), { duration: 5000 });
}

export function showWarning(title: string, description?: string): string | number {
  return toast.custom(() => (
    <ToastContent icon={<WarningIcon />} title={title} description={description} />
  ), { duration: 5000 });
}

export function showInfo(title: string, description?: string): string | number {
  return toast.custom(() => (
    <ToastContent icon={<InfoIcon />} title={title} description={description} />
  ), { duration: 4000 });
}

export function showLoading(title: string): string | number {
  return toast.custom(() => (
    <ToastContent icon={<LoadingIcon />} title={title} />
  ), { duration: Infinity });
}

export interface PromiseMessages<T> {
  loading: string;
  success: (data: T) => string;
  error: (err: unknown) => string;
}

export function showPromise<T>(
  promise: Promise<T>,
  messages: PromiseMessages<T>
): Promise<T> {
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });

  return promise;
}

export { toast };