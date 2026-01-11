import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet } from "lucide-react";

interface HeaderProps {
  title: string,
  isProfile?: boolean
}

const Header = ({ title, isProfile }: HeaderProps) => {
  isProfile = isProfile ?? true;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-slate-200/80 dark:bg-slate-950/90 backdrop-blur px-6 py-4 mb-4">
      <div className="flex">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C3E50] text-white transition-transform hover:scale-105">
            <Wallet className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        <div className="lg:flex items-center gap-3 hidden">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
      </div>

      {/* Profile */}
      {isProfile && (
        <Avatar size="lg">
          {/* DYNCAMIC AVATAR PENDING */}
          {/* <AvatarImage src="https://i.pravatar.cc/300" /> */}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
    </header>
  )
}

export { Header }
