"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useDeviceSessions, useSetActiveSession } from "@/tanstacks/user";
import { getInitials } from "@/utility/commonFunction";
import { motion } from "framer-motion";
import { LogOut, Plus, User as UserIcon } from "lucide-react";
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
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative outline-none cursor-pointer"
                    >
                        <Avatar
                            className="h-11 w-11 ring-2 ring-primary/20 ring-offset-4 ring-offset-background shadow-2xl transition-all hover:ring-primary/40 outline-none"
                        >
                            <AvatarImage src={session?.user?.image || ''} className="object-cover" />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-black uppercase tracking-widest leading-none bg-linear-to-br from-primary/10 to-transparent">
                                {getInitials(session?.user?.name)}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>
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

                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Switch account
                    </DropdownMenuLabel>

                    {deviceSessions?.filter((s: any) => s.session.id !== session?.session?.id).map((activeSession: any) => (
                        <DropdownMenuItem
                            key={activeSession.session.id}
                            onClick={() => handleSwitchAccount(activeSession.session.token)}
                            className="cursor-pointer py-2"
                        >
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={activeSession.user.image || ''} />
                                <AvatarFallback className="text-[10px]">
                                    {getInitials(activeSession.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-medium truncate">{activeSession.user.name}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}

                    {(deviceSessions?.length || 1) < 3 && (
                        <DropdownMenuItem onClick={handleAddAccount} className="cursor-pointer py-2">
                            <Plus className="h-4 w-4 mr-2 bg-muted rounded-full p-0.5" />
                            <span>Add account</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleManageProfile} className="cursor-pointer py-2">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>Manage Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive py-2">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}