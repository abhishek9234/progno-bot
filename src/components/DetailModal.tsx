import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JiraIssue, ProjectHealth } from "@/types/project";
import { Calendar, DollarSign, ShieldAlert, AlertOctagon, Bell, ExternalLink } from "lucide-react";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  type: 'schedule' | 'cost' | 'risk' | 'escalation' | 'followup' | null;
  health: ProjectHealth | null;
  jiraBaseUrl?: string;
}

export function DetailModal({ open, onClose, type, health, jiraBaseUrl }: DetailModalProps) {
  if (!type || !health) return null;

  const getTitle = () => {
    switch (type) {
      case 'schedule': return { icon: Calendar, title: 'Schedule Details' };
      case 'cost': return { icon: DollarSign, title: 'Cost Breakdown' };
      case 'risk': return { icon: ShieldAlert, title: 'Risk Assessment' };
      case 'escalation': return { icon: AlertOctagon, title: 'Escalation History' };
      case 'followup': return { icon: Bell, title: 'Follow-up Items' };
    }
  };

  const config = getTitle();
  const Icon = config.icon;

  const renderIssueLink = (issue: JiraIssue) => (
    <a 
      href={`${jiraBaseUrl}/browse/${issue.key}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-primary hover:underline"
    >
      {issue.key}
      <ExternalLink className="h-3 w-3" />
    </a>
  );

  const renderContent = () => {
    switch (type) {
      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <p className="text-sm text-muted-foreground">Total Epics</p>
                <p className="text-3xl font-bold">{health.schedule.totalEpics}</p>
                <p className="text-sm text-success">{health.schedule.completedEpics} completed</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <p className="text-sm text-muted-foreground">Total Stories</p>
                <p className="text-3xl font-bold">{health.schedule.totalStories}</p>
                <p className="text-sm text-success">{health.schedule.completedStories} completed</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Delayed Tasks ({health.schedule.delayedTasks.length})</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {health.schedule.delayedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{renderIssueLink(task)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{task.fields.summary}</TableCell>
                      <TableCell>{task.fields.assignee?.displayName || 'Unassigned'}</TableCell>
                      <TableCell>{task.fields.duedate || 'No due date'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.fields.status.name}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case 'cost':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold font-mono">€{health.cost.estimatedCost.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <p className="text-sm text-muted-foreground">Actual Cost</p>
                <p className="text-2xl font-bold font-mono">€{health.cost.actualCost.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <p className="text-sm text-muted-foreground">Overdue Impact</p>
                <p className="text-2xl font-bold font-mono text-destructive">€{health.cost.overdueCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-2">Cost Calculation</p>
              <p className="text-sm">
                Rate: <strong>€{health.cost.hourlyRate}/hour</strong> • 
                Story Point Value: <strong>8 hours</strong> • 
                Total SPs: <strong>{health.cost.totalStoryPoints}</strong>
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Tasks Contributing to Overrun</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Story Points</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {health.cost.delayedTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{renderIssueLink(task)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{task.fields.summary}</TableCell>
                      <TableCell>{task.fields.customfield_10016 || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{task.fields.status.name}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case 'risk':
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Risk Level</span>
                <Badge className={`${
                  health.risk.level === 'low' ? 'bg-success/20 text-success' :
                  health.risk.level === 'medium' ? 'bg-warning/20 text-warning' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {health.risk.level.toUpperCase()}
                </Badge>
              </div>
              <p className="text-3xl font-bold font-mono">{health.risk.score}/100</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Risk Factors</h4>
              <div className="space-y-2">
                {health.risk.factors.map((factor, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{factor.name}</span>
                      <Badge variant="outline" className={`${
                        factor.severity === 'high' ? 'text-destructive border-destructive/30' :
                        factor.severity === 'medium' ? 'text-warning border-warning/30' :
                        'text-muted-foreground'
                      }`}>
                        {factor.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Impacting {factor.impactedTasks} tasks</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">High Priority Blocked Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {health.risk.highPriorityBlocked.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{renderIssueLink(task)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{task.fields.summary}</TableCell>
                      <TableCell>{task.fields.priority?.name || '-'}</TableCell>
                      <TableCell>{task.fields.assignee?.displayName || 'Unassigned'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case 'escalation':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-3xl font-bold">Level {health.escalation.level}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                <p className="text-sm text-muted-foreground">Active Escalations</p>
                <p className="text-3xl font-bold">{health.escalation.escalatedItems.length}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Escalation History</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {health.escalation.escalatedItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{renderIssueLink(item.issue)}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{item.issue.fields.summary}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-destructive/10 text-destructive">
                          L{item.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">{item.reason}</TableCell>
                      <TableCell>{new Date(item.escalatedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case 'followup':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-muted-foreground">Immediate</p>
                <p className="text-3xl font-bold text-destructive">{health.followUp.immediateCount}</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-3xl font-bold text-warning">{health.followUp.todayCount}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-3xl font-bold text-primary">{health.followUp.upcomingCount}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">All Follow-up Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Due In</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {health.followUp.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{renderIssueLink(item.issue)}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{item.issue.fields.summary}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${
                          item.urgency === 'immediate' ? 'bg-destructive/10 text-destructive' :
                          item.urgency === 'today' ? 'bg-warning/10 text-warning' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {item.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.dueIn}</TableCell>
                      <TableCell>{item.issue.fields.assignee?.displayName || 'Unassigned'}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{item.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            {config.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
