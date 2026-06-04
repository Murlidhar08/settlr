"use client";

import { useUserConfig } from "@/components/providers/user-config-provider";
import { formatAmount, formatUserCurrency } from "@/utility/currency-fn";
import { formatUserDateTime } from "@/utility/date-time-fn";

interface DashboardClientProps {
  firstName: string;
  email?: string | null;
}

export function DashboardClient({ firstName, email }: DashboardClientProps) {
  const { language } = useUserConfig();

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1>Hello, {firstName} ....</h1>

      <h1>Here is your language:- {language}</h1>

      <h1>Here is your email :- {email}</h1>

      <h1>Here is your date format :- {formatUserDateTime(new Date())}</h1>

      <h1>Here is your currency :- {formatUserCurrency(12439800)}</h1>

      <h1>Locale time :- {formatAmount(12439800)}</h1>
    </div>
  );
}
