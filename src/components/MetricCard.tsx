import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  status?: 'healthy' | 'warning' | 'critical' | 'info';
  className?: string;
  onClick?: () => void;
}

const statusBorderColors = {
  healthy: "border-l-success",
  warning: "border-l-warning",
  critical: "border-l-destructive",
  info: "border-l-primary"
};

export function MetricCard({ 
  title, 
  icon: Icon, 
  children, 
  status = 'info',
  className,
  onClick 
}: MetricCardProps) {
  return (
    <Card 
      className={cn(
        "glass-card border-l-4 transition-all duration-300 hover:shadow-lg",
        statusBorderColors[status],
        onClick && "cursor-pointer hover:bg-card/90",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className={cn(
            "p-2 rounded-lg",
            status === 'healthy' && "bg-success/10 text-success",
            status === 'warning' && "bg-warning/10 text-warning",
            status === 'critical' && "bg-destructive/10 text-destructive",
            status === 'info' && "bg-primary/10 text-primary"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        {children}
      </CardContent>
    </Card>
  );
}
