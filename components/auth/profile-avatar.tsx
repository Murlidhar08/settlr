"use client";

import { authClient } from "@/lib/auth/auth-client";
import { tran } from "@/lib/languages/i18n";
import { useDeviceSessions, useSetActiveSession } from "@/tanstacks/user";
import { getInitials } from "@/utility/common-function";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function ProfileAvatar() {
    const { data: session } = authClient.useSession();
    const { data: deviceSessions } = useDeviceSessions();
    const { mutate: setActive } = useSetActiveSession();
    const router = useRouter();

    const handleSwitchAccount = (sessionToken: string) => {
        setActive(sessionToken, {
            onSuccess: () => {
                window.location.reload();
            }
        });
    }

    const handleAddAccount = () => {
        router.push("/login");
    }

    const handleManageProfile = () => {
        router.push("/settings/profile");
    }

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-lg cursor-pointer transition-all hover:ring-primary/50">
                        <AvatarImage src={session?.user?.image || ''} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px] sm:text-xs font-bold font-mono">
                            {getInitials(session?.user?.name)}
                        </AvatarFallback>
                    </Avatar>
                }
            />

            <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {session?.user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleManageProfile} className="cursor-pointer py-2">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>{tran("profile.manage_profile")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive py-2">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>{tran("profile.logout")}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}