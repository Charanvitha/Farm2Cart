import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SupplierCard } from "@/components/SupplierCard";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ArrowLeft,
  Loader2,
  MapPin,
  Star
} from "lucide-react";
import type { ApiResponse, PaginatedResponse } from "@shared/api";

interface Supplier {
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
}

export default function Suppliers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [supplierType, setSupplierType] = useState(searchParams.get("type") || "all");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [onlyVerified, setOnlyVerified] = useState(searchParams.get("verified") === "true");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm, supplierType, location, onlyVerified, currentPage]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (supplierType !== "all") params.append("supplierType", supplierType);
      if (location) params.append("location", location);
      if (onlyVerified) params.append("onlyVerified", "true");
      params.append("page", currentPage.toString());
      params.append("limit", "12");

      const response = await fetch(`/api/suppliers?${params.toString()}`);
      const data: ApiResponse<PaginatedResponse<Supplier>> = await response.json();
      
      if (data.success && data.data) {
        setSuppliers(data.data.data);
        setTotalCount(data.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURLParams({ search: value });
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setCurrentPage(1);
    
    switch (key) {
      case "type":
        setSupplierType(value as string);
        break;
      case "location":
        setLocation(value as string);
        break;
      case "verified":
        setOnlyVerified(value as boolean);
        break;
    }
    
    updateURLParams({ [key]: value });
  };

  const updateURLParams = (updates: Record<string, string | boolean>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === "all" || value === false) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSupplierType("all");
    setLocation("");
    setOnlyVerified(false);
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handleViewProducts = (supplierId: string) => {
    // Navigate to products page filtered by this supplier
    window.location.href = `/products?supplier=${supplierId}`;
  };

  const handleContact = (supplierId: string) => {
    // In a real app, this would open a contact modal or chat
    alert(`Contact feature coming soon for supplier ${supplierId}`);
  };

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-50 to-fresh-50">
      {/* Header */}
      <header className="border-b border-farm-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-farm-600 p-2 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-farm-800">Farm2Cart</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/suppliers" className="text-farm-600 font-medium">Suppliers</Link>
            <Link to="/products" className="text-farm-700 hover:text-farm-800">Products</Link>
            <Link to="/login" className="text-farm-700 hover:text-farm-800">Login</Link>
          </nav>
          <Link to="/">
            <Button variant="ghost" className="text-farm-700 hover:text-farm-800 hover:bg-farm-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-farm-900 mb-4">
              Browse Verified Suppliers
            </h1>
            <p className="text-xl text-farm-700 max-w-2xl mx-auto">
              Connect with trusted farmers, wholesalers, and home producers
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-farm-50 rounded-2xl p-6 mb-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-farm-800 mb-2">
                  Search Suppliers
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                  <Input
                    placeholder="Search by name, location..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-farm-200 focus:border-farm-600"
                  />
                </div>
              </div>

              {/* Supplier Type */}
              <div>
                <label className="block text-sm font-medium text-farm-800 mb-2">
                  Supplier Type
                </label>
                <Select value={supplierType} onValueChange={(value) => handleFilterChange("type", value)}>
                  <SelectTrigger className="border-farm-200 focus:border-farm-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="farmer">Farmers</SelectItem>
                    <SelectItem value="wholesaler">Wholesalers</SelectItem>
                    <SelectItem value="home_producer">Home Producers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-farm-800 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                  <Input
                    placeholder="City, State"
                    value={location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="pl-10 border-farm-200 focus:border-farm-600"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange("verified", !onlyVerified)}
                  className={`border-farm-600 ${
                    onlyVerified 
                      ? "bg-farm-600 text-white hover:bg-farm-700" 
                      : "text-farm-600 hover:bg-farm-50"
                  }`}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Verified Only
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-farm-700 hover:text-farm-800 hover:bg-farm-100"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-farm-700">
              Found <span className="font-semibold">{totalCount}</span> suppliers
            </p>
            {(searchTerm || supplierType !== "all" || location || onlyVerified) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-farm-600">Filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="bg-farm-100 text-farm-800">
                    Search: {searchTerm}
                  </Badge>
                )}
                {supplierType !== "all" && (
                  <Badge variant="secondary" className="bg-farm-100 text-farm-800">
                    Type: {supplierType}
                  </Badge>
                )}
                {location && (
                  <Badge variant="secondary" className="bg-farm-100 text-farm-800">
                    Location: {location}
                  </Badge>
                )}
                {onlyVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified Only
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Suppliers Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-farm-200 p-6 animate-pulse">
                  <div className="h-6 bg-farm-200 rounded mb-3"></div>
                  <div className="h-4 bg-farm-100 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-farm-100 rounded w-20"></div>
                    <div className="h-6 bg-farm-100 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-farm-100 rounded w-24 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-farm-100 rounded flex-1"></div>
                    <div className="h-8 bg-farm-100 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : suppliers.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {suppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onViewProducts={handleViewProducts}
                    onContact={handleContact}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-farm-600 text-farm-600 hover:bg-farm-50"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-farm-600 hover:bg-farm-700 text-white"
                              : "border-farm-600 text-farm-600 hover:bg-farm-50"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-farm-600 text-farm-600 hover:bg-farm-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-farm-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Filter className="h-12 w-12 text-farm-600" />
              </div>
              <h3 className="text-xl font-semibold text-farm-900 mb-2">
                No suppliers found
              </h3>
              <p className="text-farm-600 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} className="bg-farm-600 hover:bg-farm-700 text-white">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
