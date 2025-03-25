
import { InventoryItem } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: InventoryItem | null;
  onDelete: () => void;
}

export function DeleteItemDialog({ 
  open, 
  setOpen, 
  item, 
  onDelete 
}: DeleteItemDialogProps) {
  const { hasPermission } = useAuth();

  // Check permission when dialog opens
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can delete inventory items");
    }
  }, [open, setOpen, hasPermission]);

  const handleDelete = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can delete inventory items");
      setOpen(false);
      return;
    }
    onDelete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {item?.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
