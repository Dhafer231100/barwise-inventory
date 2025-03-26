
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="border-b bg-white bg-opacity-70 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <SidebarTrigger>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          </div>
          <a href="/" className="flex items-center gap-2">
            <Logo showText={false} />
            <span className="font-semibold text-lg hidden md:block">Regency BarWise</span>
          </a>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-auto p-2">
                <div className="flex items-start gap-4 rounded-lg p-3 hover:bg-muted cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low Stock Alert</p>
                    <p className="text-sm text-muted-foreground">Vodka is running low in Main Bar</p>
                    <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg p-3 hover:bg-muted cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm font-medium">New Order</p>
                    <p className="text-sm text-muted-foreground">New order placed at Pool Bar</p>
                    <p className="text-xs text-muted-foreground mt-1">25 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg p-3 hover:bg-muted cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Expiring Soon</p>
                    <p className="text-sm text-muted-foreground">Fresh lime juice expires tomorrow</p>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                <Avatar>
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary text-white">{
                    user?.name?.split(' ').map(n => n[0]).join('') || <User className="h-4 w-4" />
                  }</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize mt-1">{user.role.replace('_', ' ')}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <a href="/">Log in</a>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
