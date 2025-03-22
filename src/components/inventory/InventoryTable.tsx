
import { InventoryItem } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { barNames } from "@/data/mockInventoryData";
import { InventoryTableRow } from "@/components/inventory/InventoryTableRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
  onSort: (field: "name" | "quantity" | "unitPrice") => void;
  sortField: "name" | "quantity" | "unitPrice";
  sortDirection: "asc" | "desc";
  onViewDetails: (item: InventoryItem) => void;
  onEditItem: (item: InventoryItem) => void;
  onTransferItem: (item: InventoryItem) => void;
  onDeleteItem: (item: InventoryItem) => void;
}

export function InventoryTable({
  items,
  onSort,
  sortField,
  sortDirection,
  onViewDetails,
  onEditItem,
  onTransferItem,
  onDeleteItem,
}: InventoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <div className="flex items-center gap-1">
                Item
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5"
                  onClick={() => onSort("name")}
                >
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Quantity
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5"
                  onClick={() => onSort("quantity")}
                >
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Price
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5"
                  onClick={() => onSort("unitPrice")}
                >
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No inventory items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <InventoryTableRow 
                key={item.id}
                item={item}
                onViewDetails={onViewDetails}
                onEditItem={onEditItem}
                onTransferItem={onTransferItem}
                onDeleteItem={onDeleteItem}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
