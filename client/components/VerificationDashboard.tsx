import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Camera, 
  Shield, 
  AlertTriangle, 
  Check, 
  X,
  Eye,
  MapPin,
  Clock,
  Zap,
  TrendingUp
} from "lucide-react";
import type { 
  ApiResponse, 
  UploadedDocument, 
  LiveInventoryPhoto, 
  VerifyDocumentRequest,
  VerifyLivePhotoRequest 
} from "@shared/api";

interface PendingReviews {
  documents: UploadedDocument[];
  livePhotos: LiveInventoryPhoto[];
  flaggedPhotos: LiveInventoryPhoto[];
}

export function VerificationDashboard() {
  const [pendingReviews, setPendingReviews] = useState<PendingReviews>({
    documents: [],
    livePhotos: [],
    flaggedPhotos: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<LiveInventoryPhoto | null>(null);
  const [reviewReason, setReviewReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/verification/pending-reviews');
      const data: ApiResponse<PendingReviews> = await response.json();
      
      if (data.success && data.data) {
        setPendingReviews(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyDocument = async (documentId: string, status: 'verified' | 'rejected') => {
    try {
      setSubmitting(true);
      
      const requestData: VerifyDocumentRequest = {
        documentId,
        status,
        reason: status === 'rejected' ? reviewReason : undefined
      };

      const response = await fetch('/api/verification/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data: ApiResponse<UploadedDocument> = await response.json();
      
      if (data.success) {
        await fetchPendingReviews();
        setSelectedDocument(null);
        setReviewReason("");
      }
    } catch (error) {
      console.error('Failed to verify document:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyLivePhoto = async (photoId: string, status: 'verified' | 'flagged' | 'rejected') => {
    try {
      setSubmitting(true);
      
      const requestData: VerifyLivePhotoRequest = {
        photoId,
        status,
        reason: status !== 'verified' ? reviewReason : undefined
      };

      const response = await fetch('/api/verification/verify-live-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data: ApiResponse<LiveInventoryPhoto> = await response.json();
      
      if (data.success) {
        await fetchPendingReviews();
        setSelectedPhoto(null);
        setReviewReason("");
      }
    } catch (error) {
      console.error('Failed to verify photo:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      purchase_bill: 'Purchase Bill',
      mandi_receipt: 'Mandi Receipt',
      harvest_log: 'Harvest Log',
      business_license: 'Business License',
      identity_proof: 'Identity Proof',
      food_safety_cert: 'Food Safety Certificate'
    };
    return labels[type] || type;
  };

  const formatLocation = (location?: { latitude: number; longitude: number }) => {
    if (!location) return 'No location data';
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{pendingReviews.documents.length}</div>
                <div className="text-sm text-gray-600">Pending Documents</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{pendingReviews.livePhotos.length}</div>
                <div className="text-sm text-gray-600">Live Photos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{pendingReviews.flaggedPhotos.length}</div>
                <div className="text-sm text-gray-600">Flagged Photos</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm text-gray-600">Authenticity Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authenticity Verification Dashboard
          </CardTitle>
          <CardDescription>
            Review and verify supplier documents and live inventory photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents">
                Documents ({pendingReviews.documents.length})
              </TabsTrigger>
              <TabsTrigger value="photos">
                Live Photos ({pendingReviews.livePhotos.length})
              </TabsTrigger>
              <TabsTrigger value="flagged">
                Flagged ({pendingReviews.flaggedPhotos.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="space-y-4">
              {pendingReviews.documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents pending review</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingReviews.documents.map((doc) => (
                    <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{getDocumentTypeLabel(doc.type)}</CardTitle>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {doc.fileName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-xs">
                          <div>Size: {(doc.metadata?.fileSize || 0 / 1024 / 1024).toFixed(2)} MB</div>
                          <div>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                        </div>
                        <Button 
                          onClick={() => setSelectedDocument(doc)}
                          size="sm" 
                          className="w-full mt-3"
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          Review
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              {pendingReviews.livePhotos.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No live photos pending review</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingReviews.livePhotos.map((photo) => (
                    <Card key={photo.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Live Inventory Photo</CardTitle>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <img 
                            src={photo.imageUrl} 
                            alt="Live inventory" 
                            className="w-full h-32 object-cover rounded"
                          />
                          <div className="text-xs space-y-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(photo.capturedAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {formatLocation(photo.gpsLocation)}
                            </div>
                            {photo.aiAnalysis && (
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                Confidence: {Math.round(photo.aiAnalysis.confidence * 100)}%
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          onClick={() => setSelectedPhoto(photo)}
                          size="sm" 
                          className="w-full mt-3"
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          Review
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="flagged" className="space-y-4">
              {pendingReviews.flaggedPhotos.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No flagged photos to review</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingReviews.flaggedPhotos.map((photo) => (
                    <Card key={photo.id} className="border-orange-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">Flagged Photo</CardTitle>
                          <Badge className="bg-orange-100 text-orange-800">Flagged</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <img 
                            src={photo.imageUrl} 
                            alt="Flagged content" 
                            className="w-full h-32 object-cover rounded"
                          />
                          {photo.aiAnalysis && (
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                {photo.aiAnalysis.retailStoreDetected && "Retail store detected. "}
                                {photo.aiAnalysis.duplicateScore > 0.7 && "Possible duplicate image. "}
                                Confidence: {Math.round(photo.aiAnalysis.confidence * 100)}%
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        <Button 
                          onClick={() => setSelectedPhoto(photo)}
                          size="sm" 
                          className="w-full mt-3"
                          variant="outline"
                        >
                          <Eye className="mr-2 h-3 w-3" />
                          Review
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Review Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Document</DialogTitle>
            <DialogDescription>
              Verify the authenticity of this supplier document
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Type: {getDocumentTypeLabel(selectedDocument.type)}</div>
                <div>File: {selectedDocument.fileName}</div>
                <div>Size: {(selectedDocument.metadata?.fileSize || 0 / 1024 / 1024).toFixed(2)} MB</div>
                <div>Uploaded: {new Date(selectedDocument.uploadedAt).toLocaleDateString()}</div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-center text-gray-600">
                  Document preview would be displayed here
                  <br />
                  <a 
                    href={selectedDocument.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View full document
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reason (if rejecting):</label>
                <Textarea
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => verifyDocument(selectedDocument.id, 'verified')}
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  onClick={() => verifyDocument(selectedDocument.id, 'rejected')}
                  disabled={submitting || !reviewReason.trim()}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Review Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Live Photo</DialogTitle>
            <DialogDescription>
              Verify the authenticity of this live inventory photo
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src={selectedPhoto.imageUrl} 
                  alt="Live inventory" 
                  className="w-full rounded-lg"
                />
                <div className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {new Date(selectedPhoto.capturedAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {formatLocation(selectedPhoto.gpsLocation)}
                    </div>
                  </div>

                  {selectedPhoto.aiAnalysis && (
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <h4 className="font-medium mb-2">AI Analysis</h4>
                      <div className="text-sm space-y-1">
                        <div>Confidence: {Math.round(selectedPhoto.aiAnalysis.confidence * 100)}%</div>
                        <div>Duplicate Score: {Math.round(selectedPhoto.aiAnalysis.duplicateScore * 100)}%</div>
                        <div>Retail Store: {selectedPhoto.aiAnalysis.retailStoreDetected ? 'Detected' : 'Not detected'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reason (if flagging/rejecting):</label>
                <Textarea
                  value={reviewReason}
                  onChange={(e) => setReviewReason(e.target.value)}
                  placeholder="Provide a reason..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => verifyLivePhoto(selectedPhoto.id, 'verified')}
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  onClick={() => verifyLivePhoto(selectedPhoto.id, 'flagged')}
                  disabled={submitting}
                  variant="outline"
                  className="flex-1"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Flag
                </Button>
                <Button 
                  onClick={() => verifyLivePhoto(selectedPhoto.id, 'rejected')}
                  disabled={submitting}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
