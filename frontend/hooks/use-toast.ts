"use client"

import type React from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive" | "success"
} & ExternalToast

// Define toast function directly to avoid using a hook at the top level
export const toast = ({ title, description, variant, ...props }: ToastProps) => {
  if (variant === "destructive") {
    return sonnerToast.error(title, { description, ...props })
  } else if (variant === "success") {
    return sonnerToast.success(title, { description, ...props })
  } else {
    return sonnerToast(title, { description, ...props })
  }
}

export const useToast = () => {
  return {
    toast,
    dismiss: (toastId?: string | number) => sonnerToast.dismiss(toastId),
  }
}
