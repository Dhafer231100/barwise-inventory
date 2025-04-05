
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuItem } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Menu item categories
const CATEGORIES = [
  "Cocktails",
  "Classics",
  "Tropical",
  "Wine",
  "Signature",
  "Beer",
  "Soft Drinks",
  "Food",
  "Other"
];

// Bar locations
const BARS = [
  { id: "1", name: "Main Bar" },
  { id: "2", name: "Economa" },
  { id: "3", name: "Restaurant" },
];

interface AddMenuItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (newItem: Omit<MenuItem, "id">) => void;
}

export function AddMenuItemDialog({ open, setOpen, onAdd }: AddMenuItemDialogProps) {
  const { hasPermission } = useAuth();
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    category: "Cocktails",
    price: 0,
    ingredients: [],
    barId: "1",
    available: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newItem.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (newItem.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!hasPermission(["manager"])) {
      toast.error("Only managers can add menu items");
      setOpen(false);
      return;
    }

    if (validateForm()) {
      onAdd(newItem);
    }
  };

  const handleChange = (
    field: keyof Omit<MenuItem, "id">,
    value: string | number | boolean
  ) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user types
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setNewItem({
      name: "",
      category: "Cocktails",
      price: 0,
      ingredients: [],
      barId: "1",
      available: true,
    });
    setErrors({});
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetForm();
        }
        setOpen(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
          <DialogDescription>
            Create a new item for your bar menu. Fill out all fields below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Item Name
              </Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category" className="mb-2 block">
                Category
              </Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="mb-2 block">
                Price (TND)
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-destructive text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <Label htmlFor="barId" className="mb-2 block">
                Bar Location
              </Label>
              <Select
                value={newItem.barId}
                onValueChange={(value) => handleChange("barId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bar" />
                </SelectTrigger>
                <SelectContent>
                  {BARS.map((bar) => (
                    <SelectItem key={bar.id} value={bar.id}>
                      {bar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="available"
              checked={newItem.available}
              onCheckedChange={(checked) => handleChange("available", checked)}
            />
            <Label htmlFor="available">Item is available</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
