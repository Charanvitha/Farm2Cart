import { RequestHandler } from "express";
import { 
  ApiResponse,
  UploadedDocument,
  LiveInventoryPhoto,
  ImageAnalysisResult,
  DocumentUploadRequest,
  LivePhotoRequest,
  ImageVerificationRequest,
  VerifyDocumentRequest,
  VerifyLivePhotoRequest,
  DocumentType
} from "@shared/api";

// Mock data storage (in production, use database)
const mockDocuments: UploadedDocument[] = [
  {
    id: "doc1",
    type: "purchase_bill",
    fileName: "wheat_purchase_bill.pdf",
    fileUrl: "https://example.com/bills/wheat_purchase_bill.pdf",
    uploadedAt: "2024-01-20T10:30:00Z",
    verificationStatus: "pending",
    metadata: {
      fileSize: 245760,
      mimeType: "application/pdf",
      originalName: "Wheat Purchase from Local Mandi.pdf"
    }
  },
  {
    id: "doc2", 
    type: "mandi_receipt",
    fileName: "tomato_mandi_receipt.jpg",
    fileUrl: "https://example.com/receipts/tomato_mandi_receipt.jpg",
    uploadedAt: "2024-01-22T14:15:00Z",
    verificationStatus: "verified",
    metadata: {
      fileSize: 1024000,
      mimeType: "image/jpeg",
      originalName: "Tomato Mandi Receipt Jan 2024.jpg"
    }
  }
];

const mockLivePhotos: LiveInventoryPhoto[] = [
  {
    id: "photo1",
    productId: "prod1",
    supplierId: "sup1",
    imageUrl: "https://example.com/live/tomatoes_warehouse_20240120.jpg",
    capturedAt: "2024-01-20T16:45:00Z",
    gpsLocation: {
      latitude: 30.7046,
      longitude: 76.7179,
      accuracy: 10
    },
    deviceInfo: {
      userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G975F)",
      timestamp: "2024-01-20T16:45:00Z",
      timezone: "Asia/Kolkata"
    },
    verificationStatus: "verified",
    aiAnalysis: {
      isRealTime: true,
      duplicateScore: 0.1,
      retailStoreDetected: false,
      confidence: 0.95
    }
  },
  {
    id: "photo2",
    productId: "prod3",
    supplierId: "sup3",
    imageUrl: "https://example.com/live/spices_kitchen_20240122.jpg",
    capturedAt: "2024-01-22T11:30:00Z",
    gpsLocation: {
      latitude: 13.0827,
      longitude: 80.2707,
      accuracy: 15
    },
    deviceInfo: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)",
      timestamp: "2024-01-22T11:30:00Z",
      timezone: "Asia/Kolkata"
    },
    verificationStatus: "pending",
    aiAnalysis: {
      isRealTime: true,
      duplicateScore: 0.05,
      retailStoreDetected: false,
      confidence: 0.88
    }
  }
];

// POST /api/verification/upload-document - Upload supplier documents
export const uploadDocument: RequestHandler = async (req, res) => {
  try {
    const { type, supplierId, file, metadata } = req.body as DocumentUploadRequest;
    
    // In production, validate file, scan for malware, store in cloud storage
    const documentId = `doc${Date.now()}`;
    const fileUrl = `https://example.com/documents/${documentId}`;
    
    const newDocument: UploadedDocument = {
      id: documentId,
      type,
      fileName: metadata?.originalName || `document_${documentId}`,
      fileUrl,
      uploadedAt: new Date().toISOString(),
      verificationStatus: "pending",
      metadata: {
        fileSize: typeof file === 'string' ? file.length : 0,
        mimeType: getDocumentMimeType(type),
        originalName: metadata?.originalName || ""
      }
    };
    
    mockDocuments.push(newDocument);
    
    const response: ApiResponse<UploadedDocument> = {
      success: true,
      data: newDocument,
      message: "Document uploaded successfully and queued for verification"
    };
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to upload document"
    });
  }
};

// POST /api/verification/live-photo - Upload live inventory photo
export const uploadLivePhoto: RequestHandler = async (req, res) => {
  try {
    const { productId, supplierId, imageData, gpsLocation, deviceInfo } = req.body as LivePhotoRequest;
    
    // In production, process image, store in cloud storage, run AI analysis
    const photoId = `photo${Date.now()}`;
    const imageUrl = `https://example.com/live/${photoId}.jpg`;
    
    // Mock AI analysis
    const aiAnalysis = await runAIImageAnalysis(imageData, 'live_inventory');
    
    const newPhoto: LiveInventoryPhoto = {
      id: photoId,
      productId,
      supplierId,
      imageUrl,
      capturedAt: new Date().toISOString(),
      gpsLocation,
      deviceInfo,
      verificationStatus: aiAnalysis.retailStoreDetected ? "flagged" : "pending",
      aiAnalysis: {
        isRealTime: true,
        duplicateScore: aiAnalysis.duplicateScore,
        retailStoreDetected: aiAnalysis.retailStoreDetected,
        confidence: aiAnalysis.confidence
      }
    };
    
    mockLivePhotos.push(newPhoto);
    
    const response: ApiResponse<LiveInventoryPhoto> = {
      success: true,
      data: newPhoto,
      message: newPhoto.verificationStatus === "flagged" 
        ? "Photo uploaded but flagged for review" 
        : "Photo uploaded successfully"
    };
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to upload live photo"
    });
  }
};

// POST /api/verification/analyze-image - Run AI analysis on image
export const analyzeImage: RequestHandler = async (req, res) => {
  try {
    const { imageUrl, type, supplierId, productId } = req.body as ImageVerificationRequest;
    
    // Mock AI analysis (in production, use actual ML models)
    const analysis = await runImageAnalysis(imageUrl, type);
    
    const result: ImageAnalysisResult = {
      imageId: `analysis${Date.now()}`,
      analysis,
      createdAt: new Date().toISOString()
    };
    
    const response: ApiResponse<ImageAnalysisResult> = {
      success: true,
      data: result
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to analyze image"
    });
  }
};

// GET /api/verification/documents/:supplierId - Get supplier documents
export const getSupplierDocuments: RequestHandler = (req, res) => {
  try {
    const { supplierId } = req.params;
    
    // In production, filter by supplierId from database
    const documents = mockDocuments.filter(doc => 
      req.query.all === 'true' || Math.random() > 0.5 // Mock filter
    );
    
    const response: ApiResponse<UploadedDocument[]> = {
      success: true,
      data: documents
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch documents"
    });
  }
};

// GET /api/verification/live-photos/:supplierId - Get supplier live photos
export const getSupplierLivePhotos: RequestHandler = (req, res) => {
  try {
    const { supplierId } = req.params;
    
    // In production, filter by supplierId from database
    const photos = mockLivePhotos.filter(photo => 
      photo.supplierId === supplierId || req.query.all === 'true'
    );
    
    const response: ApiResponse<LiveInventoryPhoto[]> = {
      success: true,
      data: photos
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch live photos"
    });
  }
};

// GET /api/verification/pending-reviews - Get pending verification items (admin)
export const getPendingReviews: RequestHandler = (req, res) => {
  try {
    const pendingDocuments = mockDocuments.filter(doc => doc.verificationStatus === 'pending');
    const pendingPhotos = mockLivePhotos.filter(photo => photo.verificationStatus === 'pending');
    const flaggedPhotos = mockLivePhotos.filter(photo => photo.verificationStatus === 'flagged');
    
    const response: ApiResponse<{
      documents: UploadedDocument[];
      livePhotos: LiveInventoryPhoto[];
      flaggedPhotos: LiveInventoryPhoto[];
    }> = {
      success: true,
      data: {
        documents: pendingDocuments,
        livePhotos: pendingPhotos,
        flaggedPhotos: flaggedPhotos
      }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch pending reviews"
    });
  }
};

// POST /api/verification/verify-document - Verify document (admin)
export const verifyDocument: RequestHandler = (req, res) => {
  try {
    const { documentId, status, reason } = req.body as VerifyDocumentRequest;
    
    const docIndex = mockDocuments.findIndex(doc => doc.id === documentId);
    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Document not found"
      });
    }
    
    mockDocuments[docIndex].verificationStatus = status;
    if (reason) {
      mockDocuments[docIndex].rejectionReason = reason;
    }
    
    const response: ApiResponse<UploadedDocument> = {
      success: true,
      data: mockDocuments[docIndex],
      message: `Document ${status} successfully`
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to verify document"
    });
  }
};

// POST /api/verification/verify-live-photo - Verify live photo (admin)
export const verifyLivePhoto: RequestHandler = (req, res) => {
  try {
    const { photoId, status, reason } = req.body as VerifyLivePhotoRequest;
    
    const photoIndex = mockLivePhotos.findIndex(photo => photo.id === photoId);
    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Photo not found"
      });
    }
    
    mockLivePhotos[photoIndex].verificationStatus = status;
    
    const response: ApiResponse<LiveInventoryPhoto> = {
      success: true,
      data: mockLivePhotos[photoIndex],
      message: `Photo ${status} successfully`
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to verify photo"
    });
  }
};

// Helper functions
function getDocumentMimeType(type: DocumentType): string {
  const mimeTypes: Record<DocumentType, string> = {
    purchase_bill: "application/pdf",
    mandi_receipt: "image/jpeg",
    harvest_log: "application/pdf",
    business_license: "application/pdf",
    identity_proof: "image/jpeg",
    food_safety_cert: "application/pdf"
  };
  return mimeTypes[type] || "application/octet-stream";
}

async function runAIImageAnalysis(imageData: string, type: string): Promise<any> {
  // Mock AI analysis - in production, use actual ML models
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time

  return {
    duplicateScore: Math.random() * 0.3, // Low chance of duplicate
    retailStoreDetected: Math.random() < 0.1, // 10% chance of retail store detection
    confidence: 0.85 + Math.random() * 0.1 // 85-95% confidence
  };
}

async function runImageAnalysis(imageUrl: string, type: string): Promise<any> {
  // Mock comprehensive AI analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const isDuplicate = Math.random() < 0.05; // 5% chance
  const retailStoreDetected = Math.random() < 0.08; // 8% chance
  const stockPhotoLikelihood = Math.random() * 0.3; // 0-30%
  
  return {
    isDuplicate,
    duplicateScore: isDuplicate ? 0.8 + Math.random() * 0.2 : Math.random() * 0.3,
    retailStoreDetected,
    stockPhotoLikelihood,
    inappropriateContent: false,
    confidence: 0.82 + Math.random() * 0.15,
    flags: [
      ...(isDuplicate ? ["duplicate"] : []),
      ...(retailStoreDetected ? ["retail_store"] : []),
      ...(stockPhotoLikelihood > 0.7 ? ["stock_photo"] : [])
    ]
  };
}
