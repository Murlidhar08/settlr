"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "@/lib/auth-client"
import { getInitials } from "@/utility/party"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  title: string
  isProfile?: boolean
  leftAction?: React.ReactNode
}

const Header = ({ title, isProfile, leftAction }: HeaderProps) => {
  const router = useRouter()
  const { data: session } = useSession();
  const showProfile = isProfile ?? true

  const handleRedirect = () => {
    router.push("/profile")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 flex items-center justify-between bg-background/60 dark:bg-background/40 backdrop-blur-2xl px-6 py-5 border-b border-border/40"
    >
      <div className="flex items-center gap-4">
        {leftAction ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            {leftAction}
            <h1 className="text-xl font-black tracking-tight lg:text-3xl bg-linear-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">{title}</h1>
          </motion.div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center lg:hidden group overflow-hidden relative" onClick={() => router.push("/")}>
              <Image
                src="/images/logo/light_logo.svg"
                alt="Settlr"
                width={40}
                height={40}
                className="relative z-10 dark:hidden group-hover:rotate-12 transition-transform duration-500"
              />
              <Image
                src="/images/logo/dark_logo.svg"
                alt="Settlr"
                width={40}
                height={40}
                className="relative z-10 hidden dark:block group-hover:rotate-12 transition-transform duration-500"
              />
            </div>

            <motion.div
              layoutId="header-title"
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <h1 className="text-2xl font-black tracking-tighter lg:text-4xl bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
              </h1>
            </motion.div>
          </div>
        )}
      </div>

      {/* Profile Container */}
      {showProfile && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Avatar
            onClick={handleRedirect}
            className="h-11 w-11 ring-2 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl cursor-pointer transition-all hover:ring-primary/40"
          >
            <AvatarImage src={session?.user?.image || ''} className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-black uppercase tracking-widest leading-none bg-linear-to-br from-primary/10 to-transparent">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </motion.header>
  )
}

export { Header }
