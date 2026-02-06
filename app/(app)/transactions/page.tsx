import { redirect } from "next/navigation";
import { getSession } from "better-auth/api";

export default async function Home() {
  const session = await getSession()

  if (!session) {
    redirect("/login");
  }

  redirect("/parties");
}
