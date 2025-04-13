
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
import { Checkbox } from "@/components/ui/checkbox";
import { barNames } from "@/data/mockInventoryData";

interface TransferItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: InventoryItem | null;
  allItems: InventoryItem[];
  onTransfer: (items: InventoryItem[], targetBarId: string, quantities: Record<string, number>) => void;
}

export function TransferItemDialog({ 
  open, 
  setOpen, 
  item, 
  allItems,
  onTransfer 
}: TransferItemDialogProps) {
  const { hasPermission } = useAuth();
  const [targetBarId, setTargetBarId] = useState<string>("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [availableBars, setAvailableBars] = useState<Array<{id: string, name: string}>>([]);
  const [error, setError] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const [multiTransfer, setMultiTransfer] = useState<boolean>(false);

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      // Reset state for new dialog open
      const newQuantities: Record<string, number> = {};
      newQuantities[item.id] = 1;
      setQuantities(newQuantities);
      setSelectedItems([item]);
      setMultiTransfer(false);
      
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

  // Handle quantity change
  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  // Toggle item selection
  const toggleItemSelection = (itemToToggle: InventoryItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(i => i.id === itemToToggle.id);
      
      if (isSelected) {
        // Remove from selection
        const newSelection = prev.filter(i => i.id !== itemToToggle.id);
        
        // Also remove from quantities
        const newQuantities = {...quantities};
        delete newQuantities[itemToToggle.id];
        setQuantities(newQuantities);
        
        return newSelection;
      } else {
        // Add to selection and set default quantity
        setQuantities(prevQ => ({
          ...prevQ,
          [itemToToggle.id]: 1
        }));
        
        return [...prev, itemToToggle];
      }
    });
  };

  // Check permission when dialog opens
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can transfer inventory items");
    }
  }, [open, setOpen, hasPermission]);

  // Get items from the same bar as the initial item
  const getItemsFromSameBar = () => {
    if (!item) return [];
    return allItems.filter(i => i.barId === item.barId && i.quantity > 0);
  };

  const validateTransfer = () => {
    if (!targetBarId) {
      setError("Please select a target bar");
      return false;
    }
    
    // Check if any selected items have invalid quantities
    for (const selectedItem of selectedItems) {
      const quantity = quantities[selectedItem.id] || 0;
      
      if (quantity <= 0) {
        setError(`Quantity for ${selectedItem.name} must be greater than 0`);
        return false;
      }
      
      if (quantity > selectedItem.quantity) {
        setError(`You can't transfer more than ${selectedItem.quantity} ${selectedItem.unit}(s) of ${selectedItem.name}`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      setError("Please select at least one item to transfer");
      return;
    }
    
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can transfer inventory items");
      setOpen(false);
      return;
    }
    
    // Validate input
    if (!validateTransfer()) {
      return;
    }
    
    // Process transfer
    onTransfer(selectedItems, targetBarId, quantities);
    
    // The handler will update localStorage for both inventory and transfers
    setOpen(false);
  };

  if (!item) return null;

  const itemsFromSameBar = getItemsFromSameBar();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Inventory</DialogTitle>
          <DialogDescription>
            Transfer items to another bar location.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="multiTransfer" 
              checked={multiTransfer}
              onCheckedChange={(checked) => {
                setMultiTransfer(!!checked);
                if (!checked) {
                  // Reset to just the initial item
                  setSelectedItems([item]);
                  const newQuantities: Record<string, number> = {};
                  newQuantities[item.id] = quantities[item.id] || 1;
                  setQuantities(newQuantities);
                }
              }}
            />
            <Label htmlFor="multiTransfer">Transfer multiple items</Label>
          </div>
          
          {!multiTransfer ? (
            <div>
              <p><strong>Item:</strong> {item.name}</p>
              <p><strong>Current Location:</strong> {barNames[item.barId]}</p>
              <p><strong>Available Quantity:</strong> {item.quantity} {item.unit}(s)</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto border rounded-md p-2">
              <p className="font-medium mb-2">Select items to transfer:</p>
              {itemsFromSameBar.map((inventoryItem) => (
                <div key={inventoryItem.id} className="flex items-center space-x-2 py-1 border-b last:border-b-0">
                  <Checkbox 
                    id={`item-${inventoryItem.id}`}
                    checked={selectedItems.some(i => i.id === inventoryItem.id)}
                    onCheckedChange={() => toggleItemSelection(inventoryItem)}
                  />
                  <Label htmlFor={`item-${inventoryItem.id}`} className="flex-grow">
                    {inventoryItem.name} ({inventoryItem.quantity} {inventoryItem.unit}{inventoryItem.quantity > 1 ? 's' : ''})
                  </Label>
                </div>
              ))}
            </div>
          )}
          
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
            <Label>Quantity to transfer:</Label>
            {selectedItems.map(selectedItem => (
              <div key={selectedItem.id} className="flex items-center space-x-2">
                {multiTransfer && <p className="text-sm w-1/3">{selectedItem.name}:</p>}
                <Input
                  id={`quantity-${selectedItem.id}`}
                  type="number"
                  min="1"
                  max={selectedItem.quantity}
                  value={quantities[selectedItem.id] || 1}
                  onChange={(e) => handleQuantityChange(selectedItem.id, Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm w-1/6">{selectedItem.unit}{quantities[selectedItem.id] !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
          
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={availableBars.length === 0 || selectedItems.length === 0}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
