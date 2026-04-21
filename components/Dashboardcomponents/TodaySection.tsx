import StatsSection from "@/components/ui/StatsSection";
import { Calendar, DollarSign } from "lucide-react";

export default function TodaySection() {
  const todayStats = [
    {
      title: "Today Trade Income",
      value: "₹ 0.00",
      icon: <DollarSign size={18} />,
    },
    {
      title: "Today Sponsor Income",
      value: "₹ 0.00",
      icon: <DollarSign size={18} />,
    },
    {
      title: "Today Matching Income",
      value: "₹ 6,450",
      icon: <DollarSign size={18} />,
      trend: 3.2,
    },
    {
      title: "Today Total Income",
      value: "₹ 6,450",
      icon: <Calendar size={18} />,
      highlight: true,
    },
  ];

  return (
    <StatsSection
      title="Today"
      stats={todayStats}
    />
  );
}