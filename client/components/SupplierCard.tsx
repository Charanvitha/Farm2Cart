import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SupplierBadges } from "@/components/ui/verification-badge";
import { MapPin, Package, Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SupplierCardProps {
  supplier: {
    id: string;
    supplierType: "farmer" | "wholesaler" | "home_producer";
    verificationStatus: "verified" | "pending" | "rejected";
    trustScore: number;
    totalOrders: number;
    totalRatings: number;
    isVerified: boolean;
    verifiedBadges: string[];
    user: {
      businessName: string;
      location: string;
    };
  };
  onViewProducts?: (supplierId: string) => void;
  onContact?: (supplierId: string) => void;
  className?: string;
}

export function SupplierCard({ 
  supplier, 
  onViewProducts, 
  onContact,
  className 
}: SupplierCardProps) {
  const getSupplierTypeInfo = (type: string) => {
    switch (type) {
      case "farmer":
        return {
          title: "Local Farmer",
          description: "Fresh produce directly from farms",
          color: "text-farm-600"
        };
      case "wholesaler":
        return {
          title: "Wholesaler",
          description: "Bulk supplies and commodities",
          color: "text-blue-600"
        };
      case "home_producer":
        return {
          title: "Home Producer",
          description: "Homemade artisan products",
          color: "text-pink-600"
        };
      default:
        return {
          title: "Supplier",
          description: "Quality products",
          color: "text-gray-600"
        };
    }
  };

  const typeInfo = getSupplierTypeInfo(supplier.supplierType);

  return (
    <Card className={cn("hover:shadow-lg transition-shadow border-farm-200", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-farm-900 mb-1">
              {supplier.user.businessName}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm text-farm-600 mb-3">
              <MapPin className="h-3 w-3" />
              {supplier.user.location}
            </CardDescription>
          </div>
          {supplier.verificationStatus === "verified" && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Verified
            </Badge>
          )}
        </div>

        {/* Supplier Type and Description */}
        <div className="mb-3">
          <h4 className={cn("font-medium", typeInfo.color)}>{typeInfo.title}</h4>
          <p className="text-sm text-muted-foreground">{typeInfo.description}</p>
        </div>

        {/* Verification Badges */}
        <SupplierBadges
          supplierType={supplier.supplierType}
          isVerified={supplier.isVerified}
          verifiedBadges={supplier.verifiedBadges}
          trustScore={supplier.trustScore}
          totalRatings={supplier.totalRatings}
          size="sm"
          layout="horizontal"
        />
      </CardHeader>

      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-farm-600">
              {supplier.totalOrders}
            </div>
            <div className="text-xs text-muted-foreground">
              Total Orders
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-farm-600">
              {supplier.totalRatings}
            </div>
            <div className="text-xs text-muted-foreground">
              Reviews
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => onViewProducts?.(supplier.id)}
            className="flex-1 bg-farm-600 hover:bg-farm-700 text-white"
            size="sm"
          >
            <Package className="h-4 w-4 mr-1" />
            View Products
          </Button>
          <Button 
            onClick={() => onContact?.(supplier.id)}
            variant="outline"
            className="border-farm-600 text-farm-600 hover:bg-farm-50"
            size="sm"
          >
            <Phone className="h-4 w-4 mr-1" />
            Contact
          </Button>
        </div>

        {/* Last Active */}
        <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          Active today
        </div>
      </CardContent>
    </Card>
  );
}
