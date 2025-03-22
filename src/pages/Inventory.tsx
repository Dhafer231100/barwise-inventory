
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { InventoryItem } from "@/utils/types";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Eye,
  Filter,
  Package2,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock inventory data
const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Absolut Vodka",
    category: "Spirits",
    quantity: 24,
    unit: "bottle",
    unitPrice: 18.99,
    barId: "1",
    supplierId: "1",
    expirationDate: "2024-12-31",
    minimumLevel: 10,
  },
  {
    id: "2",
    name: "Bombay Sapphire Gin",
    category: "Spirits",
    quantity: 18,
    unit: "bottle",
    unitPrice: 22.50,
    barId: "1",
    supplierId: "1",
    expirationDate: "2024-12-31",
    minimumLevel: 8,
  },
  {
    id: "3",
    name: "Captain Morgan Rum",
    category: "Spirits",
    quantity: 12,
    unit: "bottle",
    unitPrice: 16.75,
    barId: "1",
    supplierId: "2",
    expirationDate: "2024-12-31",
    minimumLevel: 10,
  },
  {
    id: "4",
    name: "Jose Cuervo Tequila",
    category: "Spirits",
    quantity: 9,
    unit: "bottle",
    unitPrice: 19.99,
    barId: "1",
    supplierId: "2",
    expirationDate: "2024-12-31",
    minimumLevel: 10,
  },
  {
    id: "5",
    name: "Jack Daniel's Whiskey",
    category: "Spirits",
    quantity: 15,
    unit: "bottle",
    unitPrice: 24.99,
    barId: "2",
    supplierId: "1",
    expirationDate: "2024-12-31",
    minimumLevel: 8,
  },
  {
    id: "6",
    name: "Chardonnay Wine",
    category: "Wine",
    quantity: 7,
    unit: "bottle",
    unitPrice: 12.99,
    barId: "2",
    supplierId: "3",
    expirationDate: "2024-06-30",
    minimumLevel: 10,
  },
  {
    id: "7",
    name: "Fresh Lime Juice",
    category: "Mixers",
    quantity: 5,
    unit: "bottle",
    unitPrice: 3.99,
    barId: "3",
    supplierId: "4",
    expirationDate: "2023-06-15",
    minimumLevel: 8,
  },
  {
    id: "8",
    name: "Simple Syrup",
    category: "Mixers",
    quantity: 8,
    unit: "bottle",
    unitPrice: 2.99,
    barId: "3",
    supplierId: "4",
    expirationDate: "2023-09-30",
    minimumLevel: 5,
  },
  {
    id: "9",
    name: "Cocktail Olives",
    category: "Garnish",
    quantity: 12,
    unit: "jar",
    unitPrice: 4.50,
    barId: "1",
    supplierId: "3",
    expirationDate: "2023-12-31",
    minimumLevel: 6,
  },
  {
    id: "10",
    name: "Cocktail Cherries",
    category: "Garnish",
    quantity: 14,
    unit: "jar",
    unitPrice: 5.25,
    barId: "2",
    supplierId: "3",
    expirationDate: "2023-12-31",
    minimumLevel: 6,
  },
];

const barNames: Record<string, string> = {
  "1": "Main Bar",
  "2": "Pool Bar",
  "3": "Lounge Bar",
};

const Inventory = () => {
  const { isAuthenticated, loading } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBar, setSelectedBar] = useState<string>("all");

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // Filter items based on search, category, and bar
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesBar = selectedBar === "all" || item.barId === selectedBar;
    return matchesSearch && matchesCategory && matchesBar;
  });

  // Get unique categories for filter
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
    <Layout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
            <p className="text-muted-foreground">
              Manage your bar inventory across all locations
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBar} onValueChange={setSelectedBar}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Bar" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bars</SelectItem>
                  <SelectItem value="1">Main Bar</SelectItem>
                  <SelectItem value="2">Pool Bar</SelectItem>
                  <SelectItem value="3">Lounge Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center gap-1">
                      Item
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Quantity
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Item</DropdownMenuItem>
                            <DropdownMenuItem>Transfer</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
