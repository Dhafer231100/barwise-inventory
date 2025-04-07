import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sale } from "@/utils/types";

const Reports = () => {
  const { isAuthenticated, loading } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [barFilter, setBarFilter] = useState("all");
  const [salesByDayAndBar, setSalesByDayAndBar] = useState<{ [day: string]: { [bar: string]: number } }>({
    Mon: { Main: 0, Economa: 0, Restaurant: 0 },
    Tue: { Main: 0, Economa: 0, Restaurant: 0 },
    Wed: { Main: 0, Economa: 0, Restaurant: 0 },
    Thu: { Main: 0, Economa: 0, Restaurant: 0 },
    Fri: { Main: 0, Economa: 0, Restaurant: 0 },
    Sat: { Main: 0, Economa: 0, Restaurant: 0 },
    Sun: { Main: 0, Economa: 0, Restaurant: 0 },
  });

  const barNames = {
    "1": "Main Bar",
    "2": "Economa",
    "3": "Restaurant"
  };

  useEffect(() => {
    const savedSales = localStorage.getItem('hotelBarSales');
    if (savedSales) {
      try {
        const parsedSales = JSON.parse(savedSales) as Sale[];
        setSales(parsedSales);
      } catch (error) {
        console.error('Failed to parse saved sales:', error);
      }
    }
  }, []);

  useEffect(() => {
    const initialSalesData = {
      Mon: { Main: 0, Economa: 0, Restaurant: 0 },
      Tue: { Main: 0, Economa: 0, Restaurant: 0 },
      Wed: { Main: 0, Economa: 0, Restaurant: 0 },
      Thu: { Main: 0, Economa: 0, Restaurant: 0 },
      Fri: { Main: 0, Economa: 0, Restaurant: 0 },
      Sat: { Main: 0, Economa: 0, Restaurant: 0 },
      Sun: { Main: 0, Economa: 0, Restaurant: 0 },
    };
    
    const updatedSalesData = { ...initialSalesData };
    sales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const dayName = saleDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      const barKey = sale.barName === "Main Bar" ? "Main" : 
                        sale.barName === "Economa" ? "Economa" : 
                        sale.barName === "Restaurant" ? "Restaurant" : "Other";
        
      if (barKey !== "Other") {
        updatedSalesData[dayName][barKey] += sale.total;
      }
    });
    
    setSalesByDayAndBar(updatedSalesData);
  }, [sales]);

  const chartData = Object.keys(salesByDayAndBar).map(day => ({
    day,
    Main: salesByDayAndBar[day].Main,
    Economa: salesByDayAndBar[day].Economa,
    Restaurant: salesByDayAndBar[day].Restaurant,
  }));

  if (!isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            <p className="text-muted-foreground">
              Analyze sales data across all bars
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full sm:w-[200px]">
            <Select value={barFilter} onValueChange={setBarFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by bar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bars</SelectItem>
                <SelectItem value="1">Main Bar</SelectItem>
                <SelectItem value="2">Economa</SelectItem>
                <SelectItem value="3">Restaurant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DashboardCard title="Sales by Bar and Day">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Main" fill="#8884d8" />
                <Bar dataKey="Economa" fill="#82ca9d" />
                <Bar dataKey="Restaurant" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
