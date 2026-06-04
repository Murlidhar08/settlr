"use client"

import { Button } from "@/components/ui/button"
import { useConfirm, usePrompt } from "@/components/providers"
import { toast } from "sonner"

export function DashboardInteractions() {
  const confirm = useConfirm()
  const prompt = usePrompt()

  const handleConfirm = async () => {
    const ok = await confirm({
      title: "Delete Account",
      description: "Are you sure you want to delete your account? This action cannot be undone.",
      confirmText: "Delete",
      destructive: true
    })

    if (ok) {
      toast.success("Account deleted successfully")
    }
  }

  const handlePrompt = async () => {
    const name = await prompt({
      title: "Update Name",
      description: "Please enter your new display name.",
      placeholder: "e.g. John Doe",
      confirmText: "Update"
    })

    if (name) {
      toast.success(`Name updated to: ${name}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-4 pt-4">
      <Button 
        onClick={handleConfirm}
        variant="outline"
        className="rounded-2xl h-12 px-6 font-bold"
      >
        Show Confirm
      </Button>

      <Button 
        onClick={handlePrompt}
        variant="default"
        className="rounded-2xl h-12 px-6 font-bold"
      >
        Show Input
      </Button>
    </div>
  )
}
