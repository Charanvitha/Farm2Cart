import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VerificationBadge, TrustScore } from "@/components/ui/verification-badge";
import {
  Truck,
  Leaf,
  ShoppingCart,
  Users,
  Shield,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  TrendingUp,
  Heart,
  Zap,
  Package
} from "lucide-react";

export default function Index() {
  const benefits = [
    {
      icon: <Truck className="h-8 w-8 text-farm-600" />,
      title: "Direct Sourcing",
      description: "Connect directly with farmers, wholesalers, and home producers. Cut out middlemen and get better prices."
    },
    {
      icon: <Shield className="h-8 w-8 text-farm-600" />,
      title: "Verified Suppliers",
      description: "All suppliers are verified with receipts, photos, and trust scores. Shop with confidence."
    },
    {
      icon: <Clock className="h-8 w-8 text-farm-600" />,
      title: "Real-time Inventory",
      description: "See live product availability and place orders instantly. Never run out of ingredients again."
    },
    {
      icon: <Star className="h-8 w-8 text-farm-600" />,
      title: "Quality Assured",
      description: "Rate and review suppliers. Trust badges ensure you're getting the best quality ingredients."
    }
  ];

  const supplierTypes = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Local Farmers",
      description: "Fresh vegetables, fruits, and grains",
      badge: "Farm Fresh"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Wholesalers", 
      description: "Bulk oils, spices, and packaging",
      badge: "Bulk Deals"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Home Producers",
      description: "Homemade masalas, pickles, and dairy",
      badge: "Artisan Made"
    }
  ];

  const stats = [
    { number: "500+", label: "Verified Suppliers" },
    { number: "1000+", label: "Street Food Vendors" },
    { number: "50+", label: "Product Categories" },
    { number: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-50 to-fresh-50">
      {/* Header */}
      <header className="border-b border-farm-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-farm-600 p-2 rounded-xl">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-farm-800">Farm2Cart</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#how-it-works" className="text-farm-700 hover:text-farm-800 transition-colors">How it Works</a>
            <a href="#suppliers" className="text-farm-700 hover:text-farm-800 transition-colors">Suppliers</a>
            <a href="#benefits" className="text-farm-700 hover:text-farm-800 transition-colors">Benefits</a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="ghost" className="text-farm-700 hover:text-farm-800 hover:bg-farm-100">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-farm-600 hover:bg-farm-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-farm-100 text-farm-800 border-farm-300">
            🌱 Empowering Street Food Vendors
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-farm-900 mb-6 leading-tight">
            Source Fresh Ingredients
            <br />
            <span className="text-farm-600">Directly from Farmers</span>
          </h1>
          <p className="text-xl text-farm-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with verified local farmers, wholesalers, and home producers. 
            Get the freshest vegetables, oils, masalas, and packaging materials 
            for your street food business at the best prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register?role=vendor">
              <Button size="lg" className="bg-farm-600 hover:bg-farm-700 text-white px-8 py-4 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Join as Vendor
              </Button>
            </Link>
            <Link to="/register?role=supplier">
              <Button size="lg" variant="outline" className="border-farm-600 text-farm-600 hover:bg-farm-50 px-8 py-4 text-lg">
                <Leaf className="mr-2 h-5 w-5" />
                Become a Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-farm-600 mb-2">{stat.number}</div>
                <div className="text-farm-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supplier Types */}
      <section id="suppliers" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-farm-900 mb-4">
              Three Types of Trusted Suppliers
            </h2>
            <p className="text-xl text-farm-700 max-w-2xl mx-auto">
              Choose from our network of verified suppliers, each specializing in different product categories
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {supplierTypes.map((supplier, index) => (
              <Card key={index} className="border-farm-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-farm-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {supplier.icon}
                  </div>
                  <Badge variant="secondary" className="mb-2 bg-fresh-100 text-fresh-800">
                    {supplier.badge}
                  </Badge>
                  <CardTitle className="text-farm-800">{supplier.title}</CardTitle>
                  <CardDescription className="text-farm-600">
                    {supplier.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 bg-farm-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-farm-900 mb-4">
              Why Choose Farm2Cart?
            </h2>
            <p className="text-xl text-farm-700 max-w-2xl mx-auto">
              We're revolutionizing how street food vendors source their ingredients
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-farm-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-farm-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-farm-800 text-lg">{benefit.title}</CardTitle>
                  <CardDescription className="text-farm-600">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-farm-900 mb-4">
              How Farm2Cart Works
            </h2>
            <p className="text-xl text-farm-700 max-w-2xl mx-auto">
              Getting started is simple and straightforward
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-farm-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-farm-800 mb-2">Sign Up</h3>
              <p className="text-farm-600">Register as a vendor or supplier with your business details</p>
            </div>
            <div className="text-center">
              <div className="bg-farm-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-farm-800 mb-2">Browse & Connect</h3>
              <p className="text-farm-600">Explore verified suppliers and their real-time inventory</p>
            </div>
            <div className="text-center">
              <div className="bg-farm-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-farm-800 mb-2">Order & Grow</h3>
              <p className="text-farm-600">Place orders, track delivery, and grow your business</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-farm-900 mb-4">
              Trusted Verified Suppliers
            </h2>
            <p className="text-xl text-farm-700 max-w-2xl mx-auto">
              Meet some of our top-rated suppliers who are ready to serve your business
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeaturedSupplierCard
              name="Green Valley Farms"
              location="Punjab, India"
              type="farmer"
              trustScore={4.8}
              totalOrders={156}
              badges={["Organic Certified", "Fresh Produce"]}
              specialties="Fresh vegetables, fruits, organic produce"
            />
            <FeaturedSupplierCard
              name="Spice Masters Ltd"
              location="Kerala, India"
              type="wholesaler"
              trustScore={4.6}
              totalOrders={89}
              badges={["Bulk Supplier", "Quality Assured"]}
              specialties="Spices, oils, bulk commodities"
            />
            <FeaturedSupplierCard
              name="Amma's Kitchen"
              location="Tamil Nadu, India"
              type="home_producer"
              trustScore={4.9}
              totalOrders={34}
              badges={["Home Made", "Traditional Recipes"]}
              specialties="Homemade masalas, pickles, dairy"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-farm-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-farm-900 mb-4">
              Fresh Products Available Now
            </h2>
            <p className="text-xl text-farm-700 max-w-2xl mx-auto">
              Browse our latest offerings from verified suppliers
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <FeaturedProductCard
              name="Fresh Tomatoes"
              price={45}
              unit="kg"
              supplier="Green Valley Farms"
              supplierType="farmer"
              trustScore={4.8}
              image="https://images.unsplash.com/photo-1546470427-e26264be0b0c?w=400"
              category="vegetables"
            />
            <FeaturedProductCard
              name="Premium Cooking Oil"
              price={150}
              unit="liter"
              supplier="Spice Masters Ltd"
              supplierType="wholesaler"
              trustScore={4.6}
              image="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"
              category="oils"
            />
            <FeaturedProductCard
              name="Garam Masala"
              price={280}
              unit="kg"
              supplier="Amma's Kitchen"
              supplierType="home_producer"
              trustScore={4.9}
              image="https://images.unsplash.com/photo-1596040033229-a9821ebc227e?w=400"
              category="spices"
            />
            <FeaturedProductCard
              name="Fresh Onions"
              price={35}
              unit="kg"
              supplier="Green Valley Farms"
              supplierType="farmer"
              trustScore={4.8}
              image="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400"
              category="vegetables"
            />
          </div>
          <div className="text-center mt-12">
            <Link to="/login">
              <Button size="lg" className="bg-farm-600 hover:bg-farm-700 text-white px-8 py-4">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-farm-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-farm-100 mb-10 max-w-2xl mx-auto">
            Join thousands of vendors and suppliers who are already benefiting from direct sourcing
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register?role=vendor">
              <Button size="lg" variant="secondary" className="bg-white text-farm-600 hover:bg-farm-50 px-8 py-4 text-lg">
                <Zap className="mr-2 h-5 w-5" />
                Start Sourcing Today
              </Button>
            </Link>
            <Link to="/register?role=supplier">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-farm-700 px-8 py-4 text-lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Sell Your Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-farm-900 text-farm-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-farm-600 p-2 rounded-xl">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Farm2Cart</span>
              </div>
              <p className="text-farm-300">
                Connecting street food vendors with local farmers and suppliers for a better future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-farm-300">
                <li><Link to="/vendors" className="hover:text-white transition-colors">Browse Suppliers</Link></li>
                <li><Link to="/vendors/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
                <li><Link to="/vendors/help" className="hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-farm-300">
                <li><Link to="/suppliers" className="hover:text-white transition-colors">List Products</Link></li>
                <li><Link to="/suppliers/verification" className="hover:text-white transition-colors">Get Verified</Link></li>
                <li><Link to="/suppliers/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-farm-300">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-farm-800 mt-8 pt-8 text-center text-farm-400">
            <p>&copy; 2024 Farm2Cart. All rights reserved. Empowering street food vendors across India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
