
import { InventoryItem } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface UseInventoryActionsProps {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setSelectedItem: React.Dispatch<React.SetStateAction<InventoryItem | null>>;
  setShowEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTransferDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useInventoryActions({
  items,
  setItems,
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

  const handleSaveTransfer = (item: InventoryItem, targetBarId: string, quantity: number) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can transfer inventory items");
      return;
    }
    
    const updatedItems = [...items];
    
    const sourceItemIndex = updatedItems.findIndex(i => i.id === item.id);
    
    if (sourceItemIndex === -1) {
      toast.error("Source item not found");
      return;
    }
    
    const targetItemIndex = updatedItems.findIndex(i => 
      i.name === item.name && 
      i.category === item.category && 
      i.barId === targetBarId &&
      i.unit === item.unit
    );
    
    updatedItems[sourceItemIndex] = {
      ...updatedItems[sourceItemIndex],
      quantity: updatedItems[sourceItemIndex].quantity - quantity
    };
    
    if (targetItemIndex >= 0) {
      updatedItems[targetItemIndex] = {
        ...updatedItems[targetItemIndex],
        quantity: updatedItems[targetItemIndex].quantity + quantity
      };
    } else {
      const newItemId = `${item.id}-${targetBarId}-${Date.now()}`;
      const newItem: InventoryItem = {
        ...item,
        id: newItemId,
        barId: targetBarId,
        quantity: quantity
      };
      updatedItems.push(newItem);
    }
    
    // Create a transfer record
    const transferId = `transfer-${Date.now()}`;
    const transferRecord = {
      id: transferId,
      itemId: item.id,
      itemName: item.name,
      sourceBarId: item.barId,
      targetBarId,
      quantity,
      unit: item.unit,
      transferredBy: user?.name || 'Unknown',
      date: new Date().toISOString()
    };
    
    // Save transfer record to localStorage
    const savedTransfers = localStorage.getItem('barTransferRecords') || '[]';
    const transfers = JSON.parse(savedTransfers);
    transfers.push(transferRecord);
    localStorage.setItem('barTransferRecords', JSON.stringify(transfers));
    
    setItems(updatedItems);
    
    toast.success(`Transferred ${quantity} ${item.unit}(s) of ${item.name} to ${targetBarId === "1" ? "Main Bar" : targetBarId === "2" ? "Economa" : "Restaurant"}`);
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
