import { getUserSession } from "@/lib/auth/auth";
import { isSetupRequired } from "@/lib/setup";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
    // Check if setup is needed
    if (await isSetupRequired()) {
        redirect("/setup" as any);
    }

    // Get session on the server
    const session = await getUserSession();

    if (session.user.banned) {
        redirect("/banned" as any);
    }

    redirect("/dashboard" as any);
}
