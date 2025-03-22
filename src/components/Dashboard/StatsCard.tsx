
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border p-6 flex flex-col space-y-2 transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground text-balance">{title}</p>
          <p className="text-2xl md:text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="bg-primary/10 rounded-full p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      {(trend || description) && (
        <div className="flex items-center text-xs text-muted-foreground">
          {trend && (
            <span className={cn(
              "mr-1 flex items-center",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}>
              <span className={trend.isPositive ? "text-emerald-600" : "text-rose-600"}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            </span>
          )}
          {description && <span>{description}</span>}
        </div>
      )}
    </div>
  );
}
