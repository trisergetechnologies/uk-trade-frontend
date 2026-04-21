import TopStats from "./TopStats";
import PieChartCard from "./PieChartCard";
import IncomeSection from "./IncomeSection";
import TodaySection from "./TodaySection";
import PageHeader from "../ui/PageHeader";


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      <PageHeader title="User Dashboard" />
      <TopStats />
      <IncomeSection />
      <TodaySection />
      <PieChartCard/>
     
    </div>
  );
}