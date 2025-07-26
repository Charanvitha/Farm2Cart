import PlaceholderPage from "./PlaceholderPage";
import { Settings } from "lucide-react";

export default function AdminDashboard() {
  return (
    <PlaceholderPage
      title="Admin Dashboard"
      description="Manage suppliers, verify accounts, and oversee platform operations"
      icon={<Settings className="h-8 w-8 text-gray-600" />}
    />
  );
}
