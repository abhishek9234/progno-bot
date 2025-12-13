import { RiskMetrics } from "@/types/project";
import { MetricCard } from "./MetricCard";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ChevronRight, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface RiskPanelProps {
  metrics: RiskMetrics;
  onViewDetails: () => void;
}

const riskLevelConfig = {
  low: { label: 'Low', color: 'text-success', bgColor: 'bg-success/10', progressColor: 'bg-success' },
  medium: { label: 'Medium', color: 'text-warning', bgColor: 'bg-warning/10', progressColor: 'bg-warning' },
  high: { label: 'High', color: 'text-orange-500', bgColor: 'bg-orange-500/10', progressColor: 'bg-orange-500' },
  critical: { label: 'Critical', color: 'text-destructive', bgColor: 'bg-destructive/10', progressColor: 'bg-destructive' }
};

export function RiskPanel({ metrics, onViewDetails }: RiskPanelProps) {
  const status = metrics.level === 'low' ? 'healthy' 
    : metrics.level === 'medium' ? 'warning' 
    : 'critical';
  
  const config = riskLevelConfig[metrics.level];

  return (
    <MetricCard 
      title="Risk" 
      icon={ShieldAlert} 
      status={status}
      onClick={onViewDetails}
    >
      <div className="space-y-4">
        {/* Risk Score */}
        <div className={`p-4 rounded-lg border ${config.bgColor} border-opacity-30`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Risk Level</span>
            <Badge className={`${config.bgColor} ${config.color} border-none`}>
              {config.label}
            </Badge>
          </div>
          <div className="space-y-1">
            <Progress 
              value={metrics.score} 
              className="h-3 bg-secondary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span className="font-mono font-semibold text-foreground">
                Score: {metrics.score}/100
              </span>
              <span>Critical</span>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Risk Factors</p>
          <div className="space-y-1">
            {metrics.factors.slice(0, 3).map((factor, idx) => (
              <div 
                key={idx}
                className={`flex items-center justify-between p-2 rounded border text-sm ${
                  factor.severity === 'high' 
                    ? 'bg-destructive/5 border-destructive/20' 
                    : factor.severity === 'medium'
                      ? 'bg-warning/5 border-warning/20'
                      : 'bg-secondary/50 border-border/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-3 w-3 ${
                    factor.severity === 'high' ? 'text-destructive' 
                    : factor.severity === 'medium' ? 'text-warning'
                    : 'text-muted-foreground'
                  }`} />
                  <span className="text-foreground">{factor.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {factor.impactedTasks} tasks
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* High Priority Blocked */}
        {metrics.highPriorityBlocked.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-destructive flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              {metrics.highPriorityBlocked.length} High Priority Blocked
            </p>
            <ScrollArea className="h-16">
              <div className="space-y-1">
                {metrics.highPriorityBlocked.slice(0, 2).map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center p-2 rounded bg-destructive/5 border border-destructive/20 text-sm"
                  >
                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                      {task.key}
                    </Badge>
                    <span className="text-muted-foreground truncate ml-2">
                      {task.fields.summary}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* View Details Link */}
        <button 
          onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View full risk assessment
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </MetricCard>
  );
}
