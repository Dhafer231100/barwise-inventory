
import { InventoryItem } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { barNames } from "@/data/mockInventoryData";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, ChevronDown, Eye, Edit, MoveHorizontal, Package2, Trash } from "lucide-react";
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InventoryTableRowProps {
  item: InventoryItem;
  onViewDetails: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onTransferItem: (item: InventoryItem) => void;
  onDeleteItem: (item: InventoryItem) => void;
}

export function InventoryTableRow({
  item,
  onViewDetails,
  onEditItem,
  onTransferItem,
  onDeleteItem,
}: InventoryTableRowProps) {
  const { user, hasPermission } = useAuth();
  const isLowStock = item.quantity < item.minimumLevel;
  const canEdit = hasPermission(['manager']);
  
  const isExpiringSoon = () => {
    if (!item.expirationDate) return false;
    const expirationDate = new Date(item.expirationDate);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    return expirationDate < threeMonthsFromNow;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded p-1">
            <Package2 className="h-4 w-4" />
          </div>
          {item.name}
        </div>
      </TableCell>
      <TableCell>{item.category}</TableCell>
      <TableCell>{barNames[item.barId]}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>
            {item.quantity} {item.unit}
            {item.quantity !== 1 ? "s" : ""}
          </span>
          {isLowStock && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </div>
      </TableCell>
      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
      <TableCell>
        {isLowStock ? (
          <Badge variant="destructive">Low Stock</Badge>
        ) : isExpiringSoon() ? (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            Expiring Soon
          </Badge>
        ) : (
          <Badge variant="outline" className="border-emerald-500 text-emerald-700">
            In Stock
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(item)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => onEditItem(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Item
              </DropdownMenuItem>
            )}
            {canEdit && (
              <DropdownMenuItem onClick={() => onTransferItem(item)}>
                <MoveHorizontal className="mr-2 h-4 w-4" />
                Transfer
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {canEdit && (
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDeleteItem(item)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
