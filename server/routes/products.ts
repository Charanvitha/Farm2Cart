import { RequestHandler } from "express";
import { 
  Product, 
  ProductWithSupplier,
  ApiResponse, 
  PaginatedResponse, 
  ProductSearchParams,
  CreateProductRequest,
  UpdateProductRequest,
  ProductCategory 
} from "@shared/api";

// Mock data for products (in production, this would come from a database)
const mockProducts: ProductWithSupplier[] = [
  {
    id: "prod1",
    supplierId: "sup1",
    name: "Fresh Tomatoes",
    description: "Organic farm-fresh tomatoes, perfect for street food preparations",
    category: "vegetables",
    price: 45,
    unit: "kg",
    quantity: 500,
    images: [
      "https://images.unsplash.com/photo-1546470427-e26264be0b0c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop"
    ],
    isAvailable: true,
    lastUpdated: "2024-01-20T10:30:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    supplier: {
      id: "sup1",
      userId: "user1",
      supplierType: "farmer",
      verificationStatus: "verified",
      trustScore: 4.8,
      totalOrders: 156,
      positiveRatings: 148,
      totalRatings: 156,
      isVerified: true,
      verifiedBadges: ["Organic Certified", "Fresh Produce"],
      documentsUploaded: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
      user: {
        businessName: "Green Valley Farms",
        location: "Punjab, India"
      }
    }
  },
  {
    id: "prod2",
    supplierId: "sup2",
    name: "Premium Cooking Oil",
    description: "High-quality refined sunflower oil, ideal for frying and cooking",
    category: "oils",
    price: 150,
    unit: "liter",
    quantity: 200,
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=400&h=300&fit=crop"
    ],
    isAvailable: true,
    lastUpdated: "2024-01-18T15:45:00Z",
    createdAt: "2024-01-10T00:00:00Z",
    supplier: {
      id: "sup2",
      userId: "user2",
      supplierType: "wholesaler",
      verificationStatus: "verified",
      trustScore: 4.6,
      totalOrders: 89,
      positiveRatings: 82,
      totalRatings: 89,
      isVerified: true,
      verifiedBadges: ["Bulk Supplier", "Quality Assured"],
      documentsUploaded: true,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-18T00:00:00Z",
      user: {
        businessName: "Spice Masters Ltd",
        location: "Kerala, India"
      }
    }
  },
  {
    id: "prod3",
    supplierId: "sup3",
    name: "Homemade Garam Masala",
    description: "Traditional blend of spices made with family recipes, aromatic and flavorful",
    category: "spices",
    price: 280,
    unit: "kg",
    quantity: 50,
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebc227e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1626428913595-5b77d16c9c64?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1615485925315-4ba30541d21b?w=400&h=300&fit=crop"
    ],
    isAvailable: true,
    lastUpdated: "2024-01-22T09:15:00Z",
    createdAt: "2024-01-08T00:00:00Z",
    supplier: {
      id: "sup3",
      userId: "user3",
      supplierType: "home_producer",
      verificationStatus: "verified",
      trustScore: 4.9,
      totalOrders: 34,
      positiveRatings: 33,
      totalRatings: 34,
      isVerified: true,
      verifiedBadges: ["Home Made", "Traditional Recipes"],
      documentsUploaded: true,
      createdAt: "2024-01-08T00:00:00Z",
      updatedAt: "2024-01-22T00:00:00Z",
      user: {
        businessName: "Amma's Kitchen",
        location: "Tamil Nadu, India"
      }
    }
  },
  {
    id: "prod4",
    supplierId: "sup1",
    name: "Fresh Onions",
    description: "Red onions, freshly harvested and sorted for quality",
    category: "vegetables",
    price: 35,
    unit: "kg",
    quantity: 800,
    images: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"],
    isAvailable: true,
    lastUpdated: "2024-01-20T10:30:00Z",
    createdAt: "2024-01-15T00:00:00Z",
    supplier: {
      id: "sup1",
      userId: "user1",
      supplierType: "farmer",
      verificationStatus: "verified",
      trustScore: 4.8,
      totalOrders: 156,
      positiveRatings: 148,
      totalRatings: 156,
      isVerified: true,
      verifiedBadges: ["Organic Certified", "Fresh Produce"],
      documentsUploaded: true,
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
      user: {
        businessName: "Green Valley Farms",
        location: "Punjab, India"
      }
    }
  },
  {
    id: "prod5",
    supplierId: "sup2",
    name: "Food Grade Containers",
    description: "BPA-free plastic containers for food packaging and storage",
    category: "packaging",
    price: 25,
    unit: "piece",
    quantity: 1000,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    isAvailable: true,
    lastUpdated: "2024-01-18T15:45:00Z",
    createdAt: "2024-01-10T00:00:00Z",
    supplier: {
      id: "sup2",
      userId: "user2",
      supplierType: "wholesaler",
      verificationStatus: "verified",
      trustScore: 4.6,
      totalOrders: 89,
      positiveRatings: 82,
      totalRatings: 89,
      isVerified: true,
      verifiedBadges: ["Bulk Supplier", "Quality Assured"],
      documentsUploaded: true,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-18T00:00:00Z",
      user: {
        businessName: "Spice Masters Ltd",
        location: "Kerala, India"
      }
    }
  }
];

// GET /api/products - Get all products with filtering
export const getProducts: RequestHandler = (req, res) => {
  try {
    const {
      category,
      location,
      minPrice,
      maxPrice,
      supplierType,
      onlyVerified,
      search,
      page = 1,
      limit = 12
    } = req.query as Partial<ProductSearchParams>;

    let filteredProducts = [...mockProducts];

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (location) {
      filteredProducts = filteredProducts.filter(p => 
        p.supplier.user.location.toLowerCase().includes(location.toString().toLowerCase())
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }

    if (supplierType) {
      filteredProducts = filteredProducts.filter(p => p.supplier.supplierType === supplierType);
    }

    if (onlyVerified === 'true') {
      filteredProducts = filteredProducts.filter(p => p.supplier.isVerified);
    }

    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.supplier.user.businessName.toLowerCase().includes(searchTerm)
      );
    }

    // Only show available products
    filteredProducts = filteredProducts.filter(p => p.isAvailable);

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response: ApiResponse<PaginatedResponse<ProductWithSupplier>> = {
      success: true,
      data: {
        data: paginatedProducts,
        total: filteredProducts.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredProducts.length / limitNum)
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch products"
    });
  }
};

// GET /api/products/:id - Get single product
export const getProductById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    const response: ApiResponse<ProductWithSupplier> = {
      success: true,
      data: product
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch product"
    });
  }
};

// GET /api/products/categories - Get product categories with counts
export const getProductCategories: RequestHandler = (req, res) => {
  try {
    const categories = mockProducts.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          count: 0,
          averagePrice: 0,
          verified: 0
        };
      }
      acc[category].count++;
      if (product.supplier.isVerified) {
        acc[category].verified++;
      }
      return acc;
    }, {} as Record<ProductCategory, { category: ProductCategory; count: number; averagePrice: number; verified: number }>);

    // Calculate average prices
    Object.keys(categories).forEach(category => {
      const productsOfCategory = mockProducts.filter(p => p.category === category as ProductCategory);
      const totalPrice = productsOfCategory.reduce((sum, p) => sum + p.price, 0);
      categories[category as ProductCategory].averagePrice = 
        productsOfCategory.length > 0 ? Math.round(totalPrice / productsOfCategory.length) : 0;
    });

    const response: ApiResponse<typeof categories> = {
      success: true,
      data: categories
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch product categories"
    });
  }
};

// POST /api/products - Create new product (supplier only)
export const createProduct: RequestHandler = (req, res) => {
  try {
    const productData = req.body as CreateProductRequest;
    
    // In a real app, you'd get the supplier ID from the authenticated user
    const supplierId = "sup1"; // Mock supplier ID
    
    const newProduct: Product = {
      id: `prod${Date.now()}`,
      supplierId,
      ...productData,
      images: productData.images || [],
      isAvailable: true,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // In a real app, you'd save this to the database
    // mockProducts.push(newProduct with supplier data);

    const response: ApiResponse<Product> = {
      success: true,
      data: newProduct,
      message: "Product created successfully"
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create product"
    });
  }
};

// PUT /api/products/:id - Update product
export const updateProduct: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateProductRequest;
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    // Update the product
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };

    mockProducts[productIndex] = updatedProduct;

    const response: ApiResponse<ProductWithSupplier> = {
      success: true,
      data: updatedProduct,
      message: "Product updated successfully"
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update product"
    });
  }
};
