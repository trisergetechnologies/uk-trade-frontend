import PageHeader from "@/components/ui/PageHeader";
import PackagePurchaseFlow from "@/components/package/PackagePurchaseFlow";

export default function PackagePage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Package" />
      <PackagePurchaseFlow />
    </div>
  );
}
