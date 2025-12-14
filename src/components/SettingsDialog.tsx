import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, MessageSquare, Mail, ExternalLink } from "lucide-react";
 
interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  teamsWebhookUrl: string;
  onTeamsWebhookChange: (url: string) => void;
  sendGridApiKey: string;
  onSendGridApiKeyChange: (key: string) => void;
  fromEmail: string;
  onFromEmailChange: (email: string) => void;
}
 
export const SettingsDialog = ({
  open,
  onClose,
  teamsWebhookUrl,
  onTeamsWebhookChange,
  sendGridApiKey,
  onSendGridApiKeyChange,
  fromEmail,
  onFromEmailChange,
}: SettingsDialogProps) => {
  const { toast } = useToast();
  const [localTeamsUrl, setLocalTeamsUrl] = useState(teamsWebhookUrl);
  const [localApiKey, setLocalApiKey] = useState(sendGridApiKey);
  const [localFromEmail, setLocalFromEmail] = useState(fromEmail);
 
  const handleSave = () => {
    onTeamsWebhookChange(localTeamsUrl);
    onSendGridApiKeyChange(localApiKey);
    onFromEmailChange(localFromEmail);
   
    toast({
      title: "Settings saved",
      description: "Your integration settings have been updated.",
    });
    onClose();
  };
 
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integration Settings
          </DialogTitle>
          <DialogDescription>
            Configure Teams and Email integrations for follow-ups and escalations.
          </DialogDescription>
        </DialogHeader>
 
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>
 
          <TabsContent value="teams" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="teams-webhook">Teams Incoming Webhook URL</Label>
              <Input
                id="teams-webhook"
                placeholder="https://outlook.office.com/webhook/..."
                value={localTeamsUrl}
                onChange={(e) => setLocalTeamsUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Create a webhook in your Teams channel: Channel Settings → Connectors → Incoming Webhook
              </p>
            </div>
            {/* <a
              href="https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook%22
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            > */}
              {/* <ExternalLink className="h-3 w-3" />
              How to create a Teams webhook
            </a> */}
          </TabsContent>
 
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
              <Input
                id="sendgrid-key"
                type="password"
                placeholder="SG.xxxxxxxx..."
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Get your API key from SendGrid dashboard. For Azure, add to App Settings.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-email">From Email Address</Label>
              <Input
                id="from-email"
                type="email"
                placeholder="noreply@yourapp.com"
                value={localFromEmail}
                onChange={(e) => setLocalFromEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Must be a verified sender in SendGrid.
              </p>
            </div>
            <a
              href="https://docs.sendgrid.com/for-developers/sending-email/api-getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              SendGrid API documentation
            </a>
          </TabsContent>
        </Tabs>
 
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};