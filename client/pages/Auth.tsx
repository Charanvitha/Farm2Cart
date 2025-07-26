import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Users,
  Leaf,
  Settings,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building,
} from "lucide-react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<string>(
    searchParams.get("role") || "vendor",
  );
  const [isLogin, setIsLogin] = useState(true);

  const roles = [
    {
      id: "vendor",
      title: "Street Food Vendor",
      description: "Source ingredients for your food business",
      icon: <Users className="h-6 w-6" />,
      color: "bg-farm-600",
    },
    {
      id: "supplier",
      title: "Supplier",
      description: "Sell your products to local vendors",
      icon: <Leaf className="h-6 w-6" />,
      color: "bg-fresh-600",
    },
    {
      id: "admin",
      title: "Admin",
      description: "Manage platform operations",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-gray-600",
    },
  ];

  const currentRole =
    roles.find((role) => role.id === selectedRole) || roles[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log("Form submitted for role:", selectedRole);
    console.log("Is login:", isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-50 to-fresh-50 flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center space-x-2 text-farm-800 hover:text-farm-900 transition-colors"
        >
          <div className="bg-farm-600 p-2 rounded-xl">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Farm2Cart</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <Card className="border-farm-200 shadow-lg">
          <CardHeader className="text-center">
            <div
              className={`mx-auto ${currentRole.color} p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4`}
            >
              {currentRole.icon}
            </div>
            <CardTitle className="text-2xl text-farm-900">
              {isLogin ? "Welcome Back" : "Join Farm2Cart"}
            </CardTitle>
            <CardDescription className="text-farm-600">
              {isLogin
                ? "Sign in to your account"
                : "Create your account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={isLogin ? "login" : "register"}
              onValueChange={(value) => setIsLogin(value === "login")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Role Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-farm-800 mb-3 block">
                  I am a:
                </Label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedRole === role.id
                          ? "border-farm-600 bg-farm-50 text-farm-800"
                          : "border-farm-200 hover:border-farm-300 hover:bg-farm-25"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`${role.color} p-2 rounded-md text-white`}
                        >
                          {role.icon}
                        </div>
                        <div>
                          <div className="font-medium">{role.title}</div>
                          <div className="text-sm text-farm-600">
                            {role.description}
                          </div>
                        </div>
                        {selectedRole === role.id && (
                          <Badge className="ml-auto bg-farm-600 text-white">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-farm-800">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 border-farm-200 focus:border-farm-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-farm-800">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 border-farm-200 focus:border-farm-600"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-farm-600 hover:bg-farm-700 text-white"
                  >
                    Sign In as {currentRole.title}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-farm-800">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          className="pl-10 border-farm-200 focus:border-farm-600"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-farm-800">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        className="border-farm-200 focus:border-farm-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-farm-800">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 border-farm-200 focus:border-farm-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-farm-800">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10 border-farm-200 focus:border-farm-600"
                        required
                      />
                    </div>
                  </div>

                  {selectedRole !== "admin" && (
                    <>
                      <div>
                        <Label htmlFor="businessName" className="text-farm-800">
                          {selectedRole === "vendor"
                            ? "Business Name"
                            : "Company/Farm Name"}
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                          <Input
                            id="businessName"
                            placeholder={
                              selectedRole === "vendor"
                                ? "Your food business name"
                                : "Your farm/company name"
                            }
                            className="pl-10 border-farm-200 focus:border-farm-600"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location" className="text-farm-800">
                          Location
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                          <Input
                            id="location"
                            placeholder="City, State"
                            className="pl-10 border-farm-200 focus:border-farm-600"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="password" className="text-farm-800">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10 border-farm-200 focus:border-farm-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-farm-800">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-farm-500" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 border-farm-200 focus:border-farm-600"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-farm-600 hover:bg-farm-700 text-white"
                  >
                    Create {currentRole.title} Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-farm-600">
              By continuing, you agree to our{" "}
              <Link
                to="/terms"
                className="text-farm-600 hover:text-farm-800 underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-farm-600 hover:text-farm-800 underline"
              >
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
