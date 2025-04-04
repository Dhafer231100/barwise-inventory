
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { InventoryLevels } from "@/components/Dashboard/InventoryLevels";
import { InventoryAlert, DashboardStats, InventoryItem, Sale } from "@/utils/types";
import { BarChart3, Package2, Clock, AlertTriangle, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";
import { barNames } from "@/data/mockInventoryData";

// Initial sales data structure
const initialSalesData = [
  { name: "Mon", Main: 0, Pool: 0, Lounge: 0 },
  { name: "Tue", Main: 0, Pool: 0, Lounge: 0 },
  { name: "Wed", Main: 0, Pool: 0, Lounge: 0 },
  { name: "Thu", Main: 0, Pool: 0, Lounge: 0 },
  { name: "Fri", Main: 0, Pool: 0, Lounge: 0 },
  { name: "Sat", Main: 0, Pool: 0, Lounge: 0 },
  { name: "Sun", Main: 0, Pool: 0, Lounge: 0 },
];

const initialInventoryData = [
  { name: "Vodka", current: 0, minimum: 10 },
  { name: "Gin", current: 0, minimum: 8 },
  { name: "Rum", current: 0, minimum: 10 },
  { name: "Tequila", current: 0, minimum: 10 },
  { name: "Whiskey", current: 0, minimum: 8 },
  { name: "Wine", current: 0, minimum: 10 },
];

const initialStats: DashboardStats = {
  totalSales: 0,
  ordersCompleted: 0,
  lowStockItems: 0,
  expiringSoon: 0,
};

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [salesData, setSalesData] = useState(initialSalesData);
  const [inventoryData, setInventoryData] = useState(initialInventoryData);

  // Load data and calculate stats on component mount
  useEffect(() => {
    // Load inventory data
    const savedInventory = localStorage.getItem('hotelBarInventory');
    let inventoryItems: InventoryItem[] = [];
    
    if (savedInventory) {
      try {
        inventoryItems = JSON.parse(savedInventory);
        
        // Update inventory data for chart
        const updatedInventoryData = [...initialInventoryData];
        inventoryItems.forEach(item => {
          const dataItem = updatedInventoryData.find(
            d => d.name.toLowerCase() === item.name.toLowerCase()
          );
          if (dataItem) {
            dataItem.current = item.quantity;
          }
        });
        setInventoryData(updatedInventoryData);
        
        // Count low stock items
        const lowStockCount = inventoryItems.filter(
          item => item.quantity < item.minimumLevel
        ).length;
        
        // Check for expiring items
        const now = new Date();
        const threeDaysLater = new Date(now);
        threeDaysLater.setDate(now.getDate() + 3);
        
        const expiringCount = inventoryItems.filter(item => {
          if (!item.expirationDate) return false;
          const expDate = new Date(item.expirationDate);
          return expDate <= threeDaysLater && expDate >= now;
        }).length;
        
        // Generate alerts
        const newAlerts: InventoryAlert[] = [];
        
        // Low stock alerts
        inventoryItems
          .filter(item => item.quantity < item.minimumLevel)
          .forEach(item => {
            newAlerts.push({
              id: `low_${item.id}`,
              itemId: item.id,
              itemName: item.name,
              type: 'low_stock',
              barId: item.barId,
              barName: barNames[item.barId] || 'Unknown Bar',
              message: `Low stock: ${item.quantity} ${item.unit}(s) remaining (minimum: ${item.minimumLevel})`,
              createdAt: new Date().toISOString()
            });
          });
        
        // Expiring soon alerts
        inventoryItems
          .filter(item => {
            if (!item.expirationDate) return false;
            const expDate = new Date(item.expirationDate);
            return expDate <= threeDaysLater && expDate >= now;
          })
          .forEach(item => {
            newAlerts.push({
              id: `exp_${item.id}`,
              itemId: item.id,
              itemName: item.name,
              type: 'expiring_soon',
              barId: item.barId,
              barName: barNames[item.barId] || 'Unknown Bar',
              message: `Expiring soon: ${new Date(item.expirationDate!).toLocaleDateString()}`,
              createdAt: new Date().toISOString()
            });
          });
        
        setAlerts(newAlerts);
        
        // Update low stock and expiring stats
        setStats(prev => ({
          ...prev,
          lowStockItems: lowStockCount,
          expiringSoon: expiringCount
        }));
      } catch (error) {
        console.error('Failed to parse saved inventory:', error);
      }
    }
    
    // Load sales data
    const savedSales = localStorage.getItem('hotelBarSales');
    if (savedSales) {
      try {
        const sales: Sale[] = JSON.parse(savedSales);
        
        // Calculate total sales amount
        const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total, 0);
        
        // Count completed orders
        const ordersCount = sales.length;
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalSales: totalSalesAmount,
          ordersCompleted: ordersCount
        }));
        
        // Calculate sales data for chart
        const last7Days = getLastSevenDays();
        
        // Create a structure to hold the sales data grouped by day and bar
        const salesByDayAndBar: Record<string, Record<string, number>> = {};
        
        // Initialize all days with zero values for all bars
        last7Days.forEach(day => {
          salesByDayAndBar[day] = {
            Main: 0,
            Pool: 0,
            Lounge: 0
          };
        });
        
        // Fill in actual sales data
        sales.forEach(sale => {
          const saleDate = new Date(sale.date);
          const dayName = saleDate.toLocaleDateString('en-US', { weekday: 'short' });
          
          // Only include sales from the last 7 days
          if (last7Days.includes(dayName)) {
            // Get the bar name or default to the bar ID
            const barKey = sale.barName === "Main Bar" ? "Main" : 
                          sale.barName === "Pool Bar" ? "Pool" : 
                          sale.barName === "Rooftop Bar" ? "Lounge" : "Other";
            
            if (barKey !== "Other") {
              salesByDayAndBar[dayName][barKey] += sale.total;
            }
          }
        });
        
        // Convert the data to the format expected by the chart
        const chartData = Object.entries(salesByDayAndBar).map(([name, values]) => ({
          name,
          Main: values.Main,
          Pool: values.Pool,
          Lounge: values.Lounge
        }));
        
        // Sort the days of the week correctly
        const sortedChartData = sortDaysOfWeek(chartData);
        setSalesData(sortedChartData);
      } catch (error) {
        console.error('Failed to parse saved sales:', error);
      }
    }
  }, []);

  // Helper function to get the last seven days as short day names
  const getLastSevenDays = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
  };

  // Helper function to sort days of the week in the correct order
  const sortDaysOfWeek = (data: any[]) => {
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return [...data].sort((a, b) => 
      dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name)
    );
  };

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="space-y-8 animate-slide-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your hotel bar operations
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Sales"
            value={`$${stats.totalSales.toLocaleString()}`}
            description="All time"
            icon={DollarSign}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Orders Completed"
            value={stats.ordersCompleted}
            description="All time"
            icon={BarChart3}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            description="Needs attention"
            icon={Package2}
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            description="Next 3 days"
            icon={Clock}
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Sales Trend"
            description="Last 7 days revenue by bar"
            className="lg:col-span-2"
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "6px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #eaeaea",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Main"
                    stackId="1"
                    stroke="#2563eb"
                    fill="#3b82f680"
                  />
                  <Area
                    type="monotone"
                    dataKey="Pool"
                    stackId="1"
                    stroke="#4ade80"
                    fill="#4ade8080"
                  />
                  <Area
                    type="monotone"
                    dataKey="Lounge"
                    stackId="1"
                    stroke="#f472b6"
                    fill="#f472b680"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Alerts" className="overflow-auto">
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Card key={alert.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            alert.type === "low_stock"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{alert.itemName}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.message}
                          </p>
                          <div className="flex justify-between items-center pt-1">
                            <span className="text-xs text-muted-foreground">
                              {alert.barName}
                            </span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  No alerts found
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <InventoryLevels data={inventoryData} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
