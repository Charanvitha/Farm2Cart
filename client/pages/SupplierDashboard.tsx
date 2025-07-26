import PlaceholderPage from "./PlaceholderPage";
import { Leaf } from "lucide-react";

export default function SupplierDashboard() {
  return (
    <PlaceholderPage
      title="Supplier Dashboard"
      description="Manage your products, track orders, and build your reputation"
      icon={<Leaf className="h-8 w-8 text-fresh-600" />}
    />
  );
}
