"use client";

import { Button } from "@/components/ui/button"
import { Phone, Share2 } from "lucide-react"
import { useRouter } from "next/navigation";

interface QuickActionProp {
  partyId: string
  contact?: string | null
}

const QuickActions = ({ partyId, contact }: QuickActionProp) => {
  const router = useRouter();

  const handlerStatement = () => {
    router.push(`/parties/${partyId}/statement`)
  }

  return (
    <section className="lg:px-0 lg:py-4">
      <div className="grid grid-cols-2 gap-2 lg:flex lg:gap-6">
        <Button
          onClick={handlerStatement}
          variant="outline"
          className="h-12 px-12 mx-1 rounded-full gap-2 lg:h-14 hover:scale-[1.02] transition cursor-pointer"
        >
          <Share2 className="h-4 w-4" />
          Statement
        </Button>

        {!!contact && (
          <Button variant="outline" className="h-12 px-12 mx-1 rounded-full gap-2 lg:h-14 hover:scale-[1.02] transition cursor-pointer">
            <Phone className="h-4 w-4" />
            Call Party
          </Button>
        )}
      </div>
    </section>
  )
}

export { QuickActions }
