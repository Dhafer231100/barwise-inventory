
import { useMemo } from "react";
import { Sale } from "@/utils/types";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

// Colors for charts
const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

// Empty data for charts when no sales exist
const emptyBarData = [
  { name: "No Data", value: 0 }
];

const emptyPieData = [
  { name: "No Data", revenue: 0, count: 0 }
];

interface SalesStatsProps {
  sales: Sale[];
}

export function SalesStats({ sales }: SalesStatsProps) {
  // Calculate sales by bar
  const salesByBar = useMemo(() => {
    if (!sales || sales.length === 0) {
      return emptyBarData;
    }
    
    const barMap = new Map<string, number>();
    
    sales.forEach(sale => {
      if (!sale.barName) return; // Skip sales with missing bar names
      
      const currentTotal = barMap.get(sale.barName) || 0;
      barMap.set(sale.barName, currentTotal + sale.total);
    });
    
    return Array.from(barMap.entries()).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  }, [sales]);
  
  // Calculate top selling products
  const topProducts = useMemo(() => {
    if (!sales || sales.length === 0) {
      return emptyPieData;
    }
    
    const productMap = new Map<string, { total: number, count: number }>();
    
    sales.forEach(sale => {
      if (!sale.productName) return; // Skip sales with missing product names
      
      const current = productMap.get(sale.productName) || { total: 0, count: 0 };
      productMap.set(sale.productName, {
        total: current.total + sale.total,
        count: current.count + sale.quantity
      });
    });
    
    return Array.from(productMap.entries())
      .map(([name, data]) => ({
        name,
        revenue: parseFloat(data.total.toFixed(2)),
        count: data.count
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales]);
  
  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    if (!sales || sales.length === 0) return 0;
    return sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  }, [sales]);
  
  // Calculate total items sold
  const totalSold = useMemo(() => {
    if (!sales || sales.length === 0) return 0;
    return sales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
  }, [sales]);

  const hasData = sales && sales.length > 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Revenue by Bar">
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesByBar}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                  formatter={(value) => [`${value} TND`, "Revenue"]}
                />
                <Bar 
                  dataKey="value" 
                  fill="#2563eb" 
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            {!hasData && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No sales data available
              </div>
            )}
          </div>
        </DashboardCard>
        
        <DashboardCard title="Top Selling Products">
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="revenue"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                    index,
                  }) => {
                    if (!hasData) return null;
                    
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill={COLORS[index % COLORS.length]}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        className="text-xs"
                      >
                        {topProducts[index].name}{" "}
                        ({(percent * 100).toFixed(0)}%)
                      </text>
                    );
                  }}
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "6px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #eaeaea",
                  }}
                  formatter={(value) => [`${value} TND`, "Revenue"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            {!hasData && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No sales data available
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Summary Statistics" className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium text-muted-foreground">Total Revenue</h3>
              <p className="text-3xl font-bold">{totalRevenue.toFixed(2)} TND</p>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium text-muted-foreground">Items Sold</h3>
              <p className="text-3xl font-bold">{totalSold}</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
