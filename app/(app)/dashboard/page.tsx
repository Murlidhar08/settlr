import { AppHeader } from "@/components/app-header";
import MobileNav from "@/components/navbar/mobile-nav";
import { getUserSession } from "@/lib/auth/auth";
import { t } from "@/lib/languages/i18n";
import { getUserConfig } from "@/lib/user-config";

// Components

export default async function Page() {
  const session = await getUserSession();
  const { language, currency } = await getUserConfig();
  const firstName = session?.user.name?.split(" ")[0] || "User";

  return (
    <>
      <AppHeader title={t("dashboard.title", language)} />

      <div className="flex-1 px-4 space-y-6 sm:space-y-8 pb-34">
        Hello, {firstName}.

        <h1>Here is your language</h1>
        <p>{language}</p>

        <h1>Here is your currency</h1>
        <p>{currency}</p>

        <h1>Here is your email</h1>
        <p>{session?.user.email}</p>

      </div>

      <MobileNav />
    </>
  );
}
