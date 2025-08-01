// Demo endpoint (existing)
export interface DemoResponse {
  message: string;
}

// User and Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "vendor" | "supplier" | "admin";
  businessName?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterRequest extends AuthRequest {
  firstName: string;
  lastName: string;
  phone: string;
  businessName?: string;
  location?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Supplier Types
export type SupplierType = "farmer" | "wholesaler" | "home_producer";

export interface Supplier {
  id: string;
  userId: string;
  supplierType: SupplierType;
  verificationStatus: "pending" | "verified" | "rejected";
  trustScore: number;
  totalOrders: number;
  positiveRatings: number;
  totalRatings: number;
  isVerified: boolean;
  verifiedBadges: string[];
  documentsUploaded: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export type ProductCategory =
  | "vegetables"
  | "fruits"
  | "oils"
  | "spices"
  | "dairy"
  | "packaging"
  | "grains"
  | "other";

export interface Product {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string; // kg, liter, piece, etc.
  quantity: number;
  images: string[];
  isAvailable: boolean;
  lastUpdated: string;
  createdAt: string;
}

export interface ProductWithSupplier extends Product {
  supplier: Supplier & { user: Pick<User, "businessName" | "location"> };
}

// Orders
export interface OrderItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Order {
  id: string;
  vendorId: string;
  supplierId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderWithDetails extends Order {
  vendor: Pick<User, "firstName" | "lastName" | "businessName" | "phone">;
  supplier: Pick<User, "firstName" | "lastName" | "businessName" | "phone">;
  items: (OrderItem & { product: Pick<Product, "name" | "unit"> })[];
}

// Ratings and Reviews
export interface Rating {
  id: string;
  orderId: string;
  vendorId: string;
  supplierId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request interfaces for various endpoints
export interface CreateProductRequest {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  quantity: number;
  images?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isAvailable?: boolean;
}

export interface CreateOrderRequest {
  supplierId: string;
  items: Omit<OrderItem, "pricePerUnit">[];
}

export interface UpdateOrderStatusRequest {
  status: Order["status"];
  deliveryDate?: string;
}

export interface CreateRatingRequest {
  orderId: string;
  rating: number;
  comment?: string;
}

// Search and Filter interfaces
export interface ProductSearchParams {
  category?: ProductCategory;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  supplierType?: SupplierType;
  onlyVerified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SupplierSearchParams {
  supplierType?: SupplierType;
  location?: string;
  minTrustScore?: number;
  onlyVerified?: boolean;
  page?: number;
  limit?: number;
}

// Document Verification Types
export type DocumentType =
  | "purchase_bill"
  | "mandi_receipt"
  | "harvest_log"
  | "business_license"
  | "identity_proof"
  | "food_safety_cert";

export interface UploadedDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  metadata?: {
    fileSize: number;
    mimeType: string;
    originalName: string;
  };
}

// Live Photo Verification Types
export interface LiveInventoryPhoto {
  id: string;
  productId: string;
  supplierId: string;
  imageUrl: string;
  capturedAt: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  deviceInfo: {
    userAgent: string;
    timestamp: string;
    timezone: string;
  };
  verificationStatus: "pending" | "verified" | "flagged" | "rejected";
  aiAnalysis?: {
    isRealTime: boolean;
    duplicateScore: number;
    retailStoreDetected: boolean;
    confidence: number;
  };
}

// AI Image Analysis Types
export interface ImageAnalysisResult {
  imageId: string;
  analysis: {
    isDuplicate: boolean;
    duplicateScore: number;
    retailStoreDetected: boolean;
    stockPhotoLikelihood: number;
    inappropriateContent: boolean;
    confidence: number;
    flags: string[];
  };
  createdAt: string;
}

// Verification Requests
export interface DocumentUploadRequest {
  type: DocumentType;
  supplierId: string;
  file: File | string; // File object or base64 string
  metadata?: {
    originalName: string;
    description?: string;
  };
}

export interface LivePhotoRequest {
  productId: string;
  supplierId: string;
  imageData: string; // base64 image data
  gpsLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  deviceInfo: {
    userAgent: string;
    timestamp: string;
    timezone: string;
  };
}

export interface ImageVerificationRequest {
  imageUrl: string;
  type: "product" | "document" | "live_inventory";
  supplierId: string;
  productId?: string;
}

// Admin interfaces
export interface VerifySupplierRequest {
  supplierId: string;
  status: "verified" | "rejected";
  badges?: string[];
  reason?: string;
}

export interface VerifyDocumentRequest {
  documentId: string;
  status: "verified" | "rejected";
  reason?: string;
}

export interface VerifyLivePhotoRequest {
  photoId: string;
  status: "verified" | "flagged" | "rejected";
  reason?: string;
}

export interface AdminStats {
  totalVendors: number;
  totalSuppliers: number;
  totalProducts: number;
  totalOrders: number;
  pendingVerifications: number;
  pendingDocuments: number;
  pendingLivePhotos: number;
  flaggedImages: number;
  averageTrustScore: number;
}
