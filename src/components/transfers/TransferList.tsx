
import { useState, useEffect } from "react";
import { TransferRecord } from "@/utils/types";
import { barNames } from "@/data/mockInventoryData";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, PackageIcon } from "lucide-react";

interface TransferListProps {
  filterBarId?: string;
  filterDirection?: "incoming" | "outgoing" | "all";
  limit?: number;
}

export function TransferList({ filterBarId = "all", filterDirection = "all", limit }: TransferListProps) {
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [groupedByDate, setGroupedByDate] = useState<Record<string, TransferRecord[]>>({});
  
  useEffect(() => {
    const savedTransfers = localStorage.getItem('barTransferRecords') || '[]';
    let transfersData = JSON.parse(savedTransfers) as TransferRecord[];
    
    // Apply filters
    if (filterBarId !== "all") {
      if (filterDirection === "incoming") {
        transfersData = transfersData.filter(transfer => transfer.targetBarId === filterBarId);
      } else if (filterDirection === "outgoing") {
        transfersData = transfersData.filter(transfer => transfer.sourceBarId === filterBarId);
      } else {
        transfersData = transfersData.filter(transfer => 
          transfer.sourceBarId === filterBarId || transfer.targetBarId === filterBarId
        );
      }
    }
    
    // Sort by date (newest first)
    transfersData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Group by date and time (transfers done together)
    const grouped: Record<string, TransferRecord[]> = {};
    transfersData.forEach(transfer => {
      // Use the first 16 chars of ISO date (YYYY-MM-DDTHH:MM) to group transfers done at the same time
      const dateKey = transfer.date.substring(0, 16);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(transfer);
    });
    
    setGroupedByDate(grouped);
    
    // Apply limit if provided
    if (limit && limit > 0) {
      transfersData = transfersData.slice(0, limit);
    }
    
    setTransfers(transfersData);
  }, [filterBarId, filterDirection, limit]);
  
  if (transfers.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground">No transfers found.</p>
      </div>
    );
  }

  // Function to show grouped or individual transfers
  const renderTransfers = () => {
    // Get date keys and sort by most recent
    const dateKeys = Object.keys(groupedByDate).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    // Apply limit if needed
    const limitedKeys = limit ? dateKeys.slice(0, limit) : dateKeys;
    
    return limitedKeys.map(dateKey => {
      const transferGroup = groupedByDate[dateKey];
      const firstTransfer = transferGroup[0];
      const date = new Date(firstTransfer.date);
      
      return (
        <TableRow key={dateKey} className={transferGroup.length > 1 ? "bg-muted/20" : ""}>
          <TableCell className="font-medium">
            {transferGroup.length > 1 ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="mr-2">
                  {transferGroup.length} items
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {transferGroup.map(t => t.itemName).join(", ")}
                </span>
              </div>
            ) : (
              firstTransfer.itemName
            )}
          </TableCell>
          <TableCell>{barNames[firstTransfer.sourceBarId]}</TableCell>
          <TableCell className="flex items-center gap-1">
            <ArrowRightIcon className="h-3 w-3" />
            {barNames[firstTransfer.targetBarId]}
          </TableCell>
          <TableCell>
            {transferGroup.length > 1 ? (
              <span>Multiple items</span>
            ) : (
              <span>
                {firstTransfer.quantity} {firstTransfer.unit}
                {firstTransfer.quantity > 1 ? 's' : ''}
              </span>
            )}
          </TableCell>
          <TableCell>{firstTransfer.transferredBy}</TableCell>
          <TableCell>
            <Badge variant="outline">
              {formatDistanceToNow(date, { addSuffix: true })}
            </Badge>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderTransfers()}
        </TableBody>
      </Table>
    </div>
  );
}
