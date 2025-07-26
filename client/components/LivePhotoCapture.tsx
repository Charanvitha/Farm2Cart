import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Camera, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  AlertTriangle,
  Upload,
  Loader2
} from "lucide-react";
import type { LivePhotoRequest, ApiResponse, LiveInventoryPhoto } from "@shared/api";

interface LivePhotoCaptureProps {
  productId: string;
  supplierId: string;
  productName: string;
  onPhotoUploaded?: (photo: LiveInventoryPhoto) => void;
  className?: string;
}

export function LivePhotoCapture({ 
  productId, 
  supplierId, 
  productName, 
  onPhotoUploaded,
  className 
}: LivePhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<LiveInventoryPhoto | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError("");
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
      
      // Request location permission
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => setLocation(position),
          (error) => console.warn('Location access denied:', error),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    } catch (error) {
      setError("Camera access denied. Please allow camera permissions and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0);
    
    // Add watermark with timestamp and location
    addWatermark(context, canvas.width, canvas.height);
    
    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  }, [stopCamera]);

  const addWatermark = (context: CanvasRenderingContext2D, width: number, height: number) => {
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const locationText = location 
      ? `GPS: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`
      : 'GPS: Location not available';
    
    // Set watermark style
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, height - 80, width, 80);
    
    context.fillStyle = 'white';
    context.font = '16px Arial';
    context.fillText(`📅 ${timestamp}`, 10, height - 50);
    context.fillText(`📍 ${locationText}`, 10, height - 25);
    context.fillText(`🏷️ Product: ${productName}`, 10, height - 5);
  };

  const uploadPhoto = async () => {
    if (!capturedImage) return;
    
    try {
      setUploading(true);
      setError("");
      
      const requestData: LivePhotoRequest = {
        productId,
        supplierId,
        imageData: capturedImage,
        gpsLocation: location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        } : undefined,
        deviceInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      
      const response = await fetch('/api/verification/live-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const data: ApiResponse<LiveInventoryPhoto> = await response.json();
      
      if (data.success && data.data) {
        setSuccess(data.data);
        onPhotoUploaded?.(data.data);
        setCapturedImage(null);
      } else {
        setError(data.error || "Failed to upload photo");
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setError("");
    startCamera();
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (success) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Photo Uploaded Successfully</CardTitle>
          </div>
          <CardDescription>
            Your live inventory photo has been submitted for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getVerificationStatusColor(success.verificationStatus)}>
                {success.verificationStatus.replace('_', ' ')}
              </Badge>
              {success.verificationStatus === 'flagged' && (
                <span className="text-sm text-orange-600">
                  Photo flagged for manual review
                </span>
              )}
            </div>
            
            {success.aiAnalysis && (
              <div className="space-y-2">
                <p className="text-sm font-medium">AI Analysis Results:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Authenticity Score: {Math.round(success.aiAnalysis.confidence * 100)}%</div>
                  <div>Duplicate Score: {Math.round(success.aiAnalysis.duplicateScore * 100)}%</div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => setSuccess(null)} 
              variant="outline" 
              className="w-full"
            >
              Take Another Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Live Inventory Photo
        </CardTitle>
        <CardDescription>
          Take a real-time photo of your {productName} inventory to verify authenticity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isStreaming && !capturedImage && (
            <div className="text-center space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center">
                <Camera className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Click below to start your camera and take a live photo
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Auto timestamp watermark</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>GPS location tagging</span>
                  </div>
                </div>
              </div>
              <Button onClick={startCamera} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            </div>
          )}
          
          {isStreaming && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  LIVE - {new Date().toLocaleTimeString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured inventory" 
                  className="w-full rounded-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={uploadPhoto} 
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </Button>
                <Button onClick={retakePhoto} variant="outline">
                  Retake
                </Button>
              </div>
            </div>
          )}
          
          <canvas 
            ref={canvasRef} 
            className="hidden" 
          />
        </div>
      </CardContent>
    </Card>
  );
}
