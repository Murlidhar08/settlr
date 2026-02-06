"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

/* ========================================================= */
/* TYPES */
/* ========================================================= */

type ConfirmOptions = {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

type ConfirmContextType = {
  confirm: (options?: ConfirmOptions) => Promise<boolean>
}

/* ========================================================= */
/* CONTEXT */
/* ========================================================= */

const ConfirmContext = createContext<ConfirmContextType | null>(null)

/* ========================================================= */
/* PROVIDER */
/* ========================================================= */

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolver, setResolver] =
    useState<((value: boolean) => void) | null>(null)

  const confirm = (opts: ConfirmOptions = {}) => {
    setOptions(opts)
    setOpen(true)

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
    })
  }

  const handleCancel = () => {
    setOpen(false)
    resolver?.(false)
  }

  const handleConfirm = () => {
    setOpen(false)
    resolver?.(true)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {options.title ?? "Are you sure?"}
            </AlertDialogTitle>

            {options.description && (
              <AlertDialogDescription>
                {options.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-row justify-end gap-3">
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText ?? "Cancel"}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              className={cn(
                options.destructive &&
                "bg-destructive text-white hover:bg-destructive/90"
              )}
            >
              {options.confirmText ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>



        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider >
  )
}

/* ========================================================= */
/* HOOK */
/* ========================================================= */

export function useConfirm() {
  const ctx = useContext(ConfirmContext)

  if (!ctx) {
    throw new Error("useConfirm must be used inside ConfirmProvider")
  }

  return ctx.confirm
}
