import StatsSection from "@/components/ui/StatsSection";
import { Wallet, Users, Repeat, DollarSign } from "lucide-react";

export default function IncomeSection() {
  const incomeStats = [
    {
      title: "Trade Income",
      value: "₹ 102,230",
      icon: <DollarSign size={18} />,
      trend: 5.1,
    },
    {
      title: "Sponsor Income",
      value: "₹ 39,330",
      icon: <Users size={18} />,
      trend: 2.4,
    },
    {
      title: "Matching Income",
      value: "₹ 1,289,410",
      icon: <Repeat size={18} />,
      trend: 9.7,
    },
    {
      title: "Total Income",
      value: "₹ 1,430,970",
      icon: <Wallet size={18} />,
      highlight: true,
    },
  ];

  return (
    <StatsSection
      title="Income"
      stats={incomeStats}
    />
  );
}