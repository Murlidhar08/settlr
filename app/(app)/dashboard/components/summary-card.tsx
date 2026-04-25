import { getUserConfig } from "@/lib/user-config"
import { SummaryStatsClient } from "./summary-stats-client"

export default async function SummaryCard() {
  const { currency, language } = await getUserConfig();

  return (
    <SummaryStatsClient currency={currency} language={language} />
  )
}
