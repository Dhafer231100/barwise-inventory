
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { MenuItem, Order } from "@/utils/types";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  BadgeCheck,
  Beer,
  ChevronDown,
  Clock,
  Coffee,
  Edit,
  Filter,
  GlassWater,
  Plus,
  RotateCcw,
  Search,
  Timer,
  Wine,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Mock menu items
const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Mojito",
    category: "Cocktails",
    price: 12.99,
    ingredients: [
      { itemId: "3", quantity: 0.1 },
      { itemId: "7", quantity: 0.05 },
      { itemId: "8", quantity: 0.03 },
    ],
    barId: "1",
    available: true,
  },
  {
    id: "2",
    name: "Margarita",
    category: "Cocktails",
    price: 14.99,
    ingredients: [
      { itemId: "4", quantity: 0.1 },
      { itemId: "7", quantity: 0.05 },
      { itemId: "8", quantity: 0.03 },
    ],
    barId: "1",
    available: true,
  },
  {
    id: "3",
    name: "Old Fashioned",
    category: "Cocktails",
    price: 16.99,
    ingredients: [
      { itemId: "5", quantity: 0.1 },
      { itemId: "8", quantity: 0.02 },
      { itemId: "10", quantity: 1 },
    ],
    barId: "1",
    available: true,
  },
  {
    id: "4",
    name: "Gin & Tonic",
    category: "Classics",
    price: 10.99,
    ingredients: [{ itemId: "2", quantity: 0.1 }],
    barId: "1",
    available: true,
  },
  {
    id: "5",
    name: "Vodka Soda",
    category: "Classics",
    price: 9.99,
    ingredients: [{ itemId: "1", quantity: 0.1 }],
    barId: "1",
    available: true,
  },
  {
    id: "6",
    name: "Whiskey Sour",
    category: "Cocktails",
    price: 13.99,
    ingredients: [
      { itemId: "5", quantity: 0.1 },
      { itemId: "7", quantity: 0.05 },
      { itemId: "8", quantity: 0.03 },
    ],
    barId: "2",
    available: true,
  },
  {
    id: "7",
    name: "Pina Colada",
    category: "Tropical",
    price: 15.99,
    ingredients: [{ itemId: "3", quantity: 0.1 }],
    barId: "2",
    available: true,
  },
  {
    id: "8",
    name: "House Wine (Glass)",
    category: "Wine",
    price: 8.99,
    ingredients: [{ itemId: "6", quantity: 0.175 }],
    barId: "3",
    available: true,
  },
  {
    id: "9",
    name: "Espresso Martini",
    category: "Signature",
    price: 17.99,
    ingredients: [{ itemId: "1", quantity: 0.1 }],
    barId: "3",
    available: true,
  },
  {
    id: "10",
    name: "Negroni",
    category: "Classics",
    price: 16.99,
    ingredients: [{ itemId: "2", quantity: 0.08 }],
    barId: "3",
    available: false,
  },
];

// Mock orders
const mockOrders: Order[] = [
  {
    id: "1",
    barId: "1",
    customerName: "Table 12",
    tableNumber: "12",
    items: [
      { menuItemId: "1", quantity: 2 },
      { menuItemId: "4", quantity: 1 },
    ],
    totalPrice: 36.97,
    status: "pending",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
  },
  {
    id: "2",
    barId: "1",
    customerName: "Table 8",
    tableNumber: "8",
    items: [
      { menuItemId: "2", quantity: 1 },
      { menuItemId: "3", quantity: 1 },
    ],
    totalPrice: 31.98,
    status: "preparing",
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(), // 8 min ago
  },
  {
    id: "3",
    barId: "2",
    customerName: "Room 302",
    items: [{ menuItemId: "7", quantity: 2 }],
    totalPrice: 31.98,
    status: "completed",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
    completedAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
  },
  {
    id: "4",
    barId: "3",
    customerName: "Table 3",
    tableNumber: "3",
    items: [
      { menuItemId: "8", quantity: 2 },
      { menuItemId: "9", quantity: 1 },
    ],
    totalPrice: 35.97,
    status: "completed",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(), // 60 min ago
    completedAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
  },
  {
    id: "5",
    barId: "1",
    customerName: "Table 15",
    tableNumber: "15",
    items: [{ menuItemId: "5", quantity: 4 }],
    totalPrice: 39.96,
    status: "cancelled",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(), // 120 min ago
  },
];

const barNames: Record<string, string> = {
  "1": "Main Bar",
  "2": "Pool Bar",
  "3": "Lounge Bar",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Cocktails: <GlassWater className="h-4 w-4" />,
  Classics: <Wine className="h-4 w-4" />,
  Tropical: <Beer className="h-4 w-4" />,
  Wine: <Wine className="h-4 w-4" />,
  Signature: <Coffee className="h-4 w-4" />,
};

const BarManagement = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBar, setSelectedBar] = useState<string>("all");
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("all");

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // Filter menu items based on search, category, and bar
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesBar = selectedBar === "all" || item.barId === selectedBar;
    return matchesSearch && matchesCategory && matchesBar;
  });

  // Filter orders based on search, status, and bar
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedOrderStatus === "all" || order.status === selectedOrderStatus;
    const matchesBar = selectedBar === "all" || order.barId === selectedBar;
    return matchesStatus && matchesBar;
  });

  // Get unique categories for filter
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  const getOrderStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "preparing":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <Timer className="h-3 w-3 mr-1" /> Preparing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="border-emerald-500 text-emerald-700">
            <BadgeCheck className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="border-rose-500 text-rose-700">
            <X className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
  
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
  
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
  
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
  
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
  
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <Layout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Bar Management
            </h2>
            <p className="text-muted-foreground">
              Manage your menu and orders across all bars
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === "menu" && (
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Menu Item
              </Button>
            )}
            {activeTab === "orders" && (
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> New Order
              </Button>
            )}
          </div>
        </div>

        <Tabs
          defaultValue="menu"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="menu">Menu</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Select value={selectedBar} onValueChange={setSelectedBar}>
                <SelectTrigger className="w-[160px]">
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

          <TabsContent value="menu" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search menu items..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex">
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
                </div>
              </div>

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
                          >
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Bar</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Price
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
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
                    {filteredMenuItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No menu items found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMenuItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="bg-muted rounded p-1">
                                {categoryIcons[item.category] || (
                                  <GlassWater className="h-4 w-4" />
                                )}
                              </div>
                              {item.name}
                            </div>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{barNames[item.barId]}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {item.available ? (
                              <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-rose-500 text-rose-700">
                                Unavailable
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
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Item
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {item.available
                                    ? "Mark Unavailable"
                                    : "Mark Available"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
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
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-8"
                  />
                </div>
                <div className="flex">
                  <Select
                    value={selectedOrderStatus}
                    onValueChange={setSelectedOrderStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Bar</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{barNames[order.barId]}</TableCell>
                          <TableCell>{timeAgo(order.createdAt)}</TableCell>
                          <TableCell>
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{" "}
                            items
                          </TableCell>
                          <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            {getOrderStatusBadge(order.status)}
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {order.status === "pending" && (
                                  <DropdownMenuItem>
                                    Mark Preparing
                                  </DropdownMenuItem>
                                )}
                                {order.status === "preparing" && (
                                  <DropdownMenuItem>
                                    Mark Completed
                                  </DropdownMenuItem>
                                )}
                                {(order.status === "pending" ||
                                  order.status === "preparing") && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Cancel Order
                                    </DropdownMenuItem>
                                  </>
                                )}
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BarManagement;
