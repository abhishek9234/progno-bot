export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      statusCategory: {
        key: string;
        name: string;
      };
    };
    priority?: {
      name: string;
      id: string;
    };
    issuetype: {
      name: string;
      subtask: boolean;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    duedate?: string;
    created: string;
    updated: string;
    storyPoints?: number;
    customfield_10016?: number; // Story points field
    parent?: {
      key: string;
      fields: {
        summary: string;
      };
    };
    labels?: string[];
    comment?: {
      comments: Array<{
        body: string;
        author: { displayName: string };
        created: string;
      }>;
    };
  };
}

export interface ScheduleMetrics {
  totalEpics: number;
  completedEpics: number;
  totalStories: number;
  completedStories: number;
  inProgressStories: number;
  blockedStories: number;
  delayedTasks: JiraIssue[];
  upcomingDeadlines: JiraIssue[];
  completionPercentage: number;
  scheduleVariance: number;
}

export interface CostMetrics {
  hourlyRate: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  remainingStoryPoints: number;
  estimatedCost: number;
  actualCost: number;
  costVariance: number;
  overdueCost: number;
  delayedTasks: JiraIssue[];
}

export interface RiskMetrics {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: RiskFactor[];
  highPriorityBlocked: JiraIssue[];
  overdueTasks: JiraIssue[];
}

export interface RiskFactor {
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impactedTasks: number;
}

export interface EscalationMetrics {
  level: number;
  escalatedItems: EscalationItem[];
  pendingEscalations: JiraIssue[];
  recentEscalations: EscalationItem[];
}

export interface EscalationItem {
  issue: JiraIssue;
  level: number;
  reason: string;
  escalatedAt: string;
  previousFollowUps: number;
}

export interface FollowUpItem {
  issue: JiraIssue;
  reason: string;
  dueIn: string;
  urgency: 'immediate' | 'today' | 'upcoming';
  history: FollowUpHistory[];
}

export interface FollowUpHistory {
  date: string;
  action: string;
  outcome: string;
}

export interface FollowUpMetrics {
  items: FollowUpItem[];
  immediateCount: number;
  todayCount: number;
  upcomingCount: number;
}

export interface ProjectHealth {
  overall: 'healthy' | 'warning' | 'critical';
  schedule: ScheduleMetrics;
  cost: CostMetrics;
  risk: RiskMetrics;
  escalation: EscalationMetrics;
  followUp: FollowUpMetrics;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
