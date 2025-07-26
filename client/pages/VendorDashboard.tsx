import PlaceholderPage from "./PlaceholderPage";
import { Users } from "lucide-react";

export default function VendorDashboard() {
  return (
    <PlaceholderPage
      title="Vendor Dashboard"
      description="Browse suppliers, manage orders, and track your ingredient sourcing"
      icon={<Users className="h-8 w-8 text-farm-600" />}
    />
  );
}
