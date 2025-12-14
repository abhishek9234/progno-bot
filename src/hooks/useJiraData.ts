import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JiraProject, JiraIssue, ProjectHealth, ScheduleMetrics, CostMetrics, RiskMetrics, EscalationMetrics, FollowUpMetrics, RiskFactor, FollowUpItem, EscalationItem } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { demoProjects, demoIssues, generateDemoProjectHealth } from "@/data/demoData";

const HOURLY_RATE = 40;
const HOURS_PER_SP = 8;

export function useJiraData() {
  const [projects, setProjects] = useState<JiraProject[]>(demoProjects);
  const [selectedProject, setSelectedProject] = useState<JiraProject | null>(demoProjects[0]);
  const [issues, setIssues] = useState<JiraIssue[]>(demoIssues);
  const [projectHealth, setProjectHealth] = useState<ProjectHealth | null>(generateDemoProjectHealth());
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const { toast } = useToast();

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
    // Merge demo projects with existing Jira projects
    setProjects(prev => {
      const existingKeys = prev.map(p => p.key);
      const newDemoProjects = demoProjects.filter(dp => !existingKeys.includes(dp.key));
      return [...prev, ...newDemoProjects];
    });
    // Select first demo project
    setSelectedProject(demoProjects[0]);
    setIssues(demoIssues);
    setProjectHealth(generateDemoProjectHealth());
    toast({
      title: "Demo Mode Enabled",
      description: "Demo data added alongside existing Jira projects.",
    });
  }, [toast]);

  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false);
    // Remove demo projects, keep Jira projects
    setProjects(prev => prev.filter(p => !demoProjects.some(dp => dp.key === p.key)));
    setSelectedProject(null);
    setIssues([]);
    setProjectHealth(null);
  }, []);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jira-api', {
        body: { action: 'getProjects' }
      });

      if (error) throw error;
      
      const jiraProjects = data.projects || [];
      
      // If in demo mode, merge with demo projects
      if (isDemoMode) {
        const existingKeys = jiraProjects.map((p: JiraProject) => p.key);
        const newDemoProjects = demoProjects.filter(dp => !existingKeys.includes(dp.key));
        setProjects([...jiraProjects, ...newDemoProjects]);
      } else {
        setProjects(jiraProjects);
      }
      
      if (jiraProjects.length > 0 && !selectedProject) {
        setSelectedProject(jiraProjects[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // If fetch fails and in demo mode, still show demo projects
      if (isDemoMode) {
        setProjects(demoProjects);
      }
      toast({
        title: "Connection Error",
        description: "Failed to fetch Jira projects. Try Demo Mode to explore the dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, selectedProject, isDemoMode]);

  const fetchProjectIssues = useCallback(async (projectKey: string) => {
    // Check if this is a demo project
    const isDemoProject = demoProjects.some(dp => dp.key === projectKey);
    
    if (isDemoProject) {
      setIssues(demoIssues);
      setProjectHealth(generateDemoProjectHealth());
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jira-api', {
        body: { 
          action: 'getProjectIssues',
          projectKey 
        }
      });

      if (error) throw error;
      
      const fetchedIssues = data.issues || [];
      setIssues(fetchedIssues);
      
      const health = calculateProjectHealth(fetchedIssues);
      setProjectHealth(health);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast({
        title: "Error",
        description: "Failed to fetch project issues. Try Demo Mode to explore the dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const calculateProjectHealth = (issues: JiraIssue[]): ProjectHealth => {
    const now = new Date();
    
    const epics = issues.filter(i => i.fields.issuetype.name === 'Epic');
    const stories = issues.filter(i => ['Story', 'Task', 'Bug'].includes(i.fields.issuetype.name));
    const completedStories = stories.filter(i => i.fields.status.statusCategory.key === 'done');
    const inProgressStories = stories.filter(i => i.fields.status.statusCategory.key === 'indeterminate');
    const blockedStories = stories.filter(i => 
      i.fields.status.name.toLowerCase().includes('blocked') ||
      i.fields.labels?.includes('blocked')
    );
    
    const delayedTasks = stories.filter(i => {
      if (!i.fields.duedate) return false;
      const dueDate = new Date(i.fields.duedate);
      return dueDate < now && i.fields.status.statusCategory.key !== 'done';
    });

    const upcomingDeadlines = stories.filter(i => {
      if (!i.fields.duedate) return false;
      const dueDate = new Date(i.fields.duedate);
      const daysDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff >= 0 && daysDiff <= 3 && i.fields.status.statusCategory.key !== 'done';
    });

    const completionPercentage = stories.length > 0 
      ? (completedStories.length / stories.length) * 100 
      : 0;

    const scheduleVariance = delayedTasks.length > 0 
      ? -(delayedTasks.length / stories.length) * 100 
      : 0;

    const schedule: ScheduleMetrics = {
      totalEpics: epics.length,
      completedEpics: epics.filter(e => e.fields.status.statusCategory.key === 'done').length,
      totalStories: stories.length,
      completedStories: completedStories.length,
      inProgressStories: inProgressStories.length,
      blockedStories: blockedStories.length,
      delayedTasks,
      upcomingDeadlines,
      completionPercentage,
      scheduleVariance
    };

    // Default to 3 SP per story if no story points set
    const getStoryPoints = (issue: JiraIssue) => issue.fields.customfield_10016 || 3;
    const totalSP = stories.reduce((sum, i) => sum + getStoryPoints(i), 0);
    const completedSP = completedStories.reduce((sum, i) => sum + getStoryPoints(i), 0);
    const remainingSP = totalSP - completedSP;
    const estimatedCost = totalSP * HOURS_PER_SP * HOURLY_RATE;
    const actualCost = completedSP * HOURS_PER_SP * HOURLY_RATE;
    
    const overdueSP = delayedTasks.reduce((sum, i) => sum + getStoryPoints(i), 0);
    const overdueCost = overdueSP * HOURS_PER_SP * HOURLY_RATE;
    
    const costVariance = estimatedCost > 0 
      ? ((actualCost + overdueCost - estimatedCost * (completionPercentage / 100)) / estimatedCost) * 100
      : 0;

    const cost: CostMetrics = {
      hourlyRate: HOURLY_RATE,
      totalStoryPoints: totalSP,
      completedStoryPoints: completedSP,
      remainingStoryPoints: remainingSP,
      estimatedCost,
      actualCost,
      costVariance,
      overdueCost,
      delayedTasks
    };

    const riskFactors: RiskFactor[] = [];
    
    if (blockedStories.length > 0) {
      riskFactors.push({
        name: 'Blocked Items',
        severity: blockedStories.length > 3 ? 'high' : 'medium',
        description: `${blockedStories.length} items are currently blocked`,
        impactedTasks: blockedStories.length
      });
    }

    if (delayedTasks.length > 0) {
      riskFactors.push({
        name: 'Overdue Tasks',
        severity: delayedTasks.length > 5 ? 'high' : delayedTasks.length > 2 ? 'medium' : 'low',
        description: `${delayedTasks.length} tasks have passed their due date`,
        impactedTasks: delayedTasks.length
      });
    }

    const highPriorityIssues = stories.filter(i => 
      i.fields.priority?.name === 'Highest' || i.fields.priority?.name === 'High'
    );
    const highPriorityIncomplete = highPriorityIssues.filter(i => 
      i.fields.status.statusCategory.key !== 'done'
    );

    if (highPriorityIncomplete.length > 3) {
      riskFactors.push({
        name: 'High Priority Backlog',
        severity: 'high',
        description: `${highPriorityIncomplete.length} high priority items pending`,
        impactedTasks: highPriorityIncomplete.length
      });
    }

    const noAssignee = stories.filter(i => !i.fields.assignee && i.fields.status.statusCategory.key !== 'done');
    if (noAssignee.length > 0) {
      riskFactors.push({
        name: 'Unassigned Work',
        severity: noAssignee.length > 5 ? 'medium' : 'low',
        description: `${noAssignee.length} items without assignee`,
        impactedTasks: noAssignee.length
      });
    }

    const riskScore = Math.min(100, 
      (blockedStories.length * 15) + 
      (delayedTasks.length * 10) + 
      (highPriorityIncomplete.length * 5) +
      (noAssignee.length * 2)
    );

    const riskLevel = riskScore < 25 ? 'low' 
      : riskScore < 50 ? 'medium' 
      : riskScore < 75 ? 'high' 
      : 'critical';

    const highPriorityBlocked = blockedStories.filter(i => 
      i.fields.priority?.name === 'Highest' || i.fields.priority?.name === 'High'
    );

    const risk: RiskMetrics = {
      level: riskLevel,
      score: riskScore,
      factors: riskFactors,
      highPriorityBlocked,
      overdueTasks: delayedTasks
    };

    const escalatedItems: EscalationItem[] = [];
    
    delayedTasks.forEach(task => {
      const dueDate = new Date(task.fields.duedate!);
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysOverdue > 7) {
        escalatedItems.push({
          issue: task,
          level: daysOverdue > 14 ? 3 : daysOverdue > 7 ? 2 : 1,
          reason: `Overdue by ${daysOverdue} days`,
          escalatedAt: new Date(now.getTime() - daysOverdue * 24 * 60 * 60 * 1000).toISOString(),
          previousFollowUps: Math.floor(daysOverdue / 3)
        });
      }
    });

    const escalationLevel = escalatedItems.reduce((max, item) => Math.max(max, item.level), 0);

    const escalation: EscalationMetrics = {
      level: escalationLevel,
      escalatedItems,
      pendingEscalations: delayedTasks.filter(t => {
        const dueDate = new Date(t.fields.duedate!);
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysOverdue > 3 && daysOverdue <= 7;
      }),
      recentEscalations: escalatedItems.slice(0, 5)
    };

    const followUpItems: FollowUpItem[] = [];

    // In Progress items with due dates - check for overdue or upcoming (within 72 hours)
    inProgressStories.forEach(task => {
      if (task.fields.duedate) {
        const dueDate = new Date(task.fields.duedate);
        const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        // Include overdue items (negative hoursDiff) as immediate
        if (hoursDiff <= 72) {
          const isOverdue = hoursDiff < 0;
          followUpItems.push({
            issue: task,
            reason: isOverdue 
              ? `OVERDUE: Was due ${Math.abs(Math.round(hoursDiff / 24))} days ago` 
              : hoursDiff <= 8 
                ? 'URGENT: Due soon - Immediate attention required' 
                : 'Due within 72 hours',
            dueIn: isOverdue 
              ? 'OVERDUE' 
              : hoursDiff <= 24 
                ? `${Math.round(hoursDiff)} hours` 
                : `${Math.round(hoursDiff / 24)} days`,
            urgency: isOverdue || hoursDiff <= 8 ? 'immediate' : hoursDiff <= 24 ? 'today' : 'upcoming',
            history: []
          });
        }
      }
    });

    // On hold items always need follow-up - match more status patterns
    const onHoldItems = stories.filter(i => {
      const statusName = i.fields.status.name.toLowerCase();
      const statusKey = i.fields.status.statusCategory?.key;
      return statusName.includes('hold') ||
        statusName.includes('waiting') ||
        statusName.includes('blocked') ||
        statusName.includes('backlog') ||
        statusKey === 'new'; // Backlog items in Jira often have 'new' status category
    });
    
    onHoldItems.forEach(task => {
      if (!followUpItems.find(f => f.issue.key === task.key)) {
        followUpItems.push({
          issue: task,
          reason: `Status: ${task.fields.status.name} - needs review`,
          dueIn: 'ASAP',
          urgency: 'today',
          history: []
        });
      }
    });

    // Upcoming deadlines within 3 days
    upcomingDeadlines.forEach(task => {
      if (!followUpItems.find(f => f.issue.key === task.key)) {
        const dueDate = new Date(task.fields.duedate!);
        const daysDiff = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        followUpItems.push({
          issue: task,
          reason: 'Approaching deadline',
          dueIn: daysDiff === 0 ? 'Today' : `${daysDiff} days`,
          urgency: daysDiff === 0 ? 'today' : 'upcoming',
          history: []
        });
      }
    });

    const followUp: FollowUpMetrics = {
      items: followUpItems.sort((a, b) => {
        const urgencyOrder = { immediate: 0, today: 1, upcoming: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }),
      immediateCount: followUpItems.filter(i => i.urgency === 'immediate').length,
      todayCount: followUpItems.filter(i => i.urgency === 'today').length,
      upcomingCount: followUpItems.filter(i => i.urgency === 'upcoming').length
    };

    const overallHealth = 
      risk.level === 'critical' || escalation.level >= 3 ? 'critical' :
      risk.level === 'high' || escalation.level >= 2 || followUp.immediateCount > 3 ? 'warning' :
      'healthy';

    return {
      overall: overallHealth,
      schedule,
      cost,
      risk,
      escalation,
      followUp
    };
  };

  const refreshData = useCallback(async () => {
    if (selectedProject) {
      await fetchProjectIssues(selectedProject.key);
    }
  }, [selectedProject, fetchProjectIssues]);

  return {
    projects,
    selectedProject,
    setSelectedProject,
    issues,
    projectHealth,
    isLoading,
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    fetchProjects,
    fetchProjectIssues,
    refreshData
  };
}
