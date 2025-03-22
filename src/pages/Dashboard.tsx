
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { InventoryLevels } from "@/components/Dashboard/InventoryLevels";
import { InventoryAlert, DashboardStats } from "@/utils/types";
import { BarChart3, Package2, Clock, AlertTriangle, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";

const salesData = [
  { name: "Mon", Main: 4000, Pool: 2400, Lounge: 1800 },
  { name: "Tue", Main: 3000, Pool: 1398, Lounge: 2000 },
  { name: "Wed", Main: 2000, Pool: 9800, Lounge: 2290 },
  { name: "Thu", Main: 2780, Pool: 3908, Lounge: 2500 },
  { name: "Fri", Main: 4890, Pool: 4800, Lounge: 3100 },
  { name: "Sat", Main: 6390, Pool: 5800, Lounge: 4200 },
  { name: "Sun", Main: 5490, Pool: 4300, Lounge: 3800 },
];

const inventoryData = [
  { name: "Vodka", current: 24, minimum: 10 },
  { name: "Gin", current: 18, minimum: 8 },
  { name: "Rum", current: 12, minimum: 10 },
  { name: "Tequila", current: 9, minimum: 10 },
  { name: "Whiskey", current: 15, minimum: 8 },
  { name: "Wine", current: 7, minimum: 10 },
];

const mockAlerts: InventoryAlert[] = [
  {
    id: "1",
    itemId: "1",
    itemName: "Tequila",
    type: "low_stock",
    barId: "1",
    barName: "Main Bar",
    message: "Tequila is below minimum stock level (9 of 10)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    itemId: "2",
    itemName: "Wine",
    type: "low_stock",
    barId: "1",
    barName: "Main Bar",
    message: "Wine is below minimum stock level (7 of 10)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    itemId: "3",
    itemName: "Fresh Lime Juice",
    type: "expiring_soon",
    barId: "2",
    barName: "Pool Bar",
    message: "Fresh Lime Juice expiring in 2 days",
    createdAt: new Date().toISOString(),
  },
];

const mockStats: DashboardStats = {
  totalSales: 24590,
  ordersCompleted: 386,
  lowStockItems: 2,
  expiringSoon: 1,
};

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [alerts, setAlerts] = useState<InventoryAlert[]>(mockAlerts);

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
            description="Last 7 days"
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Orders Completed"
            value={stats.ordersCompleted}
            description="Last 7 days"
            icon={BarChart3}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            description="Needs attention"
            icon={Package2}
            trend={{ value: 5, isPositive: false }}
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
              {alerts.map((alert) => (
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
              ))}
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
