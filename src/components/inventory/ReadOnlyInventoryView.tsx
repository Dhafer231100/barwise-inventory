
import { InventoryItem } from "@/utils/types";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryFilters } from "./InventoryFilters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { barNames } from "@/data/mockInventoryData";
import { InventoryLevels } from "@/components/Dashboard/InventoryLevels";

export function ReadOnlyInventoryView() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBar, setSelectedBar] = useState<string>("all");
  const [chartData, setChartData] = useState<any[]>([]);

  // Load saved inventory items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('hotelBarInventory');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems);
      
      // Prepare data for the chart
      const criticalItems = parsedItems
        .filter((item: InventoryItem) => item.minimumLevel > 0)
        .slice(0, 10)
        .map((item: InventoryItem) => ({
          name: item.name,
          current: item.quantity,
          minimum: item.minimumLevel
        }));
      
      setChartData(criticalItems);
    } else {
      setItems([]);
    }
  }, []);

  const filteredItems = items
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesBar = selectedBar === "all" || item.barId === selectedBar;
      return matchesSearch && matchesCategory && matchesBar;
    });

  const categories = Array.from(new Set(items.map((item) => item.category)));

  const isLowStock = (item: InventoryItem) => item.quantity < item.minimumLevel;
  
  const isExpiringSoon = (item: InventoryItem) => {
    if (!item.expirationDate) return false;
    const expirationDate = new Date(item.expirationDate);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);
    return expirationDate < threeMonthsFromNow;
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader className="pb-2">
            <CardTitle>Inventory Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <InventoryLevels data={chartData} cardWrapper={false} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <InventoryFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBar={selectedBar}
          setSelectedBar={setSelectedBar}
          categories={categories}
        />

        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
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
                        {isLowStock(item) && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)} TND</TableCell>
                    <TableCell>
                      {isLowStock(item) ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : isExpiringSoon(item) ? (
                        <Badge variant="outline" className="border-amber-500 text-amber-700">
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                          In Stock
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
