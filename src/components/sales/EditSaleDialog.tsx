
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sale } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
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

// Mock data for staff
const STAFF = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
];

interface EditSaleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sale: Sale | null;
  onEditSale: (sale: Sale) => void;
}

export function EditSaleDialog({ 
  open, 
  setOpen, 
  sale, 
  onEditSale 
}: EditSaleDialogProps) {
  const { hasPermission } = useAuth();
  const [barId, setBarId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [staffName, setStaffName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Check permission
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can edit sales");
    }
  }, [open, setOpen, hasPermission]);

  // Initialize form with sale data
  useEffect(() => {
    if (sale && open) {
      setBarId(sale.barId);
      setProductName(sale.productName);
      setStaffName(sale.staffName);
      setAmount(sale.amount);
      setQuantity(sale.quantity);
      setTotal(sale.total);
      setError("");
    }
  }, [sale, open]);

  // Update total when amount or quantity changes
  useEffect(() => {
    setTotal(amount * quantity);
  }, [amount, quantity]);

  const handleSubmit = () => {
    if (!sale) return;
    
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can edit sales");
      setOpen(false);
      return;
    }
    
    // Validate input
    if (!barId) {
      setError("Please select a bar");
      return;
    }
    
    if (!productName) {
      setError("Product name is required");
      return;
    }
    
    if (!staffName) {
      setError("Please select a staff member");
      return;
    }
    
    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    
    // Get bar name
    const bar = BARS.find(b => b.id === barId);
    const barName = bar ? bar.name : "Unknown Bar";
    
    // Process edit sale
    onEditSale({
      ...sale,
      barId,
      barName,
      productName,
      amount,
      quantity,
      total,
      staffName
    });
  };

  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Sale</DialogTitle>
          <DialogDescription>
            Update the details of this sale.
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
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="staffName">Staff Member</Label>
            <Select 
              value={STAFF.find(s => s.name === staffName)?.id || ""}
              onValueChange={(id) => {
                const staff = STAFF.find(s => s.id === id);
                if (staff) setStaffName(staff.name);
              }}
            >
              <SelectTrigger id="staffName">
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
            <Label htmlFor="amount">Price</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
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
          
          <div className="space-y-2">
            <Label>Total</Label>
            <div className="px-3 py-2 border rounded-md bg-muted/50 font-medium">
              ${total.toFixed(2)}
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
            Update Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
