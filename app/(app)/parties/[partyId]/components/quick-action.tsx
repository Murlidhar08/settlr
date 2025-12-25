"use client";

import { Button } from "@/components/ui/button"
import { Phone, Share2 } from "lucide-react"
import { useRouter } from "next/navigation";

interface QuickActionProp {
  partyId: string
}

const QuickActions = ({ partyId }: QuickActionProp) => {
  const router = useRouter()
  return (
    <section className="lg:px-0 lg:py-4">
      <div className="grid grid-cols-2 gap-2 lg:flex lg:gap-6">
        <Button onClick={() => { router.push(`/parties/${partyId}/statement`) }} variant="outline" className="h-12 px-12 mx-1 rounded-full gap-2 lg:h-14 hover:scale-[1.02] transition">
          <Share2 className="h-4 w-4" />
          Statement
        </Button>
        <Button variant="outline" className="h-12 px-12 mx-1 rounded-full gap-2 lg:h-14 hover:scale-[1.02] transition">
          <Phone className="h-4 w-4" />
          Call Party
        </Button>
      </div>
    </section>
  )
}

export { QuickActions }
