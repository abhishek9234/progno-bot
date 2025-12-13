import { ProjectHealth } from "@/types/project";
import { StatusBadge } from "./StatusBadge";
import { Activity, TrendingUp, Clock, Users } from "lucide-react";

interface HealthOverviewProps {
  health: ProjectHealth;
}

export function HealthOverview({ health }: HealthOverviewProps) {
  const getOverallStatus = () => {
    switch (health.overall) {
      case 'healthy': return { label: 'Project Healthy', status: 'healthy' as const };
      case 'warning': return { label: 'Needs Attention', status: 'warning' as const };
      case 'critical': return { label: 'Critical Issues', status: 'critical' as const };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="glass-card p-6 rounded-xl border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${
            health.overall === 'healthy' ? 'bg-success/10' 
            : health.overall === 'warning' ? 'bg-warning/10'
            : 'bg-destructive/10'
          }`}>
            <Activity className={`h-6 w-6 ${
              health.overall === 'healthy' ? 'text-success' 
              : health.overall === 'warning' ? 'text-warning'
              : 'text-destructive'
            }`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Project Health Dashboard</h2>
            <p className="text-sm text-muted-foreground">Real-time project status and metrics</p>
          </div>
        </div>
        <StatusBadge status={overallStatus.status} label={overallStatus.label} size="lg" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Progress</span>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">
            {health.schedule.completionPercentage.toFixed(0)}%
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Follow-ups</span>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">
            {health.followUp.items.length}
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Risk Score</span>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">
            {health.risk.score}/100
          </p>
        </div>
        
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-destructive" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Escalations</span>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">
            {health.escalation.escalatedItems.length}
          </p>
        </div>
      </div>
    </div>
  );
}
