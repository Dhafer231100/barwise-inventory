
import { InventoryItem } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UseInventoryActionsProps {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  selectedItem: InventoryItem | null; // Added selectedItem to the interface
  setSelectedItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTransferDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useInventoryActions({
  items,
  setItems,
  selectedItem, // Added selectedItem as parameter
  setSelectedItem,
  setShowEditDialog,
  setShowAddDialog,
  setShowTransferDialog,
  setShowDeleteDialog
}: UseInventoryActionsProps) {
  const { hasPermission, user } = useAuth();

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    toast.info(`Viewing details for ${item.name}`);
  };

  const handleEditItem = (item: InventoryItem) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can edit inventory items");
      return;
    }
    setSelectedItem(item);
    setShowEditDialog(true);
  };

  const handleSaveItem = (updatedItem: InventoryItem) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can edit inventory items");
      return;
    }
    
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    toast.success(`${updatedItem.name} has been updated`);
    setShowEditDialog(false);
  };

  const handleTransferItem = (item: InventoryItem) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can transfer inventory items");
      return;
    }
    setSelectedItem(item);
    setShowTransferDialog(true);
  };

  const handleSaveTransfer = (transferItems: InventoryItem[], targetBarId: string, quantities: Record<string, number>) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can transfer inventory items");
      return;
    }
    
    const updatedItems = [...items];
    const transferRecords = [];
    
    for (const itemToTransfer of transferItems) {
      const quantity = quantities[itemToTransfer.id] || 0;
      if (quantity <= 0) continue;
      
      const sourceItemIndex = updatedItems.findIndex(i => i.id === itemToTransfer.id);
      
      if (sourceItemIndex === -1) {
        toast.error(`Source item ${itemToTransfer.name} not found`);
        continue;
      }
      
      const targetItemIndex = updatedItems.findIndex(i => 
        i.name === itemToTransfer.name && 
        i.category === itemToTransfer.category && 
        i.barId === targetBarId &&
        i.unit === itemToTransfer.unit
      );
      
      // Update source item quantity
      updatedItems[sourceItemIndex] = {
        ...updatedItems[sourceItemIndex],
        quantity: updatedItems[sourceItemIndex].quantity - quantity
      };
      
      // Update target item or create new item
      if (targetItemIndex >= 0) {
        updatedItems[targetItemIndex] = {
          ...updatedItems[targetItemIndex],
          quantity: updatedItems[targetItemIndex].quantity + quantity
        };
      } else {
        const newItemId = `${itemToTransfer.id}-${targetBarId}-${Date.now()}`;
        const newItem: InventoryItem = {
          ...itemToTransfer,
          id: newItemId,
          barId: targetBarId,
          quantity: quantity
        };
        updatedItems.push(newItem);
      }
      
      // Create a transfer record for this item
      const transferId = `transfer-${itemToTransfer.id}-${Date.now()}`;
      const transferRecord = {
        id: transferId,
        itemId: itemToTransfer.id,
        itemName: itemToTransfer.name,
        sourceBarId: itemToTransfer.barId,
        targetBarId,
        quantity,
        unit: itemToTransfer.unit,
        transferredBy: user?.name || 'Unknown',
        date: new Date().toISOString()
      };
      
      transferRecords.push(transferRecord);
    }
    
    // Save all transfer records to localStorage
    const savedTransfers = localStorage.getItem('barTransferRecords') || '[]';
    const transfers = JSON.parse(savedTransfers);
    transfers.push(...transferRecords);
    localStorage.setItem('barTransferRecords', JSON.stringify(transfers));
    
    setItems(updatedItems);
    
    const totalItemsTransferred = transferRecords.length;
    if (totalItemsTransferred === 1) {
      const record = transferRecords[0];
      toast.success(`Transferred ${record.quantity} ${record.unit}(s) of ${record.itemName} to ${targetBarId === "1" ? "Main Bar" : targetBarId === "2" ? "Economa" : "Restaurant"}`);
    } else {
      toast.success(`Successfully transferred ${totalItemsTransferred} items to ${targetBarId === "1" ? "Main Bar" : targetBarId === "2" ? "Economa" : "Restaurant"}`);
    }
    
    setShowTransferDialog(false);
  };

  const confirmDelete = (item: InventoryItem) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can delete inventory items");
      return;
    }
    setSelectedItem(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteItem = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can delete inventory items");
      setShowDeleteDialog(false);
      return;
    }
    
    if (selectedItem) {
      const updatedItems = items.filter(item => item.id !== selectedItem.id);
      setItems(updatedItems);
      toast.success(`${selectedItem.name} has been deleted`);
      setShowDeleteDialog(false);
      setSelectedItem(null);
    }
  };

  const handleAddItem = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can add inventory items");
      return;
    }
    setShowAddDialog(true);
  };

  const handleAddNewItem = (newItem: Omit<InventoryItem, 'id'>) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can add inventory items");
      return;
    }
    
    const id = `item-${Date.now()}`;
    const itemToAdd: InventoryItem = {
      id,
      ...newItem,
      taxRate: newItem.taxRate || 19, // Default to 19% if not specified
    };
    
    const updatedItems = [...items, itemToAdd];
    setItems(updatedItems);
    toast.success(`${newItem.name} has been added to inventory`);
    setShowAddDialog(false);
  };

  return {
    handleViewDetails,
    handleEditItem,
    handleSaveItem,
    handleTransferItem,
    handleSaveTransfer,
    confirmDelete,
    handleDeleteItem,
    handleAddItem,
    handleAddNewItem
  };
}
