import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Import Farm2Cart route handlers
import {
  getSuppliers,
  getSupplierById,
  getSupplierTypes,
} from "./routes/suppliers";

import {
  getProducts,
  getProductById,
  getProductCategories,
  createProduct,
  updateProduct,
} from "./routes/products";

import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrderStats,
} from "./routes/orders";

import {
  getAdminStats,
  getPendingVerifications,
  verifySupplier,
  getFlaggedContent,
  resolveFlag,
  getTrustScoreAnalytics,
} from "./routes/admin";

import {
  uploadDocument,
  uploadLivePhoto,
  analyzeImage,
  getSupplierDocuments,
  getSupplierLivePhotos,
  getPendingReviews,
  verifyDocument,
  verifyLivePhoto,
} from "./routes/verification";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Suppliers API
  app.get("/api/suppliers", getSuppliers);
  app.get("/api/suppliers/types", getSupplierTypes);
  app.get("/api/suppliers/:id", getSupplierById);

  // Products API
  app.get("/api/products", getProducts);
  app.get("/api/products/categories", getProductCategories);
  app.get("/api/products/:id", getProductById);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);

  // Orders API
  app.get("/api/orders", getOrders);
  app.get("/api/orders/stats", getOrderStats);
  app.get("/api/orders/:id", getOrderById);
  app.post("/api/orders", createOrder);
  app.put("/api/orders/:id/status", updateOrderStatus);

  // Admin API
  app.get("/api/admin/stats", getAdminStats);
  app.get("/api/admin/pending-verifications", getPendingVerifications);
  app.post("/api/admin/verify-supplier", verifySupplier);
  app.get("/api/admin/flagged-content", getFlaggedContent);
  app.post("/api/admin/resolve-flag", resolveFlag);
  app.get("/api/admin/trust-scores", getTrustScoreAnalytics);

  // Verification API - Document & Photo Authentication
  app.post("/api/verification/upload-document", uploadDocument);
  app.post("/api/verification/live-photo", uploadLivePhoto);
  app.post("/api/verification/analyze-image", analyzeImage);
  app.get("/api/verification/documents/:supplierId", getSupplierDocuments);
  app.get("/api/verification/live-photos/:supplierId", getSupplierLivePhotos);
  app.get("/api/verification/pending-reviews", getPendingReviews);
  app.post("/api/verification/verify-document", verifyDocument);
  app.post("/api/verification/verify-live-photo", verifyLivePhoto);

  return app;
}
