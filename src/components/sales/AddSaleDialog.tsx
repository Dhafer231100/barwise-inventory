
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Sale } from "@/utils/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for bars
const BARS = [
  { id: "1", name: "Main Bar" },
  { id: "2", name: "Pool Bar" },
  { id: "3", name: "Rooftop Bar" },
];

// Mock data for products
const PRODUCTS = [
  { id: "1", name: "Mojito", price: 12.99 },
  { id: "2", name: "Margarita", price: 14.99 },
  { id: "3", name: "Whiskey Sour", price: 16.99 },
  { id: "4", name: "Gin & Tonic", price: 11.99 },
  { id: "5", name: "Piña Colada", price: 13.99 },
  { id: "6", name: "Old Fashioned", price: 15.99 },
  { id: "7", name: "Negroni", price: 14.99 },
  { id: "8", name: "Moscow Mule", price: 12.99 },
];

// Mock data for staff
const STAFF = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
];

interface AddSaleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddSale: (sale: Omit<Sale, 'id'>) => void;
}

export function AddSaleDialog({ 
  open, 
  setOpen, 
  onAddSale 
}: AddSaleDialogProps) {
  const { hasPermission } = useAuth();
  const [barId, setBarId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [staffId, setStaffId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Check permission
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can add sales");
    }
  }, [open, setOpen, hasPermission]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setBarId("");
      setProductId("");
      setStaffId("");
      setQuantity(1);
      setPrice(0);
      setTotal(0);
      setError("");
    }
  }, [open]);

  // Update price and total when product changes
  useEffect(() => {
    if (productId) {
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        setPrice(product.price);
        setTotal(product.price * quantity);
      }
    }
  }, [productId, quantity]);

  // Update total when quantity changes
  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  const handleSubmit = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can add sales");
      setOpen(false);
      return;
    }
    
    // Validate input
    if (!barId) {
      setError("Please select a bar");
      return;
    }
    
    if (!productId) {
      setError("Please select a product");
      return;
    }
    
    if (!staffId) {
      setError("Please select a staff member");
      return;
    }
    
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    
    // Get bar name
    const bar = BARS.find(b => b.id === barId);
    const barName = bar ? bar.name : "Unknown Bar";
    
    // Get product name
    const product = PRODUCTS.find(p => p.id === productId);
    const productName = product ? product.name : "Unknown Product";
    
    // Get staff name
    const staff = STAFF.find(s => s.id === staffId);
    const staffName = staff ? staff.name : "Unknown Staff";
    
    // Process add sale
    onAddSale({
      barId,
      barName,
      productName,
      amount: price,
      quantity,
      total,
      date: new Date().toISOString(),
      staffName
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Sale</DialogTitle>
          <DialogDescription>
            Enter the details to record a new sale.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="bar">Bar Location</Label>
            <Select 
              value={barId} 
              onValueChange={setBarId}
            >
              <SelectTrigger id="bar">
                <SelectValue placeholder="Select a bar" />
              </SelectTrigger>
              <SelectContent>
                {BARS.map((bar) => (
                  <SelectItem key={bar.id} value={bar.id}>
                    {bar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select 
              value={productId} 
              onValueChange={setProductId}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCTS.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (${product.price.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="staff">Staff Member</Label>
            <Select 
              value={staffId} 
              onValueChange={setStaffId}
            >
              <SelectTrigger id="staff">
                <SelectValue placeholder="Select a staff member" />
              </SelectTrigger>
              <SelectContent>
                {STAFF.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <div className="px-3 py-2 border rounded-md bg-muted/50">
                ${price.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Total</Label>
              <div className="px-3 py-2 border rounded-md bg-muted/50 font-medium">
                ${total.toFixed(2)}
              </div>
            </div>
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
