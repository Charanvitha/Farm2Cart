import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DocumentUpload } from "@/components/DocumentUpload";
import { LivePhotoCapture } from "@/components/LivePhotoCapture";
import { VerificationDashboard } from "@/components/VerificationDashboard";
import {
  ShoppingCart,
  Shield,
  FileText,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Zap,
} from "lucide-react";
import type {
  UploadedDocument,
  LiveInventoryPhoto,
  ProductWithSupplier,
} from "@shared/api";

export default function SupplierVerification() {
  const [userRole] = useState<"supplier" | "admin">("supplier"); // In real app, get from auth
  const [supplierId] = useState("sup1"); // In real app, get from auth
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [livePhotos, setLivePhotos] = useState<LiveInventoryPhoto[]>([]);
  const [products, setProducts] = useState<ProductWithSupplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === "supplier") {
      fetchSupplierData();
    }
  }, [userRole, supplierId]);

  const fetchSupplierData = async () => {
    try {
      setLoading(true);

      // Fetch documents
      const docsResponse = await fetch(
        `/api/verification/documents/${supplierId}?all=true`,
      );
      const docsData = await docsResponse.json();
      if (docsData.success) {
        setDocuments(docsData.data || []);
      }

      // Fetch live photos
      const photosResponse = await fetch(
        `/api/verification/live-photos/${supplierId}`,
      );
      const photosData = await photosResponse.json();
      if (photosData.success) {
        setLivePhotos(photosData.data || []);
      }

      // Fetch products
      const productsResponse = await fetch(
        `/api/products?supplierId=${supplierId}`,
      );
      const productsData = await productsResponse.json();
      if (productsData.success) {
        setProducts(productsData.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch supplier data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUploaded = (document: UploadedDocument) => {
    setDocuments((prev) => [...prev, document]);
  };

  const handlePhotoUploaded = (photo: LiveInventoryPhoto) => {
    setLivePhotos((prev) => [...prev, photo]);
  };

  const getVerificationScore = () => {
    const totalDocuments = documents.length;
    const verifiedDocuments = documents.filter(
      (doc) => doc.verificationStatus === "verified",
    ).length;
    const totalPhotos = livePhotos.length;
    const verifiedPhotos = livePhotos.filter(
      (photo) => photo.verificationStatus === "verified",
    ).length;

    if (totalDocuments === 0 && totalPhotos === 0) return 0;

    const score =
      ((verifiedDocuments + verifiedPhotos) / (totalDocuments + totalPhotos)) *
      100;
    return Math.round(score);
  };

  const getVerificationStatus = () => {
    const score = getVerificationScore();
    if (score >= 80)
      return {
        status: "verified",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    if (score >= 50)
      return {
        status: "partial",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      };
    return {
      status: "pending",
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
    };
  };

  if (userRole === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-farm-50 to-fresh-50">
        {/* Header */}
        <header className="border-b border-farm-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-farm-600 p-2 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-farm-800">
                Farm2Cart
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className="bg-purple-100 text-purple-800">
                Admin Panel
              </Badge>
              <Link to="/admin">
                <Button
                  variant="ghost"
                  className="text-farm-700 hover:text-farm-800 hover:bg-farm-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <VerificationDashboard />
      </div>
    );
  }

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;

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
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800">Supplier Portal</Badge>
            <Link to="/supplier">
              <Button
                variant="ghost"
                className="text-farm-700 hover:text-farm-800 hover:bg-farm-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Verification Status Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Supplier Authenticity Verification
                </CardTitle>
                <CardDescription>
                  Verify your business authenticity to build trust with vendors
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon className="h-5 w-5" />
                  <Badge className={verificationStatus.color}>
                    {verificationStatus.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-farm-600">
                  {getVerificationScore()}% Verified
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Authenticity Requirements Alert */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>🔍 Authenticity Requirements:</strong> To ensure genuine
            products, we require bills/receipts (not from retail stores like
            D-Mart) and real-time inventory photos with GPS verification. This
            helps us maintain trust and authenticity in our marketplace.
          </AlertDescription>
        </Alert>

        {/* Verification Tabs */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents ({documents.length})
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Live Photos ({livePhotos.length})
            </TabsTrigger>
            <TabsTrigger
              value="ai-analysis"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <DocumentUpload
              supplierId={supplierId}
              onDocumentUploaded={handleDocumentUploaded}
              existingDocuments={documents}
            />
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            {products.length > 0 ? (
              <div className="space-y-6">
                {products.map((product) => (
                  <LivePhotoCapture
                    key={product.id}
                    productId={product.id}
                    supplierId={supplierId}
                    productName={product.name}
                    onPhotoUploaded={handlePhotoUploaded}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    You need to add products before you can upload live
                    inventory photos
                  </p>
                  <Link to="/supplier/products">
                    <Button>Add Products</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Existing Live Photos */}
            {livePhotos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Live Photos</CardTitle>
                  <CardDescription>
                    Track the verification status of your live inventory photos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {livePhotos.map((photo) => (
                      <div key={photo.id} className="border rounded-lg p-3">
                        <img
                          src={photo.imageUrl}
                          alt="Live inventory"
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge
                              className={
                                photo.verificationStatus === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : photo.verificationStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : photo.verificationStatus === "flagged"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                              }
                            >
                              {photo.verificationStatus}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(photo.capturedAt).toLocaleDateString()}
                          </div>
                          {photo.aiAnalysis && (
                            <div className="text-xs">
                              Authenticity:{" "}
                              {Math.round(photo.aiAnalysis.confidence * 100)}%
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ai-analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AI Image Analysis & Anti-Fraud Detection
                </CardTitle>
                <CardDescription>
                  Our AI system automatically analyzes all uploaded images for
                  authenticity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        95%
                      </div>
                      <div className="text-sm text-gray-600">
                        Authenticity Score
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        0
                      </div>
                      <div className="text-sm text-gray-600">
                        Duplicate Images
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        0
                      </div>
                      <div className="text-sm text-gray-600">
                        Retail Store Detections
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">AI Detection Features:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Duplicate image detection
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Retail store shelf detection
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Stock photo identification
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          GPS location verification
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Real-time capture validation
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Timestamp watermark analysis
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Our AI system automatically flags suspicious content and
                    images that appear to be from retail stores or duplicated
                    from the internet. This helps maintain the authenticity and
                    trustworthiness of our marketplace.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
