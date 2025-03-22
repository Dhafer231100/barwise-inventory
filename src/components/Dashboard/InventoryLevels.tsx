
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";

interface InventoryData {
  name: string;
  current: number;
  minimum: number;
}

interface InventoryLevelsProps {
  data: InventoryData[];
  className?: string;
}

export function InventoryLevels({ data, className }: InventoryLevelsProps) {
  return (
    <DashboardCard 
      title="Inventory Levels" 
      description="Current stock levels of most critical items"
      className={className}
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={50} 
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '6px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid #eaeaea'
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
            />
            <Bar 
              dataKey="current" 
              fill="rgba(37, 99, 235, 0.85)" 
              radius={[4, 4, 0, 0]}
              name="Current Level"
            />
            <Bar 
              dataKey="minimum" 
              fill="rgba(239, 68, 68, 0.75)" 
              radius={[4, 4, 0, 0]}
              name="Minimum Level"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
