import { useState } from "react";
import { FollowUpMetrics, FollowUpItem } from "@/types/project";
import { MetricCard } from "./MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight, Clock, AlertCircle, CalendarClock, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FollowUpActionDialog } from "./FollowUpActionDialog";
 
interface FollowUpPanelProps {
  metrics: FollowUpMetrics;
  onViewDetails: () => void;
  teamsWebhookUrl?: string;
}
 
const urgencyConfig = {
  immediate: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Immediate' },
  today: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Today' },
  upcoming: { icon: CalendarClock, color: 'text-primary', bg: 'bg-primary/10', label: 'Upcoming' }
};
 
export function FollowUpPanel({ metrics, onViewDetails, teamsWebhookUrl }: FollowUpPanelProps) {
  const [selectedItem, setSelectedItem] = useState<FollowUpItem | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
 
  const totalItems = metrics.items.length;
  const status = metrics.immediateCount > 0 ? 'critical'
    : metrics.todayCount > 0 ? 'warning'
    : 'healthy';
 
  const handleFollowUp = (item: FollowUpItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
    setShowActionDialog(true);
  };
 
  return (
<>
<MetricCard title="Follow Ups" icon={Bell} status={status} onClick={onViewDetails}>
<div className="space-y-4">
<div className="grid grid-cols-3 gap-2">
<div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
<p className="text-xl font-bold text-destructive">{metrics.immediateCount}</p>
<p className="text-xs text-muted-foreground">Immediate</p>
</div>
<div className="p-2 rounded-lg bg-warning/10 border border-warning/30 text-center">
<p className="text-xl font-bold text-warning">{metrics.todayCount}</p>
<p className="text-xs text-muted-foreground">Today</p>
</div>
<div className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-center">
<p className="text-xl font-bold text-primary">{metrics.upcomingCount}</p>
<p className="text-xs text-muted-foreground">Upcoming</p>
</div>
</div>
 
          {totalItems > 0 ? (
<ScrollArea className="h-44">
<div className="space-y-2">
                {metrics.items.slice(0, 5).map((item, idx) => {
                  const config = urgencyConfig[item.urgency];
                  const Icon = config.icon;
 
                  return (
<div key={idx} className={`p-3 rounded-lg border ${config.bg} border-opacity-30`}>
<div className="flex items-start justify-between mb-2">
<div className="flex items-center gap-2">
<Icon className={`h-4 w-4 ${config.color}`} />
<Badge variant="outline" className="font-mono text-xs">{item.issue.key}</Badge>
</div>
<div className="flex items-center gap-2">
<Badge variant="outline" className={`text-xs ${config.bg} ${config.color} border-none`}>{item.dueIn}</Badge>
<Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => handleFollowUp(item, e)}>
<Send className="h-3 w-3" />
</Button>
</div>
</div>
<p className="text-sm text-foreground mb-1 line-clamp-1">{item.issue.fields.summary}</p>
<p className="text-xs text-muted-foreground">{item.reason}</p>
</div>
                  );
                })}
</div>
</ScrollArea>
          ) : (
<div className="p-6 text-center text-muted-foreground">
<Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
<p className="text-sm">No pending follow-ups</p>
</div>
          )}
 
          <button onClick={(e) => { e.stopPropagation(); onViewDetails(); }} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">
            View all follow-ups ({totalItems})
<ChevronRight className="h-4 w-4" />
</button>
</div>
</MetricCard>
 
      <FollowUpActionDialog open={showActionDialog} onClose={() => setShowActionDialog(false)} item={selectedItem} teamsWebhookUrl={teamsWebhookUrl} />
</>
  );
}