import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function PlaceholderPage({
  title,
  description,
  icon = <Construction className="h-8 w-8 text-farm-600" />,
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-50 to-fresh-50">
      {/* Header */}
      <header className="border-b border-farm-200 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-farm-600 p-2 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-farm-800">Farm2Cart</span>
          </Link>
          <Link to="/">
            <Button
              variant="ghost"
              className="text-farm-700 hover:text-farm-800 hover:bg-farm-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Card className="max-w-md text-center border-farm-200 shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-farm-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              {icon}
            </div>
            <CardTitle className="text-2xl text-farm-900">{title}</CardTitle>
            <CardDescription className="text-farm-600 text-lg">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-farm-700 mb-6">
              This page is coming soon! We're working hard to bring you the best
              experience.
            </p>
            <div className="space-y-3">
              <Link to="/">
                <Button className="w-full bg-farm-600 hover:bg-farm-700 text-white">
                  Go to Homepage
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full border-farm-600 text-farm-600 hover:bg-farm-50"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
