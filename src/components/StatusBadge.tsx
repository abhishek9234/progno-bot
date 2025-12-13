import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical' | 'info';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    className: "status-healthy",
    label: "Healthy"
  },
  warning: {
    icon: AlertTriangle,
    className: "status-warning",
    label: "Warning"
  },
  critical: {
    icon: XCircle,
    className: "status-critical",
    label: "Critical"
  },
  info: {
    icon: Info,
    className: "status-info",
    label: "Info"
  }
};

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-medium flex items-center gap-1.5 border",
        config.className,
        sizeClasses[size]
      )}
    >
      <Icon className={cn(
        size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
      )} />
      {label || config.label}
    </Badge>
  );
}
