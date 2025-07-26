import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Upload,
  X,
  Check,
  AlertTriangle,
  Loader2,
  Eye,
  Download,
} from "lucide-react";
import type {
  DocumentUploadRequest,
  ApiResponse,
  UploadedDocument,
  DocumentType,
} from "@shared/api";

interface DocumentUploadProps {
  supplierId: string;
  onDocumentUploaded?: (document: UploadedDocument) => void;
  existingDocuments?: UploadedDocument[];
  className?: string;
}

const documentTypes: {
  value: DocumentType;
  label: string;
  description: string;
  acceptedBy: string[];
}[] = [
  {
    value: "purchase_bill",
    label: "Purchase Bill/Invoice",
    description: "Bills from wholesalers, mandis, or suppliers",
    acceptedBy: ["wholesaler", "home_producer"],
  },
  {
    value: "mandi_receipt",
    label: "Mandi Receipt",
    description: "Official receipts from agricultural markets",
    acceptedBy: ["farmer", "wholesaler"],
  },
  {
    value: "harvest_log",
    label: "Harvest Log",
    description: "Documentation of harvest dates and quantities",
    acceptedBy: ["farmer"],
  },
  {
    value: "business_license",
    label: "Business License",
    description: "Official business registration documents",
    acceptedBy: ["wholesaler", "home_producer"],
  },
  {
    value: "identity_proof",
    label: "Identity Proof",
    description: "Aadhar card, PAN card, or other ID documents",
    acceptedBy: ["farmer", "wholesaler", "home_producer"],
  },
  {
    value: "food_safety_cert",
    label: "Food Safety Certificate",
    description: "FSSAI license or food safety certification",
    acceptedBy: ["home_producer", "wholesaler"],
  },
];

export function DocumentUpload({
  supplierId,
  onDocumentUploaded,
  existingDocuments = [],
  className,
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<UploadedDocument | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, JPG, and PNG files are allowed");
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const uploadDocument = async () => {
    if (!selectedFile || !documentType) {
      setError("Please select a file and document type");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // Convert file to base64 for demo (in production, use FormData)
      const base64 = await fileToBase64(selectedFile);

      const requestData: DocumentUploadRequest = {
        type: documentType,
        supplierId,
        file: base64,
        metadata: {
          originalName: selectedFile.name,
          description: description.trim() || undefined,
        },
      };

      const response = await fetch("/api/verification/upload-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data: ApiResponse<UploadedDocument> = await response.json();

      if (data.success && data.data) {
        setSuccess(data.data);
        onDocumentUploaded?.(data.data);
        resetForm();
      } else {
        setError(data.error || "Failed to upload document");
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentType("");
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="h-4 w-4" />;
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (success) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">
              Document Uploaded Successfully
            </CardTitle>
          </div>
          <CardDescription>
            Your document has been submitted for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{success.fileName}</span>
              <Badge
                className={getVerificationStatusColor(
                  success.verificationStatus,
                )}
              >
                {success.verificationStatus}
              </Badge>
            </div>
            <Button
              onClick={() => setSuccess(null)}
              variant="outline"
              className="w-full"
            >
              Upload Another Document
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Upload Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Verification Documents
          </CardTitle>
          <CardDescription>
            Upload bills, receipts, and certificates to verify the authenticity
            of your products
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

            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={documentType}
                onValueChange={(value) =>
                  setDocumentType(value as DocumentType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-gray-500">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file">Choose File</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: PDF, JPG, PNG (max 10MB)
              </p>
            </div>

            {selectedFile && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="text-sm text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional notes about this document..."
                rows={3}
              />
            </div>

            <Button
              onClick={uploadDocument}
              disabled={!selectedFile || !documentType || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Documents */}
      {existingDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Track the verification status of your submitted documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getVerificationIcon(doc.verificationStatus)}
                    <div>
                      <div className="font-medium">{doc.fileName}</div>
                      <div className="text-sm text-gray-500">
                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={getVerificationStatusColor(
                        doc.verificationStatus,
                      )}
                    >
                      {doc.verificationStatus}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
