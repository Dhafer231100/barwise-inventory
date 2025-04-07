
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { InventoryItem } from "@/utils/types";
import { toast } from "sonner";
import { ItemFormValues } from "../schemas/itemFormSchema";

interface UseEditItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: InventoryItem | null;
  onSave: (updatedItem: InventoryItem) => void;
}

export function useEditItemDialog({ open, setOpen, item, onSave }: UseEditItemDialogProps) {
  const { hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check permission when dialog opens
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can edit inventory items");
    }
  }, [open, setOpen, hasPermission]);
  
  const handleSubmit = async (values: ItemFormValues) => {
    if (!hasPermission(['manager']) || !item) {
      toast.error("Only managers can edit inventory items");
      setOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // Simulating a server request with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedItem: InventoryItem = {
        ...item,
        name: values.name,
        category: values.category,
        quantity: values.quantity,
        unitPrice: values.unitPrice,
        minimumLevel: values.minimumLevel,
        expirationDate: values.expirationDate,
      };

      onSave(updatedItem);
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    handleSubmit,
  };
}
