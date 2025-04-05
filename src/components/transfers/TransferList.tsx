
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
import { ArrowRightIcon } from "lucide-react";

interface TransferListProps {
  filterBarId?: string;
  filterDirection?: "incoming" | "outgoing" | "all";
  limit?: number;
}

export function TransferList({ filterBarId = "all", filterDirection = "all", limit }: TransferListProps) {
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  
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
          {transfers.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell className="font-medium">{transfer.itemName}</TableCell>
              <TableCell>{barNames[transfer.sourceBarId]}</TableCell>
              <TableCell className="flex items-center gap-1">
                <ArrowRightIcon className="h-3 w-3" />
                {barNames[transfer.targetBarId]}
              </TableCell>
              <TableCell>
                {transfer.quantity} {transfer.unit}{transfer.quantity > 1 ? 's' : ''}
              </TableCell>
              <TableCell>{transfer.transferredBy}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatDistanceToNow(new Date(transfer.date), { addSuffix: true })}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
