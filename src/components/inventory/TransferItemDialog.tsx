
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/utils/types";
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
import { barNames } from "@/data/mockInventoryData";

interface TransferItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: InventoryItem | null;
  onTransfer: (item: InventoryItem, targetBarId: string, quantity: number) => void;
}

export function TransferItemDialog({ 
  open, 
  setOpen, 
  item, 
  onTransfer 
}: TransferItemDialogProps) {
  const { hasPermission } = useAuth();
  const [targetBarId, setTargetBarId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [availableBars, setAvailableBars] = useState<Array<{id: string, name: string}>>([]);
  const [error, setError] = useState<string>("");

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      // Reset quantity
      setQuantity(1);
      
      // Get all bars except the current one
      const allBars = Object.entries(barNames).map(([id, name]) => ({ id, name }));
      const filteredBars = allBars.filter(bar => bar.id !== item.barId);
      setAvailableBars(filteredBars);
      
      // Set default target bar
      if (filteredBars.length > 0) {
        setTargetBarId(filteredBars[0].id);
      } else {
        setTargetBarId("");
      }
      
      setError("");
    }
  }, [item]);

  // Check permission when dialog opens
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can transfer inventory items");
    }
  }, [open, setOpen, hasPermission]);

  const handleSubmit = () => {
    if (!item) return;
    
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can transfer inventory items");
      setOpen(false);
      return;
    }
    
    // Validate input
    if (!targetBarId) {
      setError("Please select a target bar");
      return;
    }
    
    if (quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    
    if (quantity > item.quantity) {
      setError(`You can't transfer more than ${item.quantity} ${item.unit}(s)`);
      return;
    }
    
    // Process transfer
    onTransfer(item, targetBarId, quantity);
    setOpen(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Inventory</DialogTitle>
          <DialogDescription>
            Transfer {item.name} to another bar location.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <p><strong>Item:</strong> {item.name}</p>
            <p><strong>Current Location:</strong> {barNames[item.barId]}</p>
            <p><strong>Available Quantity:</strong> {item.quantity} {item.unit}(s)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetBar">Transfer to:</Label>
            <Select 
              value={targetBarId} 
              onValueChange={setTargetBarId}
              disabled={availableBars.length === 0}
            >
              <SelectTrigger id="targetBar">
                <SelectValue placeholder="Select a bar" />
              </SelectTrigger>
              <SelectContent>
                {availableBars.map((bar) => (
                  <SelectItem key={bar.id} value={bar.id}>
                    {bar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableBars.length === 0 && (
              <p className="text-sm text-muted-foreground">No other bars available for transfer</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to transfer:</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={item.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={availableBars.length === 0}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
