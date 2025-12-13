import { useEffect, useState } from "react";
import { useJiraData } from "@/hooks/useJiraData";
import { ProjectSelector } from "@/components/ProjectSelector";
import { HealthOverview } from "@/components/HealthOverview";
import { SchedulePanel } from "@/components/SchedulePanel";
import { CostPanel } from "@/components/CostPanel";
import { RiskPanel } from "@/components/RiskPanel";
import { EscalationPanel } from "@/components/EscalationPanel";
import { FollowUpPanel } from "@/components/FollowUpPanel";
import { AIAssistant } from "@/components/AIAssistant";
import { DetailModal } from "@/components/DetailModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Play, X } from "lucide-react";

type DetailModalType = 'schedule' | 'cost' | 'risk' | 'escalation' | 'followup' | null;

const Index = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    projectHealth,
    isLoading,
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    fetchProjects,
    fetchProjectIssues,
    refreshData
  } = useJiraData();

  const [modalType, setModalType] = useState<DetailModalType>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectIssues(selectedProject.key);
    }
  }, [selectedProject, fetchProjectIssues]);

  const handleProjectChange = (project: typeof selectedProject) => {
    if (project) {
      setSelectedProject(project);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">PM Assistant</h1>
                  <p className="text-xs text-muted-foreground">AI-Powered Project Management</p>
                </div>
              </div>
              {isDemoMode && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                  Demo Mode
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isDemoMode ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disableDemoMode}
                  className="border-warning/50 text-warning hover:bg-warning/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Exit Demo
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={enableDemoMode}
                  className="border-primary/50 hover:bg-primary/10"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Try Demo
                </Button>
              )}
              
              <ProjectSelector
                projects={projects}
                selectedProject={selectedProject}
                onSelectProject={handleProjectChange}
                onRefresh={refreshData}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative">
        {!selectedProject ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="p-6 rounded-2xl bg-primary/10 mb-6 animate-pulse-glow">
              <Bot className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to PM Assistant</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Select a project from the dropdown above to view health metrics, 
              analyze risks, and get AI-powered insights.
            </p>
            <Button
              onClick={enableDemoMode}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Play className="h-4 w-4 mr-2" />
              Try Demo Mode
            </Button>
          </div>
        ) : isLoading && !projectHealth ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-[600px] rounded-xl" />
            </div>
          </div>
        ) : projectHealth ? (
          <div className="space-y-6 animate-fade-in">
            {/* Health Overview */}
            <HealthOverview health={projectHealth} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Follow Ups */}
              <div className="lg:col-span-1">
                <FollowUpPanel 
                  metrics={projectHealth.followUp} 
                  onViewDetails={() => setModalType('followup')}
                />
              </div>

              {/* Center Column - Dashboard Cards */}
              <div className="lg:col-span-1 space-y-6">
                <SchedulePanel 
                  metrics={projectHealth.schedule} 
                  onViewDetails={() => setModalType('schedule')}
                />
                <CostPanel 
                  metrics={projectHealth.cost} 
                  onViewDetails={() => setModalType('cost')}
                />
              </div>

              {/* Right Column - Risk & Escalation */}
              <div className="lg:col-span-1 space-y-6">
                <RiskPanel 
                  metrics={projectHealth.risk} 
                  onViewDetails={() => setModalType('risk')}
                />
                <EscalationPanel 
                  metrics={projectHealth.escalation} 
                  onViewDetails={() => setModalType('escalation')}
                />
              </div>
            </div>

            {/* AI Assistant - Full Width */}
            <div className="h-[500px]">
              <AIAssistant 
                project={selectedProject} 
                projectHealth={projectHealth}
              />
            </div>
          </div>
        ) : null}
      </main>

      {/* Detail Modal */}
      <DetailModal
        open={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType}
        health={projectHealth}
        jiraBaseUrl={import.meta.env.VITE_JIRA_BASE_URL}
      />
    </div>
  );
};

export default Index;
