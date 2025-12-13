import { ScheduleMetrics, JiraIssue } from "@/types/project";
import { MetricCard } from "./MetricCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SchedulePanelProps {
  metrics: ScheduleMetrics;
  onViewDetails: () => void;
}

export function SchedulePanel({ metrics, onViewDetails }: SchedulePanelProps) {
  const status = metrics.scheduleVariance >= 0 
    ? 'healthy' 
    : metrics.scheduleVariance >= -10 
      ? 'warning' 
      : 'critical';

  return (
    <MetricCard 
      title="Schedule" 
      icon={Calendar} 
      status={status}
      onClick={onViewDetails}
    >
      <div className="space-y-4">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-mono font-semibold text-foreground">
              {metrics.completionPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={metrics.completionPercentage} 
            className="h-2 bg-secondary"
          />
        </div>

        {/* Epic/Story Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Epics</p>
            <p className="text-2xl font-bold mt-1">
              <span className="text-success">{metrics.completedEpics}</span>
              <span className="text-muted-foreground text-lg">/{metrics.totalEpics}</span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Stories</p>
            <p className="text-2xl font-bold mt-1">
              <span className="text-success">{metrics.completedStories}</span>
              <span className="text-muted-foreground text-lg">/{metrics.totalStories}</span>
            </p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {metrics.completedStories} Done
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            <Clock className="h-3 w-3 mr-1" />
            {metrics.inProgressStories} In Progress
          </Badge>
          {metrics.blockedStories > 0 && (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              <AlertCircle className="h-3 w-3 mr-1" />
              {metrics.blockedStories} Blocked
            </Badge>
          )}
        </div>

        {/* Delayed Tasks Preview */}
        {metrics.delayedTasks.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-warning flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {metrics.delayedTasks.length} Delayed Tasks
            </p>
            <ScrollArea className="h-24">
              <div className="space-y-1">
                {metrics.delayedTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-2 rounded bg-warning/5 border border-warning/20 text-sm"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Badge variant="outline" className="font-mono text-xs shrink-0">
                        {task.key}
                      </Badge>
                      <span className="truncate text-muted-foreground">
                        {task.fields.summary}
                      </span>
                    </div>
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
          View full schedule details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </MetricCard>
  );
}
