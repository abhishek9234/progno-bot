import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Loader2, AlertTriangle } from "lucide-react";
import { JiraIssue, FollowUpItem, EscalationItem } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
  type: 'followup' | 'escalation';
  item: FollowUpItem | EscalationItem | null;
}

const MANAGER_EMAIL = "b.biradar27@gmail.com";
const MANAGER_NAME = "Basawaraj Biradar";

export function NotificationDialog({ open, onClose, type, item }: NotificationDialogProps) {
  const [channel, setChannel] = useState<'email' | 'teams'>('email');
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!item) return null;

  const issue = item.issue;
  const assignee = issue.fields.assignee;
  const isOnHold = issue.fields.status?.name?.toLowerCase().includes('hold');
  
  // For escalation, determine recipients based on item status
  const getEscalationRecipients = () => {
    const recipients: { name: string; email: string; role: string }[] = [];
    
    // Always add ticket owner/assignee
    if (assignee) {
      recipients.push({
        name: assignee.displayName,
        email: assignee.emailAddress,
        role: 'Assignee'
      });
    }
    
    // Always add manager
    recipients.push({
      name: MANAGER_NAME,
      email: MANAGER_EMAIL,
      role: 'Manager'
    });
    
    // If on-hold, add the person who put it on hold (simulated as assignee for demo)
    if (isOnHold && assignee) {
      recipients.push({
        name: assignee.displayName,
        email: assignee.emailAddress,
        role: 'Status Owner'
      });
    }
    
    return recipients;
  };

  const recipients = type === 'escalation' ? getEscalationRecipients() : 
    assignee ? [{ name: assignee.displayName, email: assignee.emailAddress, role: 'Assignee' }] : [];

  const handleSend = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-notification', {
        body: {
          channel,
          type,
          issue: {
            key: issue.key,
            summary: issue.fields.summary,
            status: issue.fields.status?.name,
            priority: issue.fields.priority?.name,
            assignee: assignee?.displayName,
            assigneeEmail: assignee?.emailAddress
          },
          recipients: recipients.map(r => ({ email: r.email, name: r.name })),
          message: message || `${type === 'followup' ? 'Follow-up required' : 'Escalation'} for ${issue.key}`,
          reason: item.reason,
          managerEmail: MANAGER_EMAIL,
          managerName: MANAGER_NAME,
          isOnHold
        }
      });

      if (error) throw error;

      toast.success(`${type === 'followup' ? 'Follow-up' : 'Escalation'} sent via ${channel}`, {
        description: `Notification sent to ${recipients.length} recipient(s)`
      });
      
      onClose();
      setMessage("");
    } catch (error) {
      console.error('Notification error:', error);
      toast.error('Failed to send notification', {
        description: 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'followup' ? (
              <>
                <MessageSquare className="h-5 w-5 text-primary" />
                Send Follow-up
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Send Escalation
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Send a notification for {issue.key}: {issue.fields.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Issue Details */}
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="font-mono">{issue.key}</Badge>
              <Badge 
                variant="outline" 
                className={isOnHold ? 'bg-warning/10 text-warning border-warning/30' : ''}
              >
                {issue.fields.status?.name}
              </Badge>
            </div>
            <p className="text-sm text-foreground">{issue.fields.summary}</p>
            <p className="text-xs text-muted-foreground mt-1">Reason: {item.reason}</p>
          </div>

          {/* Recipients */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Recipients</Label>
            <div className="space-y-2">
              {recipients.map((recipient, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/30 border border-border/20">
                  <div>
                    <p className="text-sm font-medium">{recipient.name}</p>
                    <p className="text-xs text-muted-foreground">{recipient.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{recipient.role}</Badge>
                </div>
              ))}
              {recipients.length === 0 && (
                <p className="text-sm text-muted-foreground">No assignee found for this issue</p>
              )}
            </div>
          </div>

          {/* Channel Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Send via</Label>
            <RadioGroup value={channel} onValueChange={(v) => setChannel(v as 'email' | 'teams')}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teams" id="teams" />
                  <Label htmlFor="teams" className="flex items-center gap-2 cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    Microsoft Teams
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Custom Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium mb-2 block">
              Additional Message (optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Add a custom message for this ${type}...`}
              className="h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={isLoading || recipients.length === 0}
            className={type === 'escalation' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                {channel === 'email' ? <Mail className="h-4 w-4 mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                Send {type === 'followup' ? 'Follow-up' : 'Escalation'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
