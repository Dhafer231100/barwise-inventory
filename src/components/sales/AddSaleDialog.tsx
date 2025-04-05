
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Sale, InventoryItem } from "@/utils/types";
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
import { barNames } from "@/data/mockInventoryData";

// Mock data for bars - updated with consistent naming
const BARS = [
  { id: "1", name: "Main Bar" },
  { id: "2", name: "Economa" },
  { id: "3", name: "Restaurant" },
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
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [itemId, setItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Load inventory items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('hotelBarInventory');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setInventoryItems(parsedItems);
      } catch (error) {
        console.error('Failed to parse inventory items:', error);
        setInventoryItems([]);
      }
    }
  }, []);

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
      setItemId("");
      setQuantity(1);
      setPrice(0);
      setTotal(0);
      setError("");
    }
  }, [open]);

  // Filter items based on selected bar
  useEffect(() => {
    if (barId) {
      const items = inventoryItems.filter(item => item.barId === barId && item.quantity > 0);
      setFilteredItems(items);
      setItemId("");
    } else {
      setFilteredItems([]);
    }
  }, [barId, inventoryItems]);

  // Update price and total when item changes
  useEffect(() => {
    if (itemId) {
      const item = inventoryItems.find(item => item.id === itemId);
      if (item) {
        setPrice(item.unitPrice);
        setTotal(item.unitPrice * quantity);
      }
    }
  }, [itemId, quantity, inventoryItems]);

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
    
    if (!itemId) {
      setError("Please select a product");
      return;
    }
    
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    
    // Get bar name from the centralized barNames object
    const barName = barNames[barId] || "Unknown Bar";
    
    // Get product name
    const item = inventoryItems.find(item => item.id === itemId);
    const productName = item ? item.name : "Unknown Product";
    
    // Process add sale
    onAddSale({
      barId,
      barName,
      productName,
      amount: price,
      quantity,
      total,
      date: new Date().toISOString(),
      staffName: "System" // Default value instead of user selection
    });
    
    // Update inventory quantity
    if (item) {
      const updatedItems = inventoryItems.map(invItem => {
        if (invItem.id === itemId) {
          return {
            ...invItem,
            quantity: Math.max(0, invItem.quantity - quantity)
          };
        }
        return invItem;
      });
      
      localStorage.setItem('hotelBarInventory', JSON.stringify(updatedItems));
    }
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
              value={itemId} 
              onValueChange={setItemId}
              disabled={!barId || filteredItems.length === 0}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder={filteredItems.length ? "Select a product" : "No products available"} />
              </SelectTrigger>
              <SelectContent>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} (${item.unitPrice.toFixed(2)}) - {item.quantity} {item.unit}(s) left
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No products available</SelectItem>
                )}
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
              onChange={(e) => {
                const newQuantity = Number(e.target.value);
                const selectedItem = inventoryItems.find(item => item.id === itemId);
                
                if (selectedItem && newQuantity > selectedItem.quantity) {
                  setError(`Only ${selectedItem.quantity} ${selectedItem.unit}(s) available`);
                  setQuantity(selectedItem.quantity);
                } else {
                  setError("");
                  setQuantity(newQuantity);
                }
              }}
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
