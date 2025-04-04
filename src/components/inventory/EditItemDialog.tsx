
import { InventoryItem } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { barNames } from "@/data/mockInventoryData";

interface EditItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: InventoryItem | null;
  onSave: (updatedItem: InventoryItem) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  quantity: z.coerce.number().min(0, {
    message: "Quantity must be a positive number.",
  }),
  unitPrice: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  minimumLevel: z.coerce.number().min(0, {
    message: "Minimum level must be a positive number.",
  }),
  expirationDate: z.string().optional(),
});

export function EditItemDialog({ 
  open, 
  setOpen, 
  item, 
  onSave 
}: EditItemDialogProps) {
  const { hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || "",
      category: item?.category || "",
      quantity: item?.quantity || 0,
      unitPrice: item?.unitPrice || 0,
      minimumLevel: item?.minimumLevel || 0,
      expirationDate: item?.expirationDate || "",
    },
  });

  // Update form when item changes
  useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        minimumLevel: item.minimumLevel,
        expirationDate: item.expirationDate || "",
      });
    }
  }, [item, form]);

  // Check permission when dialog opens
  useEffect(() => {
    if (open && !hasPermission(['manager'])) {
      setOpen(false);
      toast.error("Only managers can edit inventory items");
    }
  }, [open, setOpen, hasPermission]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Update the details of {item?.name} ({barNames[item?.barId || ""]})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price (TND)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minimumLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Level</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
