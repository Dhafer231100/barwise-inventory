
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddSaleDialog } from "@/components/sales/AddSaleDialog";
import { EditSaleDialog } from "@/components/sales/EditSaleDialog";
import { DeleteSaleDialog } from "@/components/sales/DeleteSaleDialog";
import { SalesStats } from "@/components/sales/SalesStats";
import { Sale } from "@/utils/types";
import { PlusCircle, Pencil, Trash2, BarChart3, RefreshCcw } from "lucide-react";

// Empty sales data array (reset all sales)
const MOCK_SALES: Sale[] = [];

const SalesManagement = () => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [filteredSales, setFilteredSales] = useState<Sale[]>(MOCK_SALES);
  const [searchTerm, setSearchTerm] = useState("");
  const [barFilter, setBarFilter] = useState("all");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Check permissions
  const canManageSales = hasPermission(['manager']);

  // Load sales from localStorage on mount
  useEffect(() => {
    const savedSales = localStorage.getItem('hotelBarSales');
    if (savedSales) {
      try {
        setSales(JSON.parse(savedSales));
      } catch (error) {
        console.error('Failed to parse saved sales:', error);
      }
    }
  }, []);

  // Save sales to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hotelBarSales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    // Filter sales based on search term and bar filter
    let filtered = [...sales];
    
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.staffName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (barFilter !== 'all') {
      filtered = filtered.filter(sale => sale.barId === barFilter);
    }
    
    setFilteredSales(filtered);
  }, [sales, searchTerm, barFilter]);

  // Check authentication
  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // Reset all sales data
  const handleResetSales = () => {
    if (!canManageSales) {
      toast.error("Only managers can reset sales");
      return;
    }
    
    setSales([]);
    localStorage.removeItem('hotelBarSales');
    toast.success("All sales have been reset");
  };

  // Handler for adding a new sale
  const handleAddSale = (sale: Omit<Sale, 'id'>) => {
    if (!canManageSales) {
      toast.error("Only managers can add sales");
      return;
    }
    
    const newSale: Sale = {
      ...sale,
      id: (sales.length + 1).toString(),
      total: sale.amount * sale.quantity
    };
    
    setSales(prev => [newSale, ...prev]);
    toast.success("Sale added successfully");
    setIsAddDialogOpen(false);
  };

  // Handler for editing a sale
  const handleEditSale = (updatedSale: Sale) => {
    if (!canManageSales) {
      toast.error("Only managers can edit sales");
      return;
    }
    
    setSales(prev => 
      prev.map(sale => sale.id === updatedSale.id ? 
        { ...updatedSale, total: updatedSale.amount * updatedSale.quantity } : 
        sale
      )
    );
    toast.success("Sale updated successfully");
    setIsEditDialogOpen(false);
  };

  // Handler for deleting a sale
  const handleDeleteSale = (id: string) => {
    if (!canManageSales) {
      toast.error("Only managers can delete sales");
      return;
    }
    
    setSales(prev => prev.filter(sale => sale.id !== id));
    toast.success("Sale deleted successfully");
    setIsDeleteDialogOpen(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sales Management</h2>
            <p className="text-muted-foreground">
              View and manage all bar sales
            </p>
          </div>
          <div className="flex items-center gap-2">
            {canManageSales && (
              <>
                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Sale
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleResetSales}
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset All Sales
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowStats(!showStats)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showStats ? "Hide Stats" : "Show Stats"}
            </Button>
          </div>
        </div>

        {showStats && (
          <SalesStats sales={sales} />
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={barFilter} onValueChange={setBarFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by bar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bars</SelectItem>
                  <SelectItem value="1">Main Bar</SelectItem>
                  <SelectItem value="2">Pool Bar</SelectItem>
                  <SelectItem value="3">Rooftop Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DashboardCard title={`Sales (${filteredSales.length})`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Bar</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Staff</TableHead>
                    {canManageSales && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.productName}</TableCell>
                        <TableCell>{sale.barName}</TableCell>
                        <TableCell>${sale.amount.toFixed(2)}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>${sale.total.toFixed(2)}</TableCell>
                        <TableCell>{formatDate(sale.date)}</TableCell>
                        <TableCell>{sale.staffName}</TableCell>
                        {canManageSales && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={canManageSales ? 8 : 7} className="text-center py-8">
                        No sales found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Dialogs */}
      <AddSaleDialog
        open={isAddDialogOpen}
        setOpen={setIsAddDialogOpen}
        onAddSale={handleAddSale}
      />
      
      <EditSaleDialog
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        sale={selectedSale}
        onEditSale={handleEditSale}
      />
      
      <DeleteSaleDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        sale={selectedSale}
        onDeleteSale={handleDeleteSale}
      />
    </Layout>
  );
};

export default SalesManagement;
