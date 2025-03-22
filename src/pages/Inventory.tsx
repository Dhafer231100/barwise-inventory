
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
import { mockInventoryItems } from "@/data/mockInventoryData";

const Inventory = () => {
  const { isAuthenticated, loading } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBar, setSelectedBar] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortField, setSortField] = useState<"name" | "quantity" | "unitPrice">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // Filter items based on search, category, and bar
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

  // Get unique categories for filter
  const categories = Array.from(new Set(items.map((item) => item.category)));

  // Action handlers
  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    toast.info(`Viewing details for ${item.name}`);
  };

  const handleEditItem = (item: InventoryItem) => {
    toast.info(`Editing ${item.name}`);
  };

  const handleTransferItem = (item: InventoryItem) => {
    toast.info(`Transfer ${item.name} between bars`);
  };

  const confirmDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      // Filter out the item to delete
      setItems(items.filter(item => item.id !== selectedItem.id));
      toast.success(`${selectedItem.name} has been deleted`);
      setShowDeleteDialog(false);
      setSelectedItem(null);
    }
  };

  const handleAddItem = () => {
    toast.info("Opening add item form");
  };

  const handleSort = (field: "name" | "quantity" | "unitPrice") => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
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
          <Button className="flex items-center gap-2" onClick={handleAddItem}>
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
    </Layout>
  );
};

export default Inventory;
