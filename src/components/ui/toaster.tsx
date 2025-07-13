"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isCenterAligned = props.variant === 'destructive';
        return (
          <Toast key={id} {...props}>
             <div className="grid gap-1">
              {title && <ToastTitle className={cn(isCenterAligned && "text-center text-lg")}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={cn(isCenterAligned && "text-center text-base")}>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
