
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

export function LoginForm() {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = async (role: string) => {
    setIsSubmitting(true);
    try {
      switch(role) {
        case 'manager':
          await login('manager@hotel.com', 'manager123');
          break;
        case 'bartender':
          await login('bartender@hotel.com', 'bartender123');
          break;
        case 'inventory':
          await login('inventory@hotel.com', 'inventory123');
          break;
      }
    } catch (error) {
      setError("Demo login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg animate-scale-in">
      <CardHeader className="space-y-1 text-center bg-primary/5 pb-6">
        <div className="flex justify-center mb-2">
          <Logo showText={false} className="mx-auto" />
        </div>
        <CardTitle className="text-2xl">Regency BarWise</CardTitle>
        <CardDescription>Bar Management System</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Quick Access</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 w-full">
          <Button 
            variant="outline" 
            onClick={() => handleDemo('manager')} 
            disabled={isSubmitting}
            className="text-xs"
          >
            Manager
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleDemo('bartender')} 
            disabled={isSubmitting}
            className="text-xs"
          >
            Bartender
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleDemo('inventory')} 
            disabled={isSubmitting}
            className="text-xs"
          >
            Inventory
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
