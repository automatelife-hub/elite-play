import React, { useState, useEffect } from "react";
import { User, UserSiteSignup, UserStats, Site } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { ExtractDataFromUploadedFile, UploadFile } from "@/integrations/Core";
import SiteManagement from "../components/admin/SiteManagement";
import StatsManagement from "../components/admin/StatsManagement";
import EarningsManagement from "../components/admin/EarningsManagement";
import { hasPermission } from "../components/admin/PermissionsGuard";

export default function AdminStats() {
  const [user, setUser] = useState(null);
  const [signups, setSignups] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Check if user has any admin permissions
      const isAdmin = currentUser.role === 'admin' || 
                     currentUser.permissions?.some(p => ['manage_sites', 'manage_stats', 'full_admin'].includes(p));
      
      if (!isAdmin) {
        toast.error("Access denied. Admin permissions required.");
        return;
      }

      const [allSignups, allSites] = await Promise.all([
        UserSiteSignup.list(),
        Site.list()
      ]);

      setSignups(allSignups);
      setSites(allSites);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || 
                  user?.permissions?.some(p => ['manage_sites', 'manage_stats', 'full_admin'].includes(p));

  if (!isAdmin) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">This page requires admin permissions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage sites and upload user statistics</p>
        </div>

        <Tabs defaultValue="sites" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            {hasPermission(user, 'manage_sites') && (
              <TabsTrigger value="sites" className="data-[state=active]:bg-yellow-500/20">
                Site Management
              </TabsTrigger>
            )}
            {hasPermission(user, 'manage_stats') && (
              <TabsTrigger value="stats" className="data-[state=active]:bg-yellow-500/20">
                Statistics Management
              </TabsTrigger>
            )}
            {hasPermission(user, 'manage_stats') && (
              <TabsTrigger value="earnings" className="data-[state=active]:bg-yellow-500/20">
                Earnings Management
              </TabsTrigger>
            )}
          </TabsList>

          {hasPermission(user, 'manage_sites') && (
            <TabsContent value="sites">
              <SiteManagement user={user} />
            </TabsContent>
          )}

          {hasPermission(user, 'manage_stats') && (
            <TabsContent value="stats">
              <StatsManagement user={user} signups={signups} sites={sites} />
            </TabsContent>
          )}

          {hasPermission(user, 'manage_stats') && (
            <TabsContent value="earnings">
              <EarningsManagement user={user} sites={sites} />
            </TabsContent>
          )}

        </Tabs>
      </div>
    </div>
  );
}