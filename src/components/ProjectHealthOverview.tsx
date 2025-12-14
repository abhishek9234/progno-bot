import { ProjectHealth } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
 
interface ProjectHealthOverviewProps {
  health: ProjectHealth;
}
 
const healthConfig = {
  healthy: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Healthy' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'At Risk' },
  critical: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Critical' },
};
 
export function ProjectHealthOverview({ health }: ProjectHealthOverviewProps) {
  const config = healthConfig[health.overall];
  const Icon = config.icon;
 
  return (
    <Card className="glass-card border-l-4 border-l-primary">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${config.bg}`}>
              <Activity className={`h-6 w-6 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Project Health Dashboard</h3>
              <p className="text-sm text-muted-foreground">Real-time project status overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${config.bg}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
              <span className={`font-semibold ${config.color}`}>{config.label}</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{health.schedule.completionPercentage}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </div>
 
        {/* Quick Stats Row */}
        <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-border/30">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{health.schedule.totalStories}</p>
            <p className="text-xs text-muted-foreground">Total Stories</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-success">{health.schedule.completedStories}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{health.schedule.inProgressStories}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-destructive">{health.schedule.blockedStories}</p>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-warning">{health.followUp.immediateCount}</p>
            <p className="text-xs text-muted-foreground">Need Attention</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}