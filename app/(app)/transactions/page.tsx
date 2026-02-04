import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function Home() {
  // Get session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Auth-based redirect
  if (!session) {
    redirect("/login");
  }

  redirect("/parties");
}
