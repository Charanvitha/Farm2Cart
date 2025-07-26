import { RequestHandler } from "express";
import {
  Supplier,
  ApiResponse,
  PaginatedResponse,
  SupplierSearchParams,
  SupplierType,
} from "@shared/api";

// Mock data for suppliers (in production, this would come from a database)
const mockSuppliers: (Supplier & {
  user: { businessName: string; location: string };
})[] = [
  {
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
      location: "Punjab, India",
    },
  },
  {
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
      location: "Kerala, India",
    },
  },
  {
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
      location: "Tamil Nadu, India",
    },
  },
  {
    id: "sup4",
    userId: "user4",
    supplierType: "farmer",
    verificationStatus: "pending",
    trustScore: 0,
    totalOrders: 0,
    positiveRatings: 0,
    totalRatings: 0,
    isVerified: false,
    verifiedBadges: [],
    documentsUploaded: true,
    createdAt: "2024-01-25T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
    user: {
      businessName: "New Farm Co-op",
      location: "Maharashtra, India",
    },
  },
];

// GET /api/suppliers - Get all suppliers with filtering
export const getSuppliers: RequestHandler = (req, res) => {
  try {
    const {
      supplierType,
      location,
      minTrustScore,
      onlyVerified,
      page = 1,
      limit = 10,
    } = req.query as Partial<SupplierSearchParams>;

    let filteredSuppliers = [...mockSuppliers];

    // Apply filters
    if (supplierType) {
      filteredSuppliers = filteredSuppliers.filter(
        (s) => s.supplierType === supplierType,
      );
    }

    if (location) {
      filteredSuppliers = filteredSuppliers.filter((s) =>
        s.user.location
          .toLowerCase()
          .includes(location.toString().toLowerCase()),
      );
    }

    if (minTrustScore) {
      filteredSuppliers = filteredSuppliers.filter(
        (s) => s.trustScore >= Number(minTrustScore),
      );
    }

    if (onlyVerified === "true") {
      filteredSuppliers = filteredSuppliers.filter((s) => s.isVerified);
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

    const response: ApiResponse<PaginatedResponse<(typeof mockSuppliers)[0]>> =
      {
        success: true,
        data: {
          data: paginatedSuppliers,
          total: filteredSuppliers.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(filteredSuppliers.length / limitNum),
        },
      };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch suppliers",
    });
  }
};

// GET /api/suppliers/:id - Get single supplier
export const getSupplierById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const supplier = mockSuppliers.find((s) => s.id === id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found",
      });
    }

    const response: ApiResponse<typeof supplier> = {
      success: true,
      data: supplier,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch supplier",
    });
  }
};

// GET /api/suppliers/types - Get supplier types with counts
export const getSupplierTypes: RequestHandler = (req, res) => {
  try {
    const types = mockSuppliers.reduce(
      (acc, supplier) => {
        const type = supplier.supplierType;
        if (!acc[type]) {
          acc[type] = {
            type,
            count: 0,
            verified: 0,
            averageTrustScore: 0,
          };
        }
        acc[type].count++;
        if (supplier.isVerified) {
          acc[type].verified++;
        }
        return acc;
      },
      {} as Record<
        SupplierType,
        {
          type: SupplierType;
          count: number;
          verified: number;
          averageTrustScore: number;
        }
      >,
    );

    // Calculate average trust scores
    Object.keys(types).forEach((type) => {
      const suppliersOfType = mockSuppliers.filter(
        (s) => s.supplierType === (type as SupplierType),
      );
      const totalTrustScore = suppliersOfType.reduce(
        (sum, s) => sum + s.trustScore,
        0,
      );
      types[type as SupplierType].averageTrustScore =
        suppliersOfType.length > 0
          ? totalTrustScore / suppliersOfType.length
          : 0;
    });

    const response: ApiResponse<typeof types> = {
      success: true,
      data: types,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch supplier types",
    });
  }
};
