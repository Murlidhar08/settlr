// Lib
import { auth } from "@/lib/auth/auth";
import { isSetupRequired } from "@/lib/setup";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    // Check if setup is needed
    if (await isSetupRequired()) {
        redirect("/setup" as any);
    }

    // Get session on the server
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Auth-based redirect
    if (!session) {
        redirect("/login" as any);
    }

    if (session.user.banned) {
        redirect("/banned" as any);
    }

    redirect("/dashboard" as any);
}
