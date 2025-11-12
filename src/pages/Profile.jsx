import React, { useState, useEffect } from "react";
import { User, Site, UserSiteSignup } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Mail, Globe, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import AddSiteSignupDialog from "../components/profile/AddSiteSignupDialog";
import SignupCard from "../components/profile/SignupCard";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [signups, setSignups] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [userSignups, allSites] = await Promise.all([
        UserSiteSignup.filter({ user_email: currentUser.email }),
        Site.list()
      ]);

      setSignups(userSignups);
      setSites(allSites);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const formData = new FormData(e.target);
      await User.updateMyUserData({
        phone: formData.get('phone'),
        country: formData.get('country'),
        preferred_currency: formData.get('preferred_currency')
      });
      
      toast.success("Profile updated successfully");
      await loadData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddSignup = async (signupData) => {
    try {
      await UserSiteSignup.create({
        ...signupData,
        user_email: user.email
      });
      
      toast.success("Site signup added successfully");
      setShowAddDialog(false);
      await loadData();
    } catch (error) {
      console.error("Error adding signup:", error);
      toast.error("Failed to add site signup");
    }
  };

  const handleDeleteSignup = async (signupId) => {
    if (!confirm("Are you sure you want to remove this site signup?")) return;
    
    try {
      await UserSiteSignup.delete(signupId);
      toast.success("Site signup removed");
      await loadData();
    } catch (error) {
      console.error("Error deleting signup:", error);
      toast.error("Failed to remove site signup");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 text-white min-h-screen py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account and track your poker site signups</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <UserCircle className="w-5 h-5 text-yellow-400" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Full Name</Label>
                    <Input
                      defaultValue={user?.full_name}
                      disabled
                      className="bg-gray-800 border-gray-700 text-gray-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input
                      defaultValue={user?.email}
                      disabled
                      className="bg-gray-800 border-gray-700 text-gray-400 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={user?.phone}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-gray-300">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      defaultValue={user?.country}
                      placeholder="United States"
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferred_currency" className="text-gray-300">Preferred Currency</Label>
                    <Input
                      id="preferred_currency"
                      name="preferred_currency"
                      defaultValue={user?.preferred_currency || "USD"}
                      placeholder="USD"
                      className="bg-gray-800 border-gray-700 text-white mt-1"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
                  >
                    {updating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Account Role</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5 text-yellow-400" />
                    My Site Signups
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Site
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {signups.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">No site signups yet</h3>
                    <p className="text-gray-500 mb-4">
                      Start tracking your poker site accounts by adding your first signup
                    </p>
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Site
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {signups.map((signup) => {
                      const site = sites.find(s => s.id === signup.site_id);
                      return (
                        <SignupCard
                          key={signup.id}
                          signup={signup}
                          site={site}
                          onDelete={() => handleDeleteSignup(signup.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddSiteSignupDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        sites={sites}
        onSubmit={handleAddSignup}
      />
    </div>
  );
}