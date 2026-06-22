import type { Metadata } from "next";
import {
  DashboardHeader,
  TransactionAnalytics,
} from "@/components/dashboard";
import { siteConfig } from "@/data";

export const metadata: Metadata = {
  title: `Dashboard | ${siteConfig.name}`,
  description:
    "This dashboard will display onchain analytics for Base-related wallets.",
};

export default function DashboardPage() {
  return (
    <section
      aria-labelledby="dashboard-heading"
      className="pb-16 pt-8 sm:pb-20 sm:pt-12"
    >
      <div className="mx-auto w-full max-w-5xl space-y-8 sm:space-y-10">
        <DashboardHeader
          title="Base Wallet Analytics Dashboard"
          description="This dashboard will display onchain analytics for Base-related wallets."
        />
        <TransactionAnalytics />
      </div>
    </section>
  );
}
