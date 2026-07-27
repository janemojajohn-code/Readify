import React from 'react'
import { useToast } from './use-toast'
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(function ({ id, title, description, variant }) {
        const isSuccess = variant === 'success'
        const isError = variant === 'destructive'

        return (
          <div
            key={id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5",
              isSuccess && "bg-card border-accent/40 text-foreground",
              isError && "bg-card border-destructive/40 text-foreground",
              !isSuccess && !isError && "bg-card border-border text-foreground"
            )}
          >
            {isSuccess && <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />}

            <div className="grid gap-1 flex-1">
              {title && <div className="text-sm font-semibold">{title}</div>}
              {description && (
                <div className="text-xs text-muted-foreground">{description}</div>
              )}
            </div>

            <button
              onClick={() => dismiss(id)}
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
