import { useState, useEffect } from "react";
import { FollowUpPanel } from "@/components/FollowUpPanel";
import { EscalationPanel } from "@/components/EscalationPanel";
import { SchedulePanel } from "@/components/SchedulePanel";
import { CostPanel } from "@/components/CostPanel";
import { RiskPanel } from "@/components/RiskPanel";
import { ProjectHealthOverview } from "@/components/ProjectHealthOverview";  
import { ProjectSelector } from "@/components/ProjectSelector";
import { AIAssistant } from "@/components/AIAssistant";
import { SettingsDialog } from "@/components/SettingsDialog"; 
import { demoProjects, generateDemoProjectHealth } from "@/data/demoData";
import { Button } from "@/components/ui/button";
import { Bot, Settings } from "lucide-react";
import { configureEmailService } from "@/services/emailService";
import { JiraProject, ProjectHealth } from "@/types/project";

 
const Index = () => {
  const [selectedProject, setSelectedProject] = useState<JiraProject | null>(demoProjects[0]);
  const [projectHealth, setProjectHealth] = useState<ProjectHealth | null>(null);
  const [showSettings, setShowSettings] = useState(false);
 
  // Integration settings - persisted in localStorage
  const [teamsWebhookUrl, setTeamsWebhookUrl] = useState(() =>
    localStorage.getItem('teamsWebhookUrl') || ''
  );
  const [sendGridApiKey, setSendGridApiKey] = useState(() =>
    localStorage.getItem('sendGridApiKey') || ''
  );
  const [fromEmail, setFromEmail] = useState(() =>
    localStorage.getItem('fromEmail') || 'noreply@yourapp.com'
  );
 
  // Load project health when project changes
  useEffect(() => {
    if (selectedProject) {
      const health = generateDemoProjectHealth();
      setProjectHealth(health);
    }
  }, [selectedProject]);
 
  // Configure email service when settings change
  useEffect(() => {
    configureEmailService({
      apiKey: sendGridApiKey,
      fromEmail: fromEmail,
    });
    localStorage.setItem('teamsWebhookUrl', teamsWebhookUrl);
    localStorage.setItem('sendGridApiKey', sendGridApiKey);
    localStorage.setItem('fromEmail', fromEmail);
  }, [teamsWebhookUrl, sendGridApiKey, fromEmail]);
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">PM Assistant</h1>
                <p className="text-sm text-muted-foreground">Intelligent Project Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProjectSelector
                projects={demoProjects}
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
              />
              <Button variant="outline" size="icon" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
 
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {projectHealth && (
          <>
            {/* Project Health Overview */}
            <ProjectHealthOverview health={projectHealth} />
 
            {/* Metrics Grid - Schedule, Cost, Risk */}
            <div className="grid gap-6 lg:grid-cols-3">
              <SchedulePanel
                metrics={projectHealth.schedule}
                onViewDetails={() => {}}
              />
              <CostPanel
                metrics={projectHealth.cost}
                onViewDetails={() => {}}
              />
              <RiskPanel
                metrics={projectHealth.risk}
                onViewDetails={() => {}}
              />
            </div>
 
            {/* Follow-up & Escalation */}
            <div className="grid gap-6 lg:grid-cols-2">
              <FollowUpPanel
                metrics={projectHealth.followUp}
                onViewDetails={() => {}}
                teamsWebhookUrl={teamsWebhookUrl}
              />
              <EscalationPanel
                metrics={projectHealth.escalation}
                onViewDetails={() => {}}
                teamsWebhookUrl={teamsWebhookUrl}
              />
            </div>
          </>
        )}
      </main>
 
      {/* AI Assistant - Fixed bottom right */}
      <AIAssistant project={selectedProject} projectHealth={projectHealth} />
 
      {/* Settings Dialog */}
      <SettingsDialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        teamsWebhookUrl={teamsWebhookUrl}
        onTeamsWebhookChange={setTeamsWebhookUrl}
        sendGridApiKey={sendGridApiKey}
        onSendGridApiKeyChange={setSendGridApiKey}
        fromEmail={fromEmail}
        onFromEmailChange={setFromEmail}
      />
    </div>
  );
};
 
export default Index;