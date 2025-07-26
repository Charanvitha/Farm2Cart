import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Shield, CheckCircle, Star, Leaf, Truck, Heart } from "lucide-react";

export interface VerificationBadgeProps {
  type:
    | "verified"
    | "farmer"
    | "wholesaler"
    | "home_producer"
    | "organic"
    | "quality";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeConfig = {
  verified: {
    label: "Verified Supplier",
    icon: Shield,
    className: "bg-green-100 text-green-800 border-green-200",
    iconColor: "text-green-600",
  },
  farmer: {
    label: "Local Farmer",
    icon: Leaf,
    className: "bg-farm-100 text-farm-800 border-farm-200",
    iconColor: "text-farm-600",
  },
  wholesaler: {
    label: "Bulk Supplier",
    icon: Truck,
    className: "bg-blue-100 text-blue-800 border-blue-200",
    iconColor: "text-blue-600",
  },
  home_producer: {
    label: "Home Producer",
    icon: Heart,
    className: "bg-pink-100 text-pink-800 border-pink-200",
    iconColor: "text-pink-600",
  },
  organic: {
    label: "Organic Certified",
    icon: CheckCircle,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    iconColor: "text-emerald-600",
  },
  quality: {
    label: "Quality Assured",
    icon: Star,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    iconColor: "text-yellow-600",
  },
};

const sizeConfig = {
  sm: {
    badge: "text-xs px-2 py-1",
    icon: "h-3 w-3",
  },
  md: {
    badge: "text-sm px-3 py-1",
    icon: "h-4 w-4",
  },
  lg: {
    badge: "text-base px-4 py-2",
    icon: "h-5 w-5",
  },
};

export function VerificationBadge({
  type,
  size = "md",
  className,
}: VerificationBadgeProps) {
  const config = badgeConfig[type];
  const sizeClasses = sizeConfig[size];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        sizeClasses.badge,
        "inline-flex items-center gap-1 font-medium",
        className,
      )}
    >
      <Icon className={cn(sizeClasses.icon, config.iconColor)} />
      {config.label}
    </Badge>
  );
}

export interface TrustScoreProps {
  score: number;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function TrustScore({
  score,
  totalRatings = 0,
  size = "md",
  showCount = true,
  className,
}: TrustScoreProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 4.0) return "text-yellow-600";
    if (score >= 3.5) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 4.0) return "Good";
    if (score >= 3.5) return "Average";
    return "Poor";
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1",
        sizeClasses[size],
        className,
      )}
    >
      <Star
        className={cn(iconSize[size], getScoreColor(score), "fill-current")}
      />
      <span className={cn("font-medium", getScoreColor(score))}>
        {score.toFixed(1)}
      </span>
      {showCount && totalRatings > 0 && (
        <span className="text-muted-foreground">
          ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
        </span>
      )}
      <span className={cn("text-xs", getScoreColor(score))}>
        {getScoreLabel(score)}
      </span>
    </div>
  );
}

export interface SupplierBadgesProps {
  supplierType: "farmer" | "wholesaler" | "home_producer";
  isVerified: boolean;
  verifiedBadges?: string[];
  trustScore?: number;
  totalRatings?: number;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  className?: string;
}

export function SupplierBadges({
  supplierType,
  isVerified,
  verifiedBadges = [],
  trustScore,
  totalRatings,
  size = "md",
  layout = "horizontal",
  className,
}: SupplierBadgesProps) {
  const layoutClasses =
    layout === "horizontal"
      ? "flex flex-wrap items-center gap-2"
      : "flex flex-col items-start gap-2";

  return (
    <div className={cn(layoutClasses, className)}>
      {/* Main supplier type badge */}
      <VerificationBadge type={supplierType} size={size} />

      {/* Verified badge */}
      {isVerified && <VerificationBadge type="verified" size={size} />}

      {/* Additional verification badges */}
      {verifiedBadges.map((badge, index) => {
        // Map badge names to badge types
        if (badge.toLowerCase().includes("organic")) {
          return <VerificationBadge key={index} type="organic" size={size} />;
        }
        if (badge.toLowerCase().includes("quality")) {
          return <VerificationBadge key={index} type="quality" size={size} />;
        }
        // Default to quality badge for unmapped badges
        return <VerificationBadge key={index} type="quality" size={size} />;
      })}

      {/* Trust score */}
      {trustScore !== undefined && trustScore > 0 && (
        <TrustScore
          score={trustScore}
          totalRatings={totalRatings}
          size={size}
          showCount={true}
        />
      )}
    </div>
  );
}
