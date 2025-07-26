import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import {
  ShoppingCart,
  Search,
  Filter,
  ArrowLeft,
  Loader2,
  Package,
  Star,
} from "lucide-react";
import type {
  ApiResponse,
  PaginatedResponse,
  ProductWithSupplier,
} from "@shared/api";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductWithSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [supplierType, setSupplierType] = useState(
    searchParams.get("supplierType") || "all",
  );
  const [onlyVerified, setOnlyVerified] = useState(
    searchParams.get("verified") === "true",
  );
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, category, supplierType, onlyVerified, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (category !== "all") params.append("category", category);
      if (supplierType !== "all") params.append("supplierType", supplierType);
      if (onlyVerified) params.append("onlyVerified", "true");
      params.append("page", currentPage.toString());
      params.append("limit", "12");

      const response = await fetch(`/api/products?${params.toString()}`, {
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<PaginatedResponse<ProductWithSupplier>> =
        await response.json();

      if (data.success && data.data) {
        setProducts(data.data.data);
        setTotalCount(data.data.total);
      } else {
        console.error("API returned error:", data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
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
      case "category":
        setCategory(value as string);
        break;
      case "supplierType":
        setSupplierType(value as string);
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
    setCategory("all");
    setSupplierType("all");
    setOnlyVerified(false);
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handleAddToCart = (productId: string) => {
    // In a real app, this would add to cart
    alert(`Added product ${productId} to cart! (Cart feature coming soon)`);
  };

  const handleViewDetails = (productId: string) => {
    // In a real app, this would show product details modal or page
    alert(
      `View details for product ${productId} (Product details coming soon)`,
    );
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
            <Link to="/suppliers" className="text-farm-700 hover:text-farm-800">
              Suppliers
            </Link>
            <Link to="/products" className="text-farm-600 font-medium">
              Products
            </Link>
            <Link to="/login" className="text-farm-700 hover:text-farm-800">
              Login
            </Link>
          </nav>
          <Link to="/">
            <Button
              variant="ghost"
              className="text-farm-700 hover:text-farm-800 hover:bg-farm-100"
            >
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
              Browse Fresh Products
            </h1>
            <p className="text-xl text-farm-700 max-w-2xl mx-auto">
              Find quality ingredients from verified suppliers across India
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-farm-50 rounded-2xl p-6 mb-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-farm-800 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                  <Input
                    placeholder="Search products, suppliers..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-farm-200 focus:border-farm-600"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-farm-800 mb-2">
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger className="border-farm-200 focus:border-farm-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="oils">Oils</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="packaging">Packaging</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Supplier Type */}
              <div>
                <label className="block text-sm font-medium text-farm-800 mb-2">
                  Supplier Type
                </label>
                <Select
                  value={supplierType}
                  onValueChange={(value) =>
                    handleFilterChange("supplierType", value)
                  }
                >
                  <SelectTrigger className="border-farm-200 focus:border-farm-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="farmer">Farmers</SelectItem>
                    <SelectItem value="wholesaler">Wholesalers</SelectItem>
                    <SelectItem value="home_producer">
                      Home Producers
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              Found <span className="font-semibold">{totalCount}</span> products
            </p>
            {(searchTerm ||
              category !== "all" ||
              supplierType !== "all" ||
              onlyVerified) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-farm-600">Filters:</span>
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="bg-farm-100 text-farm-800"
                  >
                    Search: {searchTerm}
                  </Badge>
                )}
                {category !== "all" && (
                  <Badge
                    variant="secondary"
                    className="bg-farm-100 text-farm-800"
                  >
                    Category: {category}
                  </Badge>
                )}
                {supplierType !== "all" && (
                  <Badge
                    variant="secondary"
                    className="bg-farm-100 text-farm-800"
                  >
                    Supplier: {supplierType}
                  </Badge>
                )}
                {onlyVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    Verified Only
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-farm-200 animate-pulse"
                >
                  <div className="h-48 bg-farm-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-5 bg-farm-200 rounded mb-2"></div>
                    <div className="h-4 bg-farm-100 rounded mb-3"></div>
                    <div className="h-6 bg-farm-200 rounded w-20 mb-3"></div>
                    <div className="h-4 bg-farm-100 rounded mb-2"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-5 bg-farm-100 rounded w-16"></div>
                      <div className="h-5 bg-farm-100 rounded w-12"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-farm-100 rounded flex-1"></div>
                      <div className="h-8 bg-farm-100 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
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
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
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
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
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
                <Package className="h-12 w-12 text-farm-600" />
              </div>
              <h3 className="text-xl font-semibold text-farm-900 mb-2">
                No products found
              </h3>
              <p className="text-farm-600 mb-6">
                Try adjusting your search criteria or filters
              </p>
              <Button
                onClick={clearFilters}
                className="bg-farm-600 hover:bg-farm-700 text-white"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
