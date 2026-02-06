"use client"

// Package
import { ArrowLeft, EllipsisVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import type { Route } from "next"

// Components
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface HeaderMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  destructive?: boolean
}

interface HeaderProps {
  title?: string
  backUrl?: Route
  description?: string
  menuItems?: HeaderMenuItem[]
}

const BackHeader = ({
  title,
  description,
  backUrl,
  menuItems = [],
}: HeaderProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (!backUrl) {
      router.back()
    } else {
      router.push(backUrl)
      return;
    }
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-secondary/90 backdrop-blur px-4 py-3 border-b lg:border-none">
      {/* Back */}
      <Button
        onClick={handleBack}
        size="icon"
        variant="ghost"
        className="hover:scale-110 transition-transform cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Title */}
      <div className="flex flex-1 flex-col items-center">
        <h2 className="text-lg font-bold tracking-tight lg:text-2xl">
          {title}
        </h2>

        {description && (
          <Badge
            variant="secondary"
            className="mt-0.5 text-[10px] uppercase tracking-wider lg:text-xs"
          >
            {description}
          </Badge>
        )}
      </div>

      {/* Menu */}
      {menuItems.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size="icon" variant="ghost">
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            {menuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className={
                  item.destructive
                    ? "text-destructive focus:text-destructive"
                    : ""
                }
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

      ) : (
        <div className="w-10" /> // spacing placeholder
      )}
    </header>
  )
}

export { BackHeader }
