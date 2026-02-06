"use client";

import { useSession } from "@/lib/auth-client";
import { LinkAccountModalBody } from "../components/link-account-modal-body";
import { getCredientialAccounts } from "@/actions/user-settings.actions";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import { Header } from "@/components/header";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export default function LinkAccountPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [currAccount, setCurrAccount] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCredientialAccounts().then((res) => {
            setCurrAccount(res as Account[]);
            setLoading(false);
        });
    }, []);

    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header
                    title="Linked Accounts"
                    leftAction={
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    }
                />
                <div className="mx-auto max-w-4xl p-6 mt-6 space-y-4">
                    <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
                    <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header
                title="Linked Accounts"
                leftAction={
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                }
            />
            <div className="mx-auto max-w-4xl p-6 mt-6">
                <LinkAccountModalBody currentAccounts={currAccount} />
            </div>
        </div>
    );
}
