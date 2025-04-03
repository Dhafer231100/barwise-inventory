import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { InventoryItem } from "@/utils/types";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { Card } from "@/components/ui/card";
import { DeleteItemDialog } from "@/components/inventory/DeleteItemDialog";
import { EditItemDialog } from "@/components/inventory/EditItemDialog";
import { mockInventoryItems } from "@/data/mockInventoryData";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { TransferItemDialog } from "@/components/inventory/TransferItemDialog";

const Inventory = () => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBar, setSelectedBar] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [sortField, setSortField] = useState<"name" | "quantity" | "unitPrice">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesBar = selectedBar === "all" || item.barId === selectedBar;
      return matchesSearch && matchesCategory && matchesBar;
    })
    .sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (sortField) {
        case "name":
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case "quantity":
          valueA = a.quantity;
          valueB = b.quantity;
          break;
        case "unitPrice":
          valueA = a.unitPrice;
          valueB = b.unitPrice;
          break;
        default:
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const categories = Array.from(new Set(items.map((item) => item.category)));

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
    
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
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
    
    setItems(updatedItems);
    
    toast.success(`Transferred ${quantity} ${item.unit}(s) of ${item.name} to ${targetBarId === "1" ? "Main Bar" : targetBarId === "2" ? "Pool Bar" : "Rooftop Bar"}`);
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
      setItems(items.filter(item => item.id !== selectedItem.id));
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
      ...newItem
    };
    
    setItems([...items, itemToAdd]);
    toast.success(`${newItem.name} has been added to inventory`);
    setShowAddDialog(false);
  };

  const handleSort = (field: "name" | "quantity" | "unitPrice") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            <p className="text-muted-foreground">
              Manage your bar inventory across all locations
            </p>
          </div>
          <Button 
            className="flex items-center gap-2" 
            onClick={handleAddItem}
            disabled={!hasPermission(['manager'])}
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        <Card className="p-4">
          <InventoryFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBar={selectedBar}
            setSelectedBar={setSelectedBar}
            categories={categories}
          />

          <InventoryTable 
            items={filteredItems}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onViewDetails={handleViewDetails}
            onEditItem={handleEditItem}
            onTransferItem={handleTransferItem}
            onDeleteItem={confirmDelete}
          />
        </Card>
      </div>

      <DeleteItemDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        item={selectedItem}
        onDelete={handleDeleteItem}
      />

      <EditItemDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        item={selectedItem}
        onSave={handleSaveItem}
      />

      <AddItemDialog
        open={showAddDialog}
        setOpen={setShowAddDialog}
        onAdd={handleAddNewItem}
      />

      <TransferItemDialog
        open={showTransferDialog}
        setOpen={setShowTransferDialog}
        item={selectedItem}
        onTransfer={handleSaveTransfer}
      />
    </Layout>
  );
};

export default Inventory;
