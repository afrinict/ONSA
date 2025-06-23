import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor,
  trend 
}: MetricCardProps) {
  return (
    <Card className="bg-surface border-border">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("text-xl", iconColor)} size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-secondary-custom">{title}</p>
            <p className="text-2xl font-semibold text-primary-custom">{value.toLocaleString()}</p>
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={cn(
              "flex items-center",
              trend.isPositive ? "text-success" : "text-error"
            )}>
              <i className={cn(
                "text-xs mr-1",
                trend.isPositive ? "fas fa-arrow-up" : "fas fa-arrow-down"
              )} />
              {Math.abs(trend.value)}%
            </span>
            <span className="text-secondary-custom ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
