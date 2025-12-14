import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FollowUpItem, FollowUpActionType } from "@/types/project";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendFollowUpToTeams } from "@/services/teamsService";
import { sendFollowUpEmail } from "@/services/emailService";
 
interface FollowUpActionDialogProps {
  open: boolean;
  onClose: () => void;
  item: FollowUpItem | null;
  teamsWebhookUrl?: string;
}
 
export function FollowUpActionDialog({ open, onClose, item, teamsWebhookUrl }: FollowUpActionDialogProps) {
  const [actionType, setActionType] = useState<FollowUpActionType>('email');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
 
  if (!item) return null;
 
  const handleSend = async () => {
    setIsSending(true);
   
    try {
      const assignee = item.issue.fields.assignee;
      const recipientName = assignee?.displayName || 'Unassigned';
      const recipientEmail = assignee?.emailAddress || 'unknown@example.com';
      const priority = item.urgency || 'medium';
      const finalMessage = message || defaultMessage;
 
      if (actionType === 'teams') {
        if (!teamsWebhookUrl) {
          toast({
            title: "Teams Not Configured",
            description: "Please configure Teams webhook URL in Settings first.",
            variant: "destructive",
          });
          setIsSending(false);
          return;
        }
 
        const result = await sendFollowUpToTeams(
          teamsWebhookUrl,
          `${item.issue.key}: ${item.issue.fields.summary}`,
          recipientName,
          finalMessage,
          priority
        );
 
        if (result.success) {
          toast({
            title: "Teams Message Sent",
            description: `Follow-up message sent via Microsoft Teams`,
          });
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await sendFollowUpEmail(
          recipientEmail,
          recipientName,
          `${item.issue.key}: ${item.issue.fields.summary}`,
          finalMessage,
          priority
        );
 
        if (result.success) {
          toast({
            title: "Email Sent",
            description: `Follow-up email sent to ${recipientName} (${recipientEmail})`,
          });
        } else {
          throw new Error(result.error);
        }
      }
 
      setMessage('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send follow-up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
 
  const defaultMessage = actionType === 'teams'
    ? `Hi ${item.issue.fields.assignee?.displayName || 'there'},\n\nThis is a follow-up for ticket ${item.issue.key}: "${item.issue.fields.summary}".\n\nReason: ${item.reason}\n\nCould you please provide an update?`
    : `Dear ${item.issue.fields.assignee?.displayName || 'Team Member'},\n\nThis is a follow-up reminder for ticket ${item.issue.key}.\n\nSummary: ${item.issue.fields.summary}\nReason: ${item.reason}\nUrgency: ${item.urgency}\n\nPlease provide an update at your earliest convenience.\n\nBest regards,\nProject Management Team`;
 
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Send Follow-up for {item.issue.key}
          </DialogTitle>
        </DialogHeader>
 
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Follow-up Method</Label>
            <RadioGroup
              value={actionType}
              onValueChange={(v) => setActionType(v as FollowUpActionType)}
              className="grid grid-cols-2 gap-3"
            >
              <div className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                actionType === 'teams' ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary/50'
              }`}>
                <RadioGroupItem value="teams" id="teams" />
                <Label htmlFor="teams" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Teams
                </Label>
              </div>
              <div className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                actionType === 'email' ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary/50'
              }`}>
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
              </div>
            </RadioGroup>
          </div>
 
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recipient</Label>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/30">
              <p className="text-sm font-medium">{item.issue.fields.assignee?.displayName || 'Unassigned'}</p>
              <p className="text-xs text-muted-foreground">{item.issue.fields.assignee?.emailAddress || 'No email available'}</p>
            </div>
          </div>
 
          <div className="space-y-2">
            <Label className="text-sm font-medium">Message (optional)</Label>
            <Textarea
              placeholder={defaultMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] bg-secondary border-border/50"
            />
            <p className="text-xs text-muted-foreground">Leave empty to use the default message</p>
          </div>
        </div>
 
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending..." : actionType === 'teams' ? "Send via Teams" : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}