import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import MyActivePackages from "@/components/package/MyActivePackages";

export default function MyPackagesPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="My packages" />
      <p className="text-sm text-slate-400 -mt-4">
        Your active plan and package principal. Buy another package anytime from{" "}
        <Link href="/userdashboard/package" className="text-indigo-400 hover:underline">
          Package
        </Link>
        .
      </p>
      <MyActivePackages />
    </div>
  );
}
