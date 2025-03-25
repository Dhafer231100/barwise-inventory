
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sale } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteSaleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sale: Sale | null;
  onDeleteSale: (id: string) => void;
}

export function DeleteSaleDialog({ 
  open, 
  setOpen, 
  sale, 
  onDeleteSale 
}: DeleteSaleDialogProps) {
  const { hasPermission } = useAuth();

  // Check permission
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can delete sales");
    }
  }, [open, setOpen, hasPermission]);

  if (!sale) return null;

  const handleDelete = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can delete sales");
      setOpen(false);
      return;
    }
    
    onDeleteSale(sale.id);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sale</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this sale? This action cannot be undone.
            <div className="mt-4 p-4 border rounded-md">
              <p><strong>Product:</strong> {sale.productName}</p>
              <p><strong>Amount:</strong> ${sale.amount.toFixed(2)}</p>
              <p><strong>Quantity:</strong> {sale.quantity}</p>
              <p><strong>Total:</strong> ${sale.total.toFixed(2)}</p>
              <p><strong>Bar:</strong> {sale.barName}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
