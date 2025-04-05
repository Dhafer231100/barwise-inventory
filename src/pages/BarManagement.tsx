
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { MenuItem, TransferRecord } from "@/utils/types";
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
import { Card } from "@/components/ui/card";
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
  Beer,
  ChevronDown,
  Coffee,
  Edit,
  Filter,
  GlassWater,
  Plus,
  Search,
  Trash2,
  Wine,
  ArrowLeftRight,
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
import { TransferList } from "@/components/transfers/TransferList";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AddMenuItemDialog } from "@/components/menu/AddMenuItemDialog";
import { toast } from "sonner";

const barNames: Record<string, string> = {
  "1": "Main Bar",
  "2": "Economa",
  "3": "Restaurant",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Cocktails: <GlassWater className="h-4 w-4" />,
  Classics: <Wine className="h-4 w-4" />,
  Tropical: <Beer className="h-4 w-4" />,
  Wine: <Wine className="h-4 w-4" />,
  Signature: <Coffee className="h-4 w-4" />,
};

const BarManagement = () => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBar, setSelectedBar] = useState<string>("all");
  const [selectedTransferDirection, setSelectedTransferDirection] = useState<"all" | "incoming" | "outgoing">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResetMenuDialog, setShowResetMenuDialog] = useState(false);

  // Load menu items from localStorage
  useEffect(() => {
    const savedMenuItems = localStorage.getItem('barMenuItems');
    if (savedMenuItems) {
      setMenuItems(JSON.parse(savedMenuItems));
    } else {
      setMenuItems([]);
      localStorage.setItem('barMenuItems', JSON.stringify([]));
    }
  }, []);

  // Save menu items whenever they change
  useEffect(() => {
    localStorage.setItem('barMenuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesBar = selectedBar === "all" || item.barId === selectedBar;
    return matchesSearch && matchesCategory && matchesBar;
  });

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  const handleAddItem = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can add menu items");
      return;
    }
    setShowAddDialog(true);
  };

  const handleAddNewItem = (newItem: Omit<MenuItem, 'id'>) => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can add menu items");
      return;
    }
    
    const id = `menu-${Date.now()}`;
    const itemToAdd: MenuItem = {
      id,
      ...newItem
    };
    
    const updatedItems = [...menuItems, itemToAdd];
    setMenuItems(updatedItems);
    toast.success(`${newItem.name} has been added to the menu`);
    setShowAddDialog(false);
  };

  const handleResetMenu = () => {
    if (!hasPermission(['manager'])) {
      toast.error("Only managers can reset the menu");
      return;
    }
    setShowResetMenuDialog(true);
  };

  const confirmResetMenu = () => {
    setMenuItems([]);
    localStorage.setItem('barMenuItems', JSON.stringify([]));
    setShowResetMenuDialog(false);
    toast.success("All menu items have been deleted");
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
              Manage your menu and transfers across all bars
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === "menu" && (
              <>
                {hasPermission(['manager']) && (
                  <Button 
                    variant="destructive" 
                    className="flex items-center gap-2"
                    onClick={handleResetMenu}
                  >
                    <Trash2 className="h-4 w-4" /> Reset Menu
                  </Button>
                )}
                <Button className="flex items-center gap-2" onClick={handleAddItem}>
                  <Plus className="h-4 w-4" /> Add Menu Item
                </Button>
              </>
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
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
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
                  <SelectItem value="2">Economa</SelectItem>
                  <SelectItem value="3">Restaurant</SelectItem>
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
                          <TableCell>{item.price.toFixed(2)} TND</TableCell>
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

          <TabsContent value="transfers" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  Inventory Transfers
                </h3>
                
                <div className="ml-auto flex gap-2">
                  <Select
                    value={selectedTransferDirection}
                    onValueChange={(value: "all" | "incoming" | "outgoing") => setSelectedTransferDirection(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Direction" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transfers</SelectItem>
                      <SelectItem value="incoming">Incoming</SelectItem>
                      <SelectItem value="outgoing">Outgoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TransferList 
                filterBarId={selectedBar} 
                filterDirection={selectedTransferDirection} 
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AddMenuItemDialog
        open={showAddDialog}
        setOpen={setShowAddDialog}
        onAdd={handleAddNewItem}
      />
      
      <AlertDialog open={showResetMenuDialog} onOpenChange={setShowResetMenuDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Menu</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete ALL menu items across all bars. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetMenu} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default BarManagement;
