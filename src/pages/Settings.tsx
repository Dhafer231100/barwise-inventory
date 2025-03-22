
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    lowStock: true,
    expiringItems: true,
    orderUpdates: true,
  });
  
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };

  const saveProfile = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark mode
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Show more content in less space
                    </p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name} 
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email} 
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveProfile}>Update profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notif" 
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange("email")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="browser-notif">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <Switch 
                      id="browser-notif" 
                      checked={notifications.browser}
                      onCheckedChange={() => handleNotificationChange("browser")}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="mb-3 text-sm font-medium">Alert types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="low-stock">Low Stock Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when items are running low
                          </p>
                        </div>
                        <Switch 
                          id="low-stock" 
                          checked={notifications.lowStock}
                          onCheckedChange={() => handleNotificationChange("lowStock")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="expiring">Expiring Items</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about soon-to-expire items
                          </p>
                        </div>
                        <Switch 
                          id="expiring" 
                          checked={notifications.expiringItems}
                          onCheckedChange={() => handleNotificationChange("expiringItems")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="orders">Order Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about order status changes
                          </p>
                        </div>
                        <Switch 
                          id="orders" 
                          checked={notifications.orderUpdates}
                          onCheckedChange={() => handleNotificationChange("orderUpdates")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={saveSettings}>Save preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
