
import { Navbar } from "@/components/Navbar";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Package2, 
  GlassWater, 
  BarChartHorizontal, 
  Users, 
  Settings,
  LogOut,
  FileWarning
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1 w-full">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-background animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarHeader className="text-lg font-semibold py-4">
        <span className="px-4">Hotel BarWise</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <a href="/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/inventory")}>
                  <a href="/inventory">
                    <Package2 className="h-5 w-5" />
                    <span>Inventory</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/bar-management")}>
                  <a href="/bar-management">
                    <GlassWater className="h-5 w-5" />
                    <span>Bar Management</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/reports")}>
                  <a href="/reports">
                    <BarChartHorizontal className="h-5 w-5" />
                    <span>Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {user.role === 'manager' && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive("/users")}>
                    <a href="/users">
                      <Users className="h-5 w-5" />
                      <span>Staff</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <a href="/settings">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
