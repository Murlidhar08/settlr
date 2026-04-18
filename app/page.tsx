import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    // Get session on the server
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Auth-based redirect
    if (!session) {
        redirect("/login");
    }

    if (session.user.banned) {
        redirect("/banned");
    }

    redirect("/dashboard");
}
