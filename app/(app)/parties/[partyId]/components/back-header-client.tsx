"use client"

import { Pencil, Trash2 } from "lucide-react"
import { BackHeader } from "@/components/back-header"

export default function BackHeaderClient({ partyId, title, description }: any) {
  return (
    <BackHeader
      title={title}
      description={description}
      backUrl='/parties'
      menuItems={[
        {
          icon: <Pencil />,
          label: "Edit",
          onClick: () => {
            console.log("Edit Party:", partyId)
          },
          destructive: false
        },
        {
          icon: <Trash2 />,
          label: "Delete",
          onClick: () => {
            console.log("Delete Party:", partyId)
          },
          destructive: true
        }
      ]}
    />
  )
}
