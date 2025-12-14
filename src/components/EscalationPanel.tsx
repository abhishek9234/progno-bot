import { useState } from "react";

import { EscalationMetrics, EscalationItem, MANAGER_CONFIG } from "@/types/project";

import { MetricCard } from "./MetricCard";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { AlertOctagon, ChevronRight, ArrowUpCircle, History, Mail, MessageSquare } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { useToast } from "@/hooks/use-toast";

import { sendEscalationEmail } from "@/services/emailService";

import { sendEscalationToTeams } from "@/services/teamsService";
 
interface EscalationPanelProps {

  metrics: EscalationMetrics;

  onViewDetails: () => void;

  teamsWebhookUrl?: string;

}
 
const escalationLevelLabels = ['None', 'Level 1', 'Level 2', 'Level 3', 'Critical'];
 
export function EscalationPanel({ metrics, onViewDetails, teamsWebhookUrl }: EscalationPanelProps) {

  const { toast } = useToast();

  const [sendingEscalation, setSendingEscalation] = useState<string | null>(null);
 
  const status = metrics.level === 0 ? 'healthy' : metrics.level <= 1 ? 'warning' : 'critical';
 
  const handleEscalate = async (item: EscalationItem, method: 'email' | 'teams', e: React.MouseEvent) => {

    e.stopPropagation();

    setSendingEscalation(item.issue.key);
 
    try {

      const assignee = item.issue.fields.assignee;

      const ticketOwner = assignee || { displayName: "Unassigned", emailAddress: "unassigned@example.com" };

      const isOnHold = item.issue.fields.status.name === 'On Hold';
 
      const recipients = [

        { name: ticketOwner.displayName, email: ticketOwner.emailAddress, role: "Ticket Owner" },

        { name: MANAGER_CONFIG.name, email: MANAGER_CONFIG.email, role: "Manager" },

      ];
 
      if (isOnHold && item.onHoldBy) {

        recipients.push({ name: item.onHoldBy.displayName, email: item.onHoldBy.emailAddress, role: "On Hold By" });

        // Manager already added, but noting the on-hold context

      }
 
      if (method === 'teams') {

        if (!teamsWebhookUrl) {

          toast({

            title: "Teams Not Configured",

            description: "Please configure Teams webhook URL in Settings first.",

            variant: "destructive",

          });

          return;

        }
 
        const result = await sendEscalationToTeams(

          teamsWebhookUrl,

          `${item.issue.key}: ${item.issue.fields.summary}`,

          ticketOwner.displayName,

          MANAGER_CONFIG.name,

          item.reason,

          isOnHold

        );
 
        if (result.success) {

          toast({

            title: "Teams Escalation Sent",

            description: `Escalation sent to Teams channel`,

          });

        } else {

          throw new Error(result.error);

        }

      } else {

        const result = await sendEscalationEmail(

          recipients,

          `${item.issue.key}: ${item.issue.fields.summary}`,

          ticketOwner.displayName,

          item.reason,

          isOnHold,

          item.onHoldBy?.displayName

        );
 
        if (result.success) {

          toast({

            title: "Escalation Emails Sent",

            description: `Escalation notifications sent to ${recipients.map(r => r.name).join(', ')}`,

          });

        } else {

          throw new Error(result.error);

        }

      }

    } catch (error) {

      toast({ 

        title: "Error", 

        description: error instanceof Error ? error.message : "Failed to send escalation.", 

        variant: "destructive" 

      });

    } finally {

      setSendingEscalation(null);

    }

  };
 
  return (
<MetricCard title="Escalation" icon={AlertOctagon} status={status} onClick={onViewDetails}>
<div className="space-y-4">
<div className={`p-4 rounded-lg border ${metrics.level === 0 ? 'bg-success/10 border-success/30' : metrics.level <= 1 ? 'bg-warning/10 border-warning/30' : 'bg-destructive/10 border-destructive/30'}`}>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<ArrowUpCircle className={`h-5 w-5 ${metrics.level === 0 ? 'text-success' : metrics.level <= 1 ? 'text-warning' : 'text-destructive'}`} />
<span className="font-medium">Current Level</span>
</div>
<Badge variant="outline" className={`font-mono ${metrics.level === 0 ? 'bg-success/10 text-success border-success/30' : metrics.level <= 1 ? 'bg-warning/10 text-warning border-warning/30' : 'bg-destructive/10 text-destructive border-destructive/30'}`}>

              {escalationLevelLabels[Math.min(metrics.level, 4)]}
</Badge>
</div>
<div className="mt-3 flex gap-1">

            {[0, 1, 2, 3].map((level) => (
<div key={level} className={`h-2 flex-1 rounded-full ${level < metrics.level ? level < 2 ? 'bg-warning' : 'bg-destructive' : 'bg-secondary'}`} />

            ))}
</div>
</div>
 
        <div className="grid grid-cols-2 gap-3">
<div className="p-3 rounded-lg bg-secondary/50 border border-border/30 text-center">
<p className="text-2xl font-bold text-foreground">{metrics.escalatedItems.length}</p>
<p className="text-xs text-muted-foreground">Active Escalations</p>
</div>
<div className="p-3 rounded-lg bg-secondary/50 border border-border/30 text-center">
<p className="text-2xl font-bold text-warning">{metrics.pendingEscalations.length}</p>
<p className="text-xs text-muted-foreground">Pending Review</p>
</div>
</div>
 
        {metrics.recentEscalations.length > 0 && (
<div className="space-y-2">
<p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
<History className="h-4 w-4" />Recent Escalations
</p>
<ScrollArea className="h-24">
<div className="space-y-2">

                {metrics.recentEscalations.slice(0, 3).map((item, idx) => (
<div key={idx} className="p-2 rounded bg-secondary/50 border border-border/30 text-sm">
<div className="flex items-center justify-between mb-1">
<Badge variant="outline" className="font-mono text-xs">{item.issue.key}</Badge>
<div className="flex items-center gap-1">
<Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">L{item.level}</Badge>
<Button 

                          size="sm" 

                          variant="ghost" 

                          className="h-6 w-6 p-0" 

                          onClick={(e) => handleEscalate(item, 'teams', e)} 

                          disabled={sendingEscalation === item.issue.key}

                          title="Escalate via Teams"
>
<MessageSquare className="h-3 w-3" />
</Button>
<Button 

                          size="sm" 

                          variant="ghost" 

                          className="h-6 w-6 p-0" 

                          onClick={(e) => handleEscalate(item, 'email', e)} 

                          disabled={sendingEscalation === item.issue.key}

                          title="Escalate via Email"
>
<Mail className="h-3 w-3" />
</Button>
</div>
</div>
<p className="text-xs text-muted-foreground">{item.reason}</p>
</div>

                ))}
</div>
</ScrollArea>
</div>

        )}
 
        <button onClick={(e) => { e.stopPropagation(); onViewDetails(); }} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">

          View escalation history<ChevronRight className="h-4 w-4" />
</button>
</div>
</MetricCard>

  );

}

 