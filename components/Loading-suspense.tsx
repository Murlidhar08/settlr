import { Loader2Icon } from "lucide-react";
import { ReactNode, Suspense } from "react";

export function LoadingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  )
}
