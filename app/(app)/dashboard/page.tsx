import { AppHeader } from "@/components/app-header";
import { getUserSession } from "@/lib/auth/auth";
import { tran } from "@/lib/languages/i18n";

import { DashboardInteractions } from "@/components/dashboard/dashboard-interactions";
import { getUserConfig } from "@/lib/user-config";
import { formatAmount, formatUserCurrency } from "@/utility/currency-fn";
import { formatUserDateTime } from "@/utility/date-time-fn";

// Components
export default async function Page() {
  const session = await getUserSession();
  const { language } = await getUserConfig();
  const firstName = session?.user.name?.split(" ")[0] || "User";

  return (
    <>
      <AppHeader title={tran("dashboard.title")} />

      <div className="flex-1 px-4 space-y-6 sm:space-y-8 pb-34">
        <h1>Hello, {firstName} ....</h1>

        <h1>Here is your language:- {language}</h1>

        <h1>Here is your email :- {session?.user.email}</h1>

        <h1>Here is your date format :- {formatUserDateTime(new Date())}</h1>

        <h1>Here is your currency :- {formatUserCurrency(12439800)}</h1>

        <h1>Locale time :- {formatAmount(12439800)}</h1>

        <DashboardInteractions />
      </div>
    </>
  );
}
