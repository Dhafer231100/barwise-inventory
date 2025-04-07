
import { InventoryItem } from "@/utils/types";
import { barNames } from "@/data/mockInventoryData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ItemForm } from "./ItemForm";
import { useEditItemDialog } from "./hooks/useEditItemDialog";

interface EditItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: InventoryItem | null;
  onSave: (updatedItem: InventoryItem) => void;
}

export function EditItemDialog({ 
  open, 
  setOpen, 
  item, 
  onSave 
}: EditItemDialogProps) {
  const { isLoading, handleSubmit } = useEditItemDialog({
    open,
    setOpen,
    item,
    onSave,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Update the details of {item?.name} ({barNames[item?.barId || ""]})
          </DialogDescription>
        </DialogHeader>

        <ItemForm
          item={item}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
