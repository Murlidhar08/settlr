import { AppHeader } from "@/components/app-header";
import { getUserSession } from "@/lib/auth/auth";

import { DashboardClient } from "./components/dashboard-client";
import { DashboardInteractions } from "./components/dashboard-interactions";

// Components
export default async function Page() {
  const session = await getUserSession();
  const firstName = session?.user.name?.split(" ")[0] || "User";

  return (
    <>
      <AppHeader title="dashboard.title" />

      <div className="flex-1 px-4 space-y-6 sm:space-y-8 pb-34">
        <DashboardClient firstName={firstName} email={session?.user.email} />

        <DashboardInteractions />
      </div>
    </>
  );
}
