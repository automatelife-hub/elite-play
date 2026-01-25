import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, ShoppingCart, TrendingUp, Video, Image as ImageIcon, 
  Code, Megaphone, Shield, BarChart3, Sparkles, Package, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import ServiceCard from "../components/services/ServiceCard";
import OrderServiceDialog from "../components/services/OrderServiceDialog";
import SuggestedBundleCard from "../components/services/SuggestedBundleCard";

export default function ServicesMarketplace() {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [suggestedBundles, setSuggestedBundles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      calculateSuggestedBundles();
    } else {
      setSuggestedBundles([]);
    }
  }, [cart]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const allServices = await base44.entities.ServicePackage.filter({ active: true }, '-featured');
      setServices(allServices);
    } catch (error) {
      console.error("Error loading services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const calculateSuggestedBundles = () => {
    const bundles = [];
    cart.forEach(cartItem => {
      const service = services.find(s => s.id === cartItem);
      if (service?.suggested_with && service.suggested_with.length > 0) {
        service.suggested_with.forEach(suggestedId => {
          if (!cart.includes(suggestedId) && !bundles.find(b => b.id === suggestedId)) {
            const suggestedService = services.find(s => s.id === suggestedId);
            if (suggestedService) {
              bundles.push({
                ...suggestedService,
                bundleDiscount: service.discount_bundle || 15,
                bundledWith: service.name
              });
            }
          }
        });
      }
    });
    setSuggestedBundles(bundles);
  };

  const addToCart = (serviceId) => {
    if (!cart.includes(serviceId)) {
      setCart([...cart, serviceId]);
      toast.success("Added to cart");
    }
  };

  const removeFromCart = (serviceId) => {
    setCart(cart.filter(id => id !== serviceId));
    toast.success("Removed from cart");
  };

  const handleOrder = (service) => {
    setSelectedService(service);
    setShowOrderDialog(true);
  };

  const categories = [
    { id: "all", name: "All Services", icon: Package },
    { id: "agency_management", name: "Agency Management", icon: BarChart3 },
    { id: "growth_optimization", name: "Growth & SEO", icon: TrendingUp },
    { id: "video_production", name: "Video Production", icon: Video },
    { id: "image_editing", name: "Image Editing", icon: ImageIcon },
    { id: "creative_design", name: "Creative Design", icon: Sparkles },
    { id: "website_development", name: "Web Development", icon: Code },
    { id: "consultation", name: "Consultation", icon: Megaphone },
    { id: "compliance_risk", name: "Compliance", icon: Shield }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredServices = filteredServices.filter(s => s.featured);
  const popularServices = filteredServices.filter(s => s.popular);
  const cartTotal = cart.reduce((sum, id) => {
    const service = services.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Services Marketplace</h1>
          <p className="text-gray-400">Professional services to grow your affiliate business</p>
        </div>
        {cart.length > 0 && (
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-sm text-gray-400">Cart Total</div>
                  <div className="text-xl font-bold text-white">${cartTotal.toFixed(2)}</div>
                </div>
                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                  Checkout ({cart.length})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search & Filters */}
      <Card className="glass-card mb-8">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={selectedCategory === cat.id 
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                    : "border-slate-700 text-gray-300"}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Bundles */}
      {suggestedBundles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Suggested Add-ons (Save up to 15%)
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {suggestedBundles.map(bundle => (
              <SuggestedBundleCard
                key={bundle.id}
                service={bundle}
                onAddToCart={() => addToCart(bundle.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured Services */}
      {featuredServices.length > 0 && selectedCategory === "all" && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Featured Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                inCart={cart.includes(service.id)}
                onAddToCart={() => addToCart(service.id)}
                onRemoveFromCart={() => removeFromCart(service.id)}
                onOrder={() => handleOrder(service)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Services */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {selectedCategory === "all" ? "All Services" : categories.find(c => c.id === selectedCategory)?.name}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              inCart={cart.includes(service.id)}
              onAddToCart={() => addToCart(service.id)}
              onRemoveFromCart={() => removeFromCart(service.id)}
              onOrder={() => handleOrder(service)}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No services found matching your search</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Dialog */}
      <OrderServiceDialog
        open={showOrderDialog}
        onClose={() => setShowOrderDialog(false)}
        service={selectedService}
        agentId={user?.agent_id}
        onSuccess={() => {
          setShowOrderDialog(false);
          toast.success("Order placed successfully!");
        }}
      />
    </div>
  );
}