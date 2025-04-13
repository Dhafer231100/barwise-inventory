
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { InventoryItem } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { Card } from "@/components/ui/card";
import { DeleteItemDialog } from "@/components/inventory/DeleteItemDialog";
import { EditItemDialog } from "@/components/inventory/EditItemDialog";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { TransferItemDialog } from "@/components/inventory/TransferItemDialog";
import { useInventoryDialogs } from "@/components/inventory/hooks/useInventoryDialogs";
import { useInventoryActions } from "@/components/inventory/hooks/useInventoryActions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function InventoryManagerView() {
  // State for inventory items
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBar, setSelectedBar] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "quantity" | "unitPrice">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // State for reset confirmation dialog
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  // Custom hooks for dialogs and actions
  const { 
    selectedItem, setSelectedItem,
    showDeleteDialog, setShowDeleteDialog,
    showEditDialog, setShowEditDialog,
    showAddDialog, setShowAddDialog,
    showTransferDialog, setShowTransferDialog
  } = useInventoryDialogs();

  const {
    handleViewDetails,
    handleEditItem,
    handleSaveItem,
    handleTransferItem,
    handleSaveTransfer,
    confirmDelete,
    handleDeleteItem,
    handleAddItem,
    handleAddNewItem
  } = useInventoryActions({
    items,
    setItems,
    selectedItem, // Pass selectedItem here
    setSelectedItem,
    setShowEditDialog,
    setShowAddDialog,
    setShowTransferDialog,
    setShowDeleteDialog
  });

  // Load saved inventory items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('hotelBarInventory');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      setItems([]);
      localStorage.setItem('hotelBarInventory', JSON.stringify([]));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hotelBarInventory', JSON.stringify(items));
  }, [items]);

  const { hasPermission, user } = useAuth();

  const handleResetInventory = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can reset inventory");
      return;
    }
    
    setShowResetDialog(true);
  };
  
  const confirmResetInventory = () => {
    setItems([]);
    localStorage.setItem('hotelBarInventory', JSON.stringify([]));
    toast.success("All inventory items have been deleted");
    setShowResetDialog(false);
  };

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

  const handleSort = (field: "name" | "quantity" | "unitPrice") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your bar inventory across all locations
          </p>
        </div>
        <div className="flex space-x-2">
          {hasPermission(['manager']) && (
            <Button 
              className="flex items-center gap-2" 
              variant="destructive"
              onClick={handleResetInventory}
            >
              <Trash2 className="h-4 w-4" /> Reset All
            </Button>
          )}
          <Button 
            className="flex items-center gap-2" 
            onClick={handleAddItem}
            disabled={!hasPermission(['manager'])}
          >
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>
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
        allItems={items}
        onTransfer={handleSaveTransfer}
      />

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Inventory</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete ALL inventory items across all bars. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetInventory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
