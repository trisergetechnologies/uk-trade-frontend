import StatCard from "@/components/ui/StatCard";

export default function TopStats() {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <StatCard title="Total Income" value="₹ 1430970.40" highlight />
      <StatCard title="Balance" value="₹ 2700.00" highlight />
      <StatCard title="Withdrawal" value="₹ 1426410.40" />
      <StatCard title="Investments" value="₹ 0" />
    </div>
  );
}