
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";
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
import { Download, CalendarRange } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Mock sales data by bar
const salesByBar = [
  { name: "Mon", Main: 4000, Pool: 2400, Lounge: 1800 },
  { name: "Tue", Main: 3000, Pool: 1398, Lounge: 2000 },
  { name: "Wed", Main: 2000, Pool: 9800, Lounge: 2290 },
  { name: "Thu", Main: 2780, Pool: 3908, Lounge: 2500 },
  { name: "Fri", Main: 4890, Pool: 4800, Lounge: 3100 },
  { name: "Sat", Main: 6390, Pool: 5800, Lounge: 4200 },
  { name: "Sun", Main: 5490, Pool: 4300, Lounge: 3800 },
];

// Mock data for top selling items
const topSellingItems = [
  { name: "Mojito", value: 120 },
  { name: "Margarita", value: 105 },
  { name: "Gin & Tonic", value: 90 },
  { name: "Vodka Soda", value: 75 },
  { name: "Whiskey Sour", value: 60 },
];

// Mock data for inventory usage
const inventoryUsage = [
  {
    name: "Week 1",
    Vodka: 40,
    Gin: 30,
    Rum: 20,
    Tequila: 27,
    Whiskey: 18,
  },
  {
    name: "Week 2",
    Vodka: 30,
    Gin: 20,
    Rum: 30,
    Tequila: 20,
    Whiskey: 20,
  },
  {
    name: "Week 3",
    Vodka: 50,
    Gin: 40,
    Rum: 25,
    Tequila: 30,
    Whiskey: 30,
  },
  {
    name: "Week 4",
    Vodka: 40,
    Gin: 35,
    Rum: 40,
    Tequila: 20,
    Whiskey: 15,
  },
];

// Mock data for monthly revenue vs orders
const revenueVsOrders = [
  {
    name: "Jan",
    revenue: 20000,
    orders: 420,
    avg: 47.6,
  },
  {
    name: "Feb",
    revenue: 25000,
    orders: 500,
    avg: 50,
  },
  {
    name: "Mar",
    revenue: 30000,
    orders: 580,
    avg: 51.7,
  },
  {
    name: "Apr",
    revenue: 27000,
    orders: 520,
    avg: 51.9,
  },
  {
    name: "May",
    revenue: 32000,
    orders: 600,
    avg: 53.3,
  },
  {
    name: "Jun",
    revenue: 40000,
    orders: 700,
    avg: 57.1,
  },
];

// Colors for the pie chart
const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Report options
const timeRanges = [
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "30days" },
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "This Quarter", value: "this-quarter" },
  { label: "Custom Range", value: "custom" },
];

const Reports = () => {
  const { isAuthenticated, loading } = useAuth();
  const [timeRange, setTimeRange] = useState("7days");
  const [activeTab, setActiveTab] = useState("sales");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
              Analyze sales, inventory, and bar performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {timeRange === "custom" && (
              <Popover
                open={isCalendarOpen}
                onOpenChange={setIsCalendarOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarRange className="h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="sales"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <DashboardCard
                title="Daily Sales by Bar"
                description="Revenue breakdown by location"
              >
                <div className="h-[300px]">
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
                        formatter={(value) => [`$${value}`, ""]}
                      />
                      <Legend />
                      <Bar
                        dataKey="Main"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                        name="Main Bar"
                      />
                      <Bar
                        dataKey="Pool"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                        name="Pool Bar"
                      />
                      <Bar
                        dataKey="Lounge"
                        fill="#f59e0b"
                        radius={[4, 4, 0, 0]}
                        name="Lounge Bar"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Top Selling Items"
                description="Most popular menu items"
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topSellingItems}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        dataKey="value"
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          index,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius =
                            25 + innerRadius + (outerRadius - innerRadius);
                          const x =
                            cx +
                            radius *
                              Math.cos(-midAngle * RADIAN);
                          const y =
                            cy +
                            radius *
                              Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill={COLORS[index % COLORS.length]}
                              textAnchor={
                                x > cx ? "start" : "end"
                              }
                              dominantBaseline="central"
                              className="text-xs"
                            >
                              {topSellingItems[index].name}{" "}
                              ({(percent * 100).toFixed(0)}%)
                            </text>
                          );
                        }}
                      >
                        {topSellingItems.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "6px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #eaeaea",
                        }}
                        formatter={(value) => [`${value} orders`, ""]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
            </div>

            <DashboardCard title="Monthly Revenue vs Orders">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={revenueVsOrders}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      stroke="#2563eb"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#ef4444"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "6px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #eaeaea",
                      }}
                      formatter={(value, name) => {
                        if (name === "revenue") return [`$${value}`, "Revenue"];
                        if (name === "orders") return [value, "Orders"];
                        if (name === "avg") return [`$${value}`, "Avg. Order"];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="#2563eb20"
                      stroke="#2563eb"
                      name="Revenue"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      barSize={20}
                      fill="#ef4444"
                      name="Orders"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avg"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={true}
                      name="Avg. Order"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <DashboardCard
              title="Inventory Usage Trends"
              description="Weekly consumption of key spirits"
            >
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryUsage}
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
                      formatter={(value) => [`${value} units`, ""]}
                    />
                    <Legend />
                    <Bar
                      dataKey="Vodka"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Gin"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Rum"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Tequila"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Whiskey"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            {/* Additional inventory reports could go here */}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <DashboardCard
                title="Bar Performance Comparison"
                description="Revenue targets vs. actual"
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Main Bar",
                          actual: 35000,
                          target: 40000,
                        },
                        {
                          name: "Pool Bar",
                          actual: 28000,
                          target: 25000,
                        },
                        {
                          name: "Lounge Bar",
                          actual: 18000,
                          target: 20000,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        scale="band"
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "6px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #eaeaea",
                        }}
                        formatter={(value) => [`$${value}`, ""]}
                      />
                      <Legend />
                      <Bar
                        dataKey="actual"
                        fill="#2563eb"
                        name="Actual Revenue"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="target"
                        fill="#94a3b8"
                        name="Target Revenue"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>

              <DashboardCard
                title="Peak Hour Analysis"
                description="Orders by hour of day"
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { hour: "12pm", orders: 10 },
                        { hour: "1pm", orders: 15 },
                        { hour: "2pm", orders: 18 },
                        { hour: "3pm", orders: 14 },
                        { hour: "4pm", orders: 20 },
                        { hour: "5pm", orders: 35 },
                        { hour: "6pm", orders: 48 },
                        { hour: "7pm", orders: 58 },
                        { hour: "8pm", orders: 65 },
                        { hour: "9pm", orders: 70 },
                        { hour: "10pm", orders: 55 },
                        { hour: "11pm", orders: 40 },
                        { hour: "12am", orders: 20 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "6px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #eaeaea",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#2563eb"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        name="Orders"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </DashboardCard>
            </div>

            {/* Additional performance reports could go here */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
