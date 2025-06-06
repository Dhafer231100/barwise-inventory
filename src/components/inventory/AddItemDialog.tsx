import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/utils/types";
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
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { itemFormSchema } from "./schemas/itemFormSchema";

const SUPPLIERS = [
  { id: "1", name: "Premium Liquors" },
  { id: "2", name: "Craft Spirits Inc." },
  { id: "3", name: "Fresh Produce Co." },
];

const BARS = [
  { id: "1", name: "Main Bar" },
  { id: "2", name: "Economa" },
  { id: "3", name: "Restaurant" },
];

const CATEGORIES = [
  "Spirits",
  "Wine",
  "Beer",
  "Mixers",
  "Garnishes",
  "Glassware",
  "Other",
  "Patisserie",
  "Resto",
  "Bar"
];

const UNITS = [
  "kg",
  "L",
  "Pcs",
  "Bottle"
];

const TAX_RATES = [
  { value: "0", label: "0%" },
  { value: "7", label: "7%" },
  { value: "19", label: "19%" }
];

interface AddItemDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAdd: (newItem: Omit<InventoryItem, "id">) => void;
}

export function AddItemDialog({ open, setOpen, onAdd }: AddItemDialogProps) {
  const { hasPermission } = useAuth();
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    category: "Spirits",
    quantity: 0,
    unit: "Bottle",
    unitPrice: 0,
    barId: "1",
    supplierId: "1",
    minimumLevel: 5,
    taxRate: 19,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newItem.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (newItem.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (!newItem.unitPrice || parseFloat(newItem.unitPrice.toString()) <= 0) {
      newErrors.unitPrice = "Price must be greater than 0";
    }

    if (!newItem.unit.trim()) {
      newErrors.unit = "Unit is required";
    }

    if (newItem.minimumLevel < 0) {
      newErrors.minimumLevel = "Minimum level cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!hasPermission(["manager"])) {
      toast.error("Only managers can add inventory items");
      setOpen(false);
      return;
    }

    if (validateForm()) {
      onAdd(newItem);
    }
  };

  const handleChange = (
    field: keyof Omit<InventoryItem, "id">,
    value: string | number
  ) => {
    if (field === "unitPrice") {
      setNewItem((prev) => ({
        ...prev,
        [field]: parseFloat(value.toString()) || 0,
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setNewItem({
      name: "",
      category: "Spirits",
      quantity: 0,
      unit: "Bottle",
      unitPrice: 0,
      barId: "1",
      supplierId: "1",
      minimumLevel: 5,
      taxRate: 19,
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
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>
            Create a new item in your inventory. Fill out all fields below.
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
              <Label htmlFor="quantity" className="mb-2 block">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={newItem.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && (
                <p className="text-destructive text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="unit" className="mb-2 block">
                Unit
              </Label>
              <Select
                value={newItem.unit}
                onValueChange={(value) => handleChange("unit", value)}
              >
                <SelectTrigger className={errors.unit ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-destructive text-sm mt-1">{errors.unit}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unitPrice" className="mb-2 block">
                Price per Unit (TND)
              </Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
                className={errors.unitPrice ? "border-destructive" : ""}
                placeholder="Enter price"
              />
              {errors.unitPrice && (
                <p className="text-destructive text-sm mt-1">{errors.unitPrice}</p>
              )}
            </div>

            <div>
              <Label htmlFor="minimumLevel" className="mb-2 block">
                Minimum Stock Level
              </Label>
              <Input
                id="minimumLevel"
                type="number"
                min="0"
                value={newItem.minimumLevel}
                onChange={(e) => handleChange("minimumLevel", Number(e.target.value))}
                className={errors.minimumLevel ? "border-destructive" : ""}
              />
              {errors.minimumLevel && (
                <p className="text-destructive text-sm mt-1">{errors.minimumLevel}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="supplierId" className="mb-2 block">
                Supplier
              </Label>
              <Select
                value={newItem.supplierId}
                onValueChange={(value) => handleChange("supplierId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIERS.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">
              Tax Rate
            </Label>
            <RadioGroup 
              defaultValue={newItem.taxRate.toString()}
              className="flex space-x-4"
              onValueChange={(value) => handleChange("taxRate", Number(value))}
            >
              {TAX_RATES.map((rate) => (
                <div key={rate.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={rate.value} id={`tax-${rate.value}`} />
                  <Label htmlFor={`tax-${rate.value}`}>{rate.label}</Label>
                </div>
              ))}
            </RadioGroup>
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
