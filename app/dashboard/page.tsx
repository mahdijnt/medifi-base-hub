import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard";
import { siteConfig } from "@/data";

export const metadata: Metadata = {
  title: `Dashboard | ${siteConfig.name}`,
  description:
    "Analyze onchain activity across Base ecosystem wallets — transactions, NFTs, and contract interactions.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
