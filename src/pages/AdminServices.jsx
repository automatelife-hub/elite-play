import React, { useState, useEffect, useMemo } from "react";
import { db } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AdminServices() {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    category: "creative_design",
    package_type: "one_time",
    price: 0,
    description: "",
    features: [],
    turnaround_time: "",
    active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);

      if (currentUser.role !== 'admin') {
        toast.error("Admin access required");
        return;
      }

      const [allServices, allOrders] = await Promise.all([
        db.entities.ServicePackage.list('-created_date'),
        db.entities.ServiceOrder.list('-created_date')
      ]);

      setServices(allServices);
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await db.entities.ServicePackage.update(editingService.id, serviceForm);
        toast.success("Service updated");
      } else {
        await db.entities.ServicePackage.create(serviceForm);
        toast.success("Service created");
      }
      setShowServiceDialog(false);
      setEditingService(null);
      await loadData();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    }
  };

  const openEditDialog = (service) => {
    setEditingService(service);
    setServiceForm(service);
    setShowServiceDialog(true);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await db.entities.ServiceOrder.update(orderId, { 
        status,
        completed_date: status === 'completed' ? new Date().toISOString().split('T')[0] : null
      });
      toast.success(`Order ${status}`);
      await loadData();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0);
  const activeOrders = orders.filter(o => o.status === 'in_progress').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  const servicesMap = useMemo(() => {
    return new Map(services.map(s => [s.id, s]));
  }, [services]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Service Management</h1>
          <p className="text-gray-400">Manage service packages and orders</p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null);
            setServiceForm({
              name: "",
              category: "creative_design",
              package_type: "one_time",
              price: 0,
              description: "",
              features: [],
              turnaround_time: "",
              active: true
            });
            setShowServiceDialog(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">{services.length}</div>
            <div className="text-sm text-gray-400">Total Services</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">{orders.length}</div>
            <div className="text-sm text-gray-400">Total Orders</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white">{activeOrders}</div>
            <div className="text-sm text-gray-400">Active Orders</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white">${totalRevenue.toFixed(0)}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services">
        <TabsList className="mb-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <Card key={service.id} className="glass-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white">{service.name}</CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(service)}
                      className="text-gray-400 hover:text-emerald-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-gray-300 capitalize">
                      {service.category.replace('_', ' ')}
                    </Badge>
                    {service.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">Featured</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-400 mb-2">${service.price}</div>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.map(order => {
              const service = servicesMap.get(order.service_package_id);
              return (
                <Card key={order.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">{service?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-400 mb-2">{order.order_details}</div>
                        <div className="flex gap-2 items-center">
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Due: {order.due_date}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xl font-bold text-white">${order.total_price}</div>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'in_progress')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Work
                          </Button>
                        )}
                        {order.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="glass-card text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Create Service'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveService}>
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={serviceForm.category}
                    onValueChange={(value) => setServiceForm({ ...serviceForm, category: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video_production">Video Production</SelectItem>
                      <SelectItem value="image_editing">Image Editing</SelectItem>
                      <SelectItem value="creative_design">Creative Design</SelectItem>
                      <SelectItem value="website_development">Website Development</SelectItem>
                      <SelectItem value="agency_management">Agency Management</SelectItem>
                      <SelectItem value="growth_optimization">Growth Optimization</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="compliance_risk">Compliance & Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Price (USD) *</Label>
                  <Input
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) })}
                    className="bg-slate-800/50 border-slate-700 text-white mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Turnaround Time</Label>
                  <Input
                    value={serviceForm.turnaround_time}
                    onChange={(e) => setServiceForm({ ...serviceForm, turnaround_time: e.target.value })}
                    placeholder="e.g., 3-5 business days"
                    className="bg-slate-800/50 border-slate-700 text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white mt-1"
                  rows={3}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowServiceDialog(false)}
                className="border-slate-700"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                {editingService ? 'Update' : 'Create'} Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}