
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
import { Search, PackageCheck, ArrowRightLeft } from "lucide-react";

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
  const [itemFilter, setItemFilter] = useState<string>("");
  const [sourceBarFilter, setSourceBarFilter] = useState<string>("");

  // Reset form when item changes or dialog opens
  useEffect(() => {
    if (item && open) {
      // Reset state for new dialog open
      const newQuantities: Record<string, number> = {};
      newQuantities[item.id] = 1;
      setQuantities(newQuantities);
      setSelectedItems([item]);
      // Default to multi-transfer mode for better UX
      setMultiTransfer(true);
      setItemFilter("");
      setSourceBarFilter(item.barId);
      
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
  }, [item, open]);

  // Handle quantity change
  const handleQuantityChange = (itemId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  // Handle quick set to max quantity
  const handleSetMaxQuantity = (itemId: string, maxQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: maxQuantity
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

  // Update available bars when source bar filter changes
  useEffect(() => {
    if (sourceBarFilter) {
      const allBars = Object.entries(barNames).map(([id, name]) => ({ id, name }));
      const filteredBars = allBars.filter(bar => bar.id !== sourceBarFilter);
      setAvailableBars(filteredBars);
      
      // Set default target bar
      if (filteredBars.length > 0 && (!targetBarId || targetBarId === sourceBarFilter)) {
        setTargetBarId(filteredBars[0].id);
      }
    }
  }, [sourceBarFilter, targetBarId]);

  // Get items from the selected source bar
  const getFilteredItems = () => {
    if (!sourceBarFilter) return [];
    
    const barItems = allItems.filter(i => 
      i.barId === sourceBarFilter && 
      i.quantity > 0 &&
      (itemFilter === "" || i.name.toLowerCase().includes(itemFilter.toLowerCase()))
    );
    
    return barItems;
  };

  const validateTransfer = () => {
    if (!targetBarId) {
      setError("Please select a target bar");
      return false;
    }
    
    if (selectedItems.length === 0) {
      setError("Please select at least one item to transfer");
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

  const handleSelectAll = () => {
    const filteredItems = getFilteredItems();
    const newSelectedItems = [...selectedItems];
    const newQuantities = {...quantities};
    
    filteredItems.forEach(item => {
      // Only add if not already selected
      if (!selectedItems.some(i => i.id === item.id)) {
        newSelectedItems.push(item);
        newQuantities[item.id] = 1; // Default quantity
      }
    });
    
    setSelectedItems(newSelectedItems);
    setQuantities(newQuantities);
  };

  const handleSelectNone = () => {
    const filteredItems = getFilteredItems();
    
    // Remove only filtered items from selection
    const filteredItemIds = new Set(filteredItems.map(item => item.id));
    
    const newSelectedItems = selectedItems.filter(item => !filteredItemIds.has(item.id));
    const newQuantities = {...quantities};
    
    filteredItems.forEach(item => {
      delete newQuantities[item.id];
    });
    
    setSelectedItems(newSelectedItems);
    setQuantities(newQuantities);
  };

  const handleSubmit = () => {
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

  if (!open) return null;

  const filteredItems = getFilteredItems();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Transfer Inventory Items
          </DialogTitle>
          <DialogDescription>
            Move inventory items between bar locations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Source Bar Selection */}
          <div className="space-y-2">
            <Label htmlFor="sourceBar">Source Bar:</Label>
            <Select value={sourceBarFilter} onValueChange={setSourceBarFilter}>
              <SelectTrigger id="sourceBar">
                <SelectValue placeholder="Select source bar" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(barNames).map(([id, name]) => (
                  <SelectItem key={id} value={id}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Target Bar Selection */}
          <div className="space-y-2">
            <Label htmlFor="targetBar">Transfer to:</Label>
            <Select 
              value={targetBarId} 
              onValueChange={setTargetBarId}
              disabled={availableBars.length === 0}
            >
              <SelectTrigger id="targetBar">
                <SelectValue placeholder="Select destination bar" />
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
          
          {/* Item Selection Section */}
          <div className="space-y-2 border rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <Label>Select Items to Transfer:</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectNone}
                >
                  Clear
                </Button>
              </div>
            </div>
            
            {/* Search filter */}
            <div className="relative mb-3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={itemFilter}
                onChange={(e) => setItemFilter(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto border rounded-md p-2">
              {filteredItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No items found. {!sourceBarFilter && "Please select a source bar."}
                </p>
              ) : (
                filteredItems.map((inventoryItem) => (
                  <div key={inventoryItem.id} className="flex items-center space-x-2 py-2 border-b last:border-b-0">
                    <Checkbox 
                      id={`item-${inventoryItem.id}`}
                      checked={selectedItems.some(i => i.id === inventoryItem.id)}
                      onCheckedChange={() => toggleItemSelection(inventoryItem)}
                    />
                    <Label htmlFor={`item-${inventoryItem.id}`} className="flex-grow cursor-pointer">
                      {inventoryItem.name} 
                      <span className="text-sm text-muted-foreground ml-1">
                        ({inventoryItem.quantity} {inventoryItem.unit}{inventoryItem.quantity > 1 ? 's' : ''})
                      </span>
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Quantity Selection */}
          {selectedItems.length > 0 && (
            <div className="space-y-2 border rounded-md p-3">
              <Label>Set Quantities:</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedItems.map(selectedItem => {
                  const maxQty = selectedItem.quantity;
                  return (
                    <div key={selectedItem.id} className="flex items-center space-x-2 py-1">
                      <p className="text-sm w-1/3 truncate" title={selectedItem.name}>{selectedItem.name}:</p>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          id={`quantity-${selectedItem.id}`}
                          type="number"
                          min="1"
                          max={maxQty}
                          value={quantities[selectedItem.id] || 1}
                          onChange={(e) => handleQuantityChange(selectedItem.id, Number(e.target.value))}
                          className="w-full"
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="whitespace-nowrap text-xs"
                          onClick={() => handleSetMaxQuantity(selectedItem.id, maxQty)}
                        >
                          Max: {maxQty}
                        </Button>
                      </div>
                      <span className="text-sm w-12">{selectedItem.unit}{quantities[selectedItem.id] !== 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {error && (
            <p className="text-destructive text-sm bg-destructive/10 p-2 rounded-md">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={availableBars.length === 0 || selectedItems.length === 0}
            className="gap-2"
          >
            <PackageCheck className="h-4 w-4" />
            Transfer {selectedItems.length > 1 ? `(${selectedItems.length} items)` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
