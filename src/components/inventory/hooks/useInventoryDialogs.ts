
import { useState } from "react";
import { InventoryItem } from "@/utils/types";

export function useInventoryDialogs() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  return {
    selectedItem,
    setSelectedItem,
    showDeleteDialog,
    setShowDeleteDialog,
    showEditDialog,
    setShowEditDialog,
    showAddDialog,
    setShowAddDialog,
    showTransferDialog,
    setShowTransferDialog
  };
}
