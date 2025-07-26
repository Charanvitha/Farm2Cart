import { RequestHandler } from "express";
import { 
  ApiResponse, 
  AdminStats,
  VerifySupplierRequest,
  Supplier
} from "@shared/api";

// Mock pending verifications
const mockPendingVerifications = [
  {
    id: "sup4",
    userId: "user4",
    supplierType: "farmer" as const,
    verificationStatus: "pending" as const,
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
      firstName: "Anita",
      lastName: "Patel",
      businessName: "New Farm Co-op",
      location: "Maharashtra, India",
      email: "anita@newfarmcoop.com",
      phone: "+91-9876543215"
    },
    documents: [
      {
        type: "business_license",
        url: "https://example.com/license.pdf",
        uploadedAt: "2024-01-25T00:00:00Z"
      },
      {
        type: "identity_proof",
        url: "https://example.com/identity.pdf", 
        uploadedAt: "2024-01-25T00:00:00Z"
      },
      {
        type: "product_sample",
        url: "https://example.com/sample.jpg",
        uploadedAt: "2024-01-25T00:00:00Z"
      }
    ]
  },
  {
    id: "sup5",
    userId: "user5",
    supplierType: "home_producer" as const,
    verificationStatus: "pending" as const,
    trustScore: 0,
    totalOrders: 0,
    positiveRatings: 0,
    totalRatings: 0,
    isVerified: false,
    verifiedBadges: [],
    documentsUploaded: true,
    createdAt: "2024-01-23T00:00:00Z",
    updatedAt: "2024-01-23T00:00:00Z",
    user: {
      firstName: "Meera",
      lastName: "Reddy",
      businessName: "Meera's Homemade Delights",
      location: "Andhra Pradesh, India",
      email: "meera@homemadedelights.com",
      phone: "+91-9876543216"
    },
    documents: [
      {
        type: "identity_proof",
        url: "https://example.com/meera_identity.pdf",
        uploadedAt: "2024-01-23T00:00:00Z"
      },
      {
        type: "food_safety_cert",
        url: "https://example.com/food_safety.pdf",
        uploadedAt: "2024-01-23T00:00:00Z"
      },
      {
        type: "product_sample",
        url: "https://example.com/pickles_sample.jpg",
        uploadedAt: "2024-01-23T00:00:00Z"
      }
    ]
  }
];

// GET /api/admin/stats - Get platform statistics
export const getAdminStats: RequestHandler = (req, res) => {
  try {
    const stats: AdminStats = {
      totalVendors: 156,
      totalSuppliers: 89,
      totalProducts: 342,
      totalOrders: 1247,
      pendingVerifications: mockPendingVerifications.length,
      pendingDocuments: 3, // Mock pending documents
      pendingLivePhotos: 5, // Mock pending live photos
      flaggedImages: 2, // Mock flagged images
      averageTrustScore: 4.7
    };

    const response: ApiResponse<AdminStats> = {
      success: true,
      data: stats
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch admin statistics"
    });
  }
};

// GET /api/admin/pending-verifications - Get suppliers pending verification
export const getPendingVerifications: RequestHandler = (req, res) => {
  try {
    const response: ApiResponse<typeof mockPendingVerifications> = {
      success: true,
      data: mockPendingVerifications
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch pending verifications"
    });
  }
};

// POST /api/admin/verify-supplier - Verify or reject supplier
export const verifySupplier: RequestHandler = (req, res) => {
  try {
    const { supplierId, status, badges, reason } = req.body as VerifySupplierRequest;
    
    const supplierIndex = mockPendingVerifications.findIndex(s => s.id === supplierId);
    if (supplierIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Supplier not found"
      });
    }

    // Update supplier verification status
    const updatedSupplier = {
      ...mockPendingVerifications[supplierIndex],
      verificationStatus: status,
      isVerified: status === 'verified',
      verifiedBadges: status === 'verified' ? (badges || []) : [],
      updatedAt: new Date().toISOString()
    };

    // Remove from pending list if processed
    mockPendingVerifications.splice(supplierIndex, 1);

    // In a real app, you'd:
    // 1. Update the supplier in the database
    // 2. Send notification to the supplier
    // 3. Log the admin action

    const response: ApiResponse<typeof updatedSupplier> = {
      success: true,
      data: updatedSupplier,
      message: `Supplier ${status === 'verified' ? 'verified' : 'rejected'} successfully`
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update supplier verification"
    });
  }
};

// GET /api/admin/flagged-content - Get flagged products/images
export const getFlaggedContent: RequestHandler = (req, res) => {
  try {
    // Mock flagged content data
    const flaggedContent = [
      {
        id: "flag1",
        type: "product_image",
        productId: "prod6",
        supplierId: "sup6",
        reason: "Suspected duplicate image",
        imageUrl: "https://example.com/suspicious.jpg",
        flaggedAt: "2024-01-24T14:30:00Z",
        status: "pending"
      },
      {
        id: "flag2", 
        type: "product_description",
        productId: "prod7",
        supplierId: "sup7",
        reason: "Misleading description",
        content: "100% organic (but no certification provided)",
        flaggedAt: "2024-01-23T10:15:00Z",
        status: "pending"
      }
    ];

    const response: ApiResponse<typeof flaggedContent> = {
      success: true,
      data: flaggedContent
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch flagged content"
    });
  }
};

// POST /api/admin/resolve-flag - Resolve flagged content
export const resolveFlag: RequestHandler = (req, res) => {
  try {
    const { flagId, action, reason } = req.body;
    
    // In a real app, you'd:
    // 1. Update the flag status in the database
    // 2. Take appropriate action (remove product, warn supplier, etc.)
    // 3. Log the admin action
    // 4. Notify the supplier

    const response: ApiResponse<{ flagId: string; action: string }> = {
      success: true,
      data: { flagId, action },
      message: `Flag ${action} successfully`
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to resolve flag"
    });
  }
};

// GET /api/admin/trust-scores - Get trust score analytics
export const getTrustScoreAnalytics: RequestHandler = (req, res) => {
  try {
    const analytics = {
      distribution: {
        excellent: 34, // 4.5-5.0
        good: 28,      // 4.0-4.4
        average: 15,   // 3.5-3.9
        poor: 8,       // 3.0-3.4
        bad: 4         // <3.0
      },
      averageByType: {
        farmer: 4.6,
        wholesaler: 4.4,
        home_producer: 4.8
      },
      trends: {
        thisMonth: 4.7,
        lastMonth: 4.6,
        improvement: 0.1
      }
    };

    const response: ApiResponse<typeof analytics> = {
      success: true,
      data: analytics
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch trust score analytics"
    });
  }
};
