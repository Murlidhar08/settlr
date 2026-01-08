"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string | undefined,
  backUrl: string
  description?: string | undefined
  isProfile?: boolean
}

const BackHeader = ({ title, description, backUrl = "", isProfile = false }: HeaderProps) => {
  const router = useRouter();
  isProfile = isProfile ?? true;

  const handleBack = () => {
    if (!backUrl)
      router.back();

    router.push(backUrl as any)
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-secondary/90 backdrop-blur px-4 py-3 border-b lg:border-none">

      <Button onClick={handleBack} size="icon" variant="ghost" className="hover:scale-110 transition-transform">
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 flex-col items-center">
        <h2 className="text-lg font-bold tracking-tight lg:text-2xl">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <Badge
            variant="secondary"
            className="mt-0.5 text-[10px] uppercase tracking-wider lg:text-xs"
          >
            {description}
          </Badge>
        )}
      </div>

      {/* Profile */}
      {
        isProfile && (
          <Avatar size="lg">
            {/* DYNCAMIC AVATAR PENDING */}
            {/* <AvatarImage src="https://i.pravatar.cc/300" /> */}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )
      }
    </header >
  )
}

export { BackHeader }
