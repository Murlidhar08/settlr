"use client"

// Package
import { ArrowLeft, EllipsisVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import type { Route } from "next"
import { motion, AnimatePresence } from "framer-motion"

// Components
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { cn } from "@/lib/utils"

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
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 flex items-center justify-between bg-background/80 dark:bg-background/60 backdrop-blur-xl px-6 py-4 border-b border-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
    >
      {/* Back Button */}
      <motion.div
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={handleBack}
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/50 shadow-sm transition-all text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Title & Description Container */}
      <div className="flex flex-1 flex-col items-center gap-1 mx-4 min-w-0">
        <motion.h2
          layoutId="back-header-title"
          className="text-lg lg:text-2xl font-black tracking-tight truncate w-full text-center bg-linear-to-br from-foreground to-primary/80 bg-clip-text text-transparent"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Badge
              variant="secondary"
              className="h-5 rounded-full px-3 text-[9px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary border-primary/20"
            >
              {description}
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Menu / Actions */}
      <div className="flex items-center">
        {menuItems.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-11 w-11 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/50 shadow-sm transition-all text-foreground"
                >
                  <EllipsisVertical className="h-5 w-5" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 mt-2 shadow-2xl border-border/50">
              {menuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-bold transition-all focus:scale-[0.98] active:scale-95 cursor-pointer",
                    item.destructive && "text-rose-600 focus:text-rose-600"
                  )}
                >
                  {item.icon && <span className="mr-2 opacity-80 group-focus/dropdown-menu-item:opacity-100 transition-opacity">{item.icon}</span>}
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="w-11" /> // Spacing matching the back button
        )}
      </div>
    </motion.header>
  )
}

export { BackHeader }
