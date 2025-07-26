import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge, TrustScore } from "@/components/ui/verification-badge";
import { MapPin, ShoppingCart, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    images: string[];
    isAvailable: boolean;
    supplier: {
      id: string;
      supplierType: "farmer" | "wholesaler" | "home_producer";
      isVerified: boolean;
      verifiedBadges: string[];
      trustScore: number;
      totalRatings: number;
      user: {
        businessName: string;
        location: string;
      };
    };
  };
  onAddToCart?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  className?: string;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetails,
  className 
}: ProductCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      vegetables: "bg-green-100 text-green-800",
      fruits: "bg-orange-100 text-orange-800", 
      oils: "bg-yellow-100 text-yellow-800",
      spices: "bg-red-100 text-red-800",
      dairy: "bg-blue-100 text-blue-800",
      packaging: "bg-gray-100 text-gray-800",
      grains: "bg-amber-100 text-amber-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatPrice = (price: number, unit: string) => {
    return `₹${price}/${unit}`;
  };

  const getAvailabilityStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (quantity < 10) return { label: "Low Stock", color: "bg-orange-100 text-orange-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const availability = getAvailabilityStatus(product.quantity);

  return (
    <Card className={cn("hover:shadow-lg transition-shadow border-farm-200", className)}>
      {/* Product Image */}
      <div className="relative">
        {product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-farm-100 rounded-t-lg flex items-center justify-center">
            <Package className="h-12 w-12 text-farm-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <Badge className={cn("absolute top-2 left-2", getCategoryColor(product.category))}>
          {product.category}
        </Badge>

        {/* Availability Badge */}
        <Badge className={cn("absolute top-2 right-2", availability.color)}>
          {availability.label}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-farm-900 mb-1 line-clamp-1">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-farm-600 line-clamp-2 mb-2">
              {product.description}
            </CardDescription>
            
            {/* Price */}
            <div className="text-xl font-bold text-farm-600 mb-2">
              {formatPrice(product.price, product.unit)}
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="border-t border-farm-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-sm text-farm-800">
                {product.supplier.user.businessName}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {product.supplier.user.location}
              </p>
            </div>
          </div>

          {/* Supplier Badges */}
          <div className="flex flex-wrap items-center gap-1 mb-2">
            <VerificationBadge type={product.supplier.supplierType} size="sm" />
            {product.supplier.isVerified && (
              <VerificationBadge type="verified" size="sm" />
            )}
            {product.supplier.verifiedBadges.map((badge, index) => {
              if (badge.toLowerCase().includes("organic")) {
                return <VerificationBadge key={index} type="organic" size="sm" />;
              }
              if (badge.toLowerCase().includes("quality")) {
                return <VerificationBadge key={index} type="quality" size="sm" />;
              }
              return null;
            })}
          </div>

          {/* Trust Score */}
          {product.supplier.trustScore > 0 && (
            <TrustScore 
              score={product.supplier.trustScore}
              totalRatings={product.supplier.totalRatings}
              size="sm"
              showCount={false}
              className="mb-2"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Quantity Available */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>Available:</span>
          <span className="font-medium">{product.quantity} {product.unit}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => onViewDetails?.(product.id)}
            variant="outline"
            className="flex-1 border-farm-600 text-farm-600 hover:bg-farm-50"
            size="sm"
          >
            View Details
          </Button>
          <Button 
            onClick={() => onAddToCart?.(product.id)}
            className="flex-1 bg-farm-600 hover:bg-farm-700 text-white"
            size="sm"
            disabled={!product.isAvailable || product.quantity === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
