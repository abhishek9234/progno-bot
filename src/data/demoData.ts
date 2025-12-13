import { JiraProject, JiraIssue, ProjectHealth, ScheduleMetrics, CostMetrics, RiskMetrics, EscalationMetrics, FollowUpMetrics, RiskFactor, FollowUpItem, EscalationItem } from "@/types/project";

const HOURLY_RATE = 40;
const HOURS_PER_SP = 8;

export const demoProjects: JiraProject[] = [
  { id: "demo-1", key: "DEMO", name: "Demo Project - E-Commerce Platform", projectTypeKey: "software" },
  { id: "demo-2", key: "MOBILE", name: "Mobile App Development", projectTypeKey: "software" },
  { id: "demo-3", key: "INFRA", name: "Infrastructure Modernization", projectTypeKey: "software" },
];

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
const hoursFromNow = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();

export const demoIssues: JiraIssue[] = [
  // Epics
  {
    id: "epic-1", key: "DEMO-1",
    fields: {
      summary: "User Authentication & Authorization",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Epic", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      created: daysAgo(60), updated: daysAgo(5),
      customfield_10016: 40,
    }
  },
  {
    id: "epic-2", key: "DEMO-2",
    fields: {
      summary: "Shopping Cart & Checkout",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Epic", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      created: daysAgo(45), updated: daysAgo(1),
      customfield_10016: 55,
    }
  },
  {
    id: "epic-3", key: "DEMO-3",
    fields: {
      summary: "Payment Integration",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Epic", subtask: false },
      created: daysAgo(30), updated: daysAgo(2),
      customfield_10016: 35,
    }
  },
  // Completed Stories
  {
    id: "story-1", key: "DEMO-101",
    fields: {
      summary: "Implement user registration flow",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: daysAgo(10),
      created: daysAgo(30), updated: daysAgo(8),
      customfield_10016: 8,
      parent: { key: "DEMO-1", fields: { summary: "User Authentication" } },
    }
  },
  {
    id: "story-2", key: "DEMO-102",
    fields: {
      summary: "Create login page with OAuth support",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: daysAgo(7),
      created: daysAgo(25), updated: daysAgo(6),
      customfield_10016: 5,
      parent: { key: "DEMO-1", fields: { summary: "User Authentication" } },
    }
  },
  {
    id: "story-3", key: "DEMO-103",
    fields: {
      summary: "Password reset functionality",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: daysAgo(5),
      created: daysAgo(20), updated: daysAgo(4),
      customfield_10016: 3,
    }
  },
  // In Progress Stories
  {
    id: "story-4", key: "DEMO-201",
    fields: {
      summary: "Shopping cart state management",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      duedate: hoursFromNow(20),
      created: daysAgo(10), updated: daysAgo(0),
      customfield_10016: 8,
      parent: { key: "DEMO-2", fields: { summary: "Shopping Cart" } },
    }
  },
  {
    id: "story-5", key: "DEMO-202",
    fields: {
      summary: "Checkout form validation",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Mike Wilson", emailAddress: "mike@example.com" },
      duedate: daysFromNow(2),
      created: daysAgo(8), updated: daysAgo(0),
      customfield_10016: 5,
      parent: { key: "DEMO-2", fields: { summary: "Shopping Cart" } },
    }
  },
  {
    id: "story-6", key: "DEMO-203",
    fields: {
      summary: "Order confirmation emails",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: hoursFromNow(6),
      created: daysAgo(5), updated: daysAgo(0),
      customfield_10016: 3,
    }
  },
  // Blocked Stories
  {
    id: "story-7", key: "DEMO-204",
    fields: {
      summary: "Payment gateway integration",
      status: { name: "Blocked", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      duedate: daysAgo(2),
      created: daysAgo(15), updated: daysAgo(1),
      customfield_10016: 13,
      labels: ["blocked"],
      parent: { key: "DEMO-3", fields: { summary: "Payment Integration" } },
    }
  },
  {
    id: "story-8", key: "DEMO-205",
    fields: {
      summary: "Inventory sync with warehouse API",
      status: { name: "Blocked", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      duedate: daysAgo(3),
      created: daysAgo(12), updated: daysAgo(2),
      customfield_10016: 8,
      labels: ["blocked", "external-dependency"],
    }
  },
  // Overdue Stories
  {
    id: "story-9", key: "DEMO-206",
    fields: {
      summary: "Product search optimization",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Mike Wilson", emailAddress: "mike@example.com" },
      duedate: daysAgo(5),
      created: daysAgo(20), updated: daysAgo(1),
      customfield_10016: 5,
    }
  },
  {
    id: "story-10", key: "DEMO-207",
    fields: {
      summary: "Customer reviews module",
      status: { name: "In Review", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: daysAgo(8),
      created: daysAgo(25), updated: daysAgo(3),
      customfield_10016: 5,
    }
  },
  // On Hold
  {
    id: "story-11", key: "DEMO-208",
    fields: {
      summary: "Social media sharing feature",
      status: { name: "On Hold", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Low", id: "4" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: daysFromNow(5),
      created: daysAgo(18), updated: daysAgo(7),
      customfield_10016: 3,
    }
  },
  // To Do Stories
  {
    id: "story-12", key: "DEMO-301",
    fields: {
      summary: "Stripe payment integration",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Story", subtask: false },
      duedate: daysFromNow(7),
      created: daysAgo(5), updated: daysAgo(5),
      customfield_10016: 13,
      parent: { key: "DEMO-3", fields: { summary: "Payment Integration" } },
    }
  },
  {
    id: "story-13", key: "DEMO-302",
    fields: {
      summary: "PayPal integration",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      duedate: daysFromNow(10),
      created: daysAgo(5), updated: daysAgo(5),
      customfield_10016: 8,
      parent: { key: "DEMO-3", fields: { summary: "Payment Integration" } },
    }
  },
  // Bugs
  {
    id: "bug-1", key: "DEMO-401",
    fields: {
      summary: "Cart total calculation error with discounts",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Bug", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      duedate: hoursFromNow(4),
      created: daysAgo(2), updated: daysAgo(0),
      customfield_10016: 3,
    }
  },
  {
    id: "bug-2", key: "DEMO-402",
    fields: {
      summary: "Login session timeout issue",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Bug", subtask: false },
      duedate: daysFromNow(1),
      created: daysAgo(1), updated: daysAgo(1),
      customfield_10016: 2,
    }
  },
];

export function generateDemoProjectHealth(): ProjectHealth {
  const stories = demoIssues.filter(i => ['Story', 'Task', 'Bug'].includes(i.fields.issuetype.name));
  const epics = demoIssues.filter(i => i.fields.issuetype.name === 'Epic');
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

  const completionPercentage = (completedStories.length / stories.length) * 100;
  const scheduleVariance = -(delayedTasks.length / stories.length) * 100;

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

  const totalSP = stories.reduce((sum, i) => sum + (i.fields.customfield_10016 || 0), 0);
  const completedSP = completedStories.reduce((sum, i) => sum + (i.fields.customfield_10016 || 0), 0);
  const overdueSP = delayedTasks.reduce((sum, i) => sum + (i.fields.customfield_10016 || 0), 0);
  
  const cost: CostMetrics = {
    hourlyRate: HOURLY_RATE,
    totalStoryPoints: totalSP,
    completedStoryPoints: completedSP,
    remainingStoryPoints: totalSP - completedSP,
    estimatedCost: totalSP * HOURS_PER_SP * HOURLY_RATE,
    actualCost: completedSP * HOURS_PER_SP * HOURLY_RATE,
    costVariance: 12.5,
    overdueCost: overdueSP * HOURS_PER_SP * HOURLY_RATE,
    delayedTasks
  };

  const riskFactors: RiskFactor[] = [
    { name: 'Blocked Items', severity: 'high', description: '2 items are currently blocked', impactedTasks: 2 },
    { name: 'Overdue Tasks', severity: 'medium', description: '4 tasks have passed their due date', impactedTasks: 4 },
    { name: 'High Priority Backlog', severity: 'medium', description: '3 high priority items pending', impactedTasks: 3 },
    { name: 'Unassigned Work', severity: 'low', description: '2 items without assignee', impactedTasks: 2 },
  ];

  const risk: RiskMetrics = {
    level: 'medium',
    score: 58,
    factors: riskFactors,
    highPriorityBlocked: blockedStories.filter(i => 
      i.fields.priority?.name === 'Highest' || i.fields.priority?.name === 'High'
    ),
    overdueTasks: delayedTasks
  };

  const escalatedItems: EscalationItem[] = delayedTasks
    .filter(t => {
      const dueDate = new Date(t.fields.duedate!);
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysOverdue > 5;
    })
    .map(task => ({
      issue: task,
      level: 2,
      reason: 'Overdue by more than 5 days',
      escalatedAt: daysAgo(3),
      previousFollowUps: 2
    }));

  const escalation: EscalationMetrics = {
    level: escalatedItems.length > 0 ? 2 : 0,
    escalatedItems,
    pendingEscalations: delayedTasks.filter(t => {
      const dueDate = new Date(t.fields.duedate!);
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysOverdue > 2 && daysOverdue <= 5;
    }),
    recentEscalations: escalatedItems.slice(0, 3)
  };

  const followUpItems: FollowUpItem[] = [];

  inProgressStories.forEach(task => {
    if (task.fields.duedate) {
      const dueDate = new Date(task.fields.duedate);
      const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff <= 24 && hoursDiff > 0) {
        followUpItems.push({
          issue: task,
          reason: 'Due within 24 hours',
          dueIn: `${Math.round(hoursDiff)} hours`,
          urgency: hoursDiff <= 4 ? 'immediate' : 'today',
          history: []
        });
      }
    }
  });

  const onHoldItems = stories.filter(i => 
    i.fields.status.name.toLowerCase().includes('hold')
  );
  
  onHoldItems.forEach(task => {
    followUpItems.push({
      issue: task,
      reason: 'Status: On Hold - needs review',
      dueIn: 'ASAP',
      urgency: 'today',
      history: []
    });
  });

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

  return {
    overall: 'warning',
    schedule,
    cost,
    risk,
    escalation,
    followUp
  };
}
