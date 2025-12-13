import { CostMetrics } from "@/types/project";
import { MetricCard } from "./MetricCard";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, ChevronRight, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CostPanelProps {
  metrics: CostMetrics;
  onViewDetails: () => void;
}

export function CostPanel({ metrics, onViewDetails }: CostPanelProps) {
  const variance = metrics.costVariance;
  const status = variance <= 0 ? 'healthy' : variance <= 10 ? 'warning' : 'critical';
  const isOverBudget = variance > 0;

  return (
    <MetricCard 
      title="Cost" 
      icon={DollarSign} 
      status={status}
      onClick={onViewDetails}
    >
      <div className="space-y-4">
        {/* Cost Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated</p>
            <p className="text-xl font-bold font-mono mt-1 text-foreground">
              €{metrics.estimatedCost.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Actual</p>
            <p className={`text-xl font-bold font-mono mt-1 ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
              €{metrics.actualCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Variance Indicator */}
        <div className={`p-3 rounded-lg border ${
          isOverBudget 
            ? 'bg-destructive/10 border-destructive/30' 
            : 'bg-success/10 border-success/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOverBudget ? (
                <TrendingUp className="h-5 w-5 text-destructive" />
              ) : (
                <TrendingDown className="h-5 w-5 text-success" />
              )}
              <span className="text-sm font-medium">Cost Variance</span>
            </div>
            <span className={`font-mono font-bold ${
              isOverBudget ? 'text-destructive' : 'text-success'
            }`}>
              {isOverBudget ? '+' : ''}{variance.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Story Points */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {metrics.completedStoryPoints} SP Completed
          </Badge>
          <Badge variant="outline" className="bg-secondary text-muted-foreground border-border/50">
            {metrics.remainingStoryPoints} SP Remaining
          </Badge>
        </div>

        {/* Overdue Cost */}
        {metrics.overdueCost > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-warning flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Overdue Impact: €{metrics.overdueCost.toLocaleString()}
            </p>
            <ScrollArea className="h-20">
              <div className="space-y-1">
                {metrics.delayedTasks.slice(0, 2).map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded bg-warning/5 border border-warning/20 text-sm"
                  >
                    <Badge variant="outline" className="font-mono text-xs">
                      {task.key}
                    </Badge>
                    <span className="text-muted-foreground truncate ml-2">
                      {task.fields.summary.slice(0, 30)}...
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Rate Info */}
        <p className="text-xs text-muted-foreground">
          Rate: €{metrics.hourlyRate}/hr • 8 hrs/story point
        </p>

        {/* View Details Link */}
        <button 
          onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View full cost breakdown
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </MetricCard>
  );
}
