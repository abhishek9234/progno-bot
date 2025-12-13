import { JiraProject, JiraIssue, ProjectHealth, ScheduleMetrics, CostMetrics, RiskMetrics, EscalationMetrics, FollowUpMetrics, RiskFactor, FollowUpItem, EscalationItem } from "@/types/project";

const HOURLY_RATE = 40;
const HOURS_PER_SP = 8;

export const demoProjects: JiraProject[] = [
  { id: "demo-1", key: "ECOM", name: "E-Commerce Platform", projectTypeKey: "software" },
];

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
const hoursFromNow = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

export const demoIssues: JiraIssue[] = [
  // ============ EPICS ============
  {
    id: "epic-1", key: "ECOM-1",
    fields: {
      summary: "User Authentication & Authorization System",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Epic", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      created: daysAgo(90), updated: daysAgo(10),
      customfield_10016: 55,
    }
  },
  {
    id: "epic-2", key: "ECOM-2",
    fields: {
      summary: "Shopping Cart & Checkout Flow",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Epic", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      created: daysAgo(60), updated: daysAgo(1),
      customfield_10016: 75,
    }
  },
  {
    id: "epic-3", key: "ECOM-3",
    fields: {
      summary: "Payment Gateway Integration",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Epic", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      created: daysAgo(45), updated: daysAgo(2),
      customfield_10016: 45,
    }
  },
  {
    id: "epic-4", key: "ECOM-4",
    fields: {
      summary: "Inventory Management System",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Epic", subtask: false },
      created: daysAgo(30), updated: daysAgo(5),
      customfield_10016: 40,
    }
  },

  // ============ COMPLETED STORIES ============
  {
    id: "story-1", key: "ECOM-101",
    fields: {
      summary: "Implement user registration with email verification",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: daysAgo(15),
      created: daysAgo(40), updated: daysAgo(12),
      customfield_10016: 8,
      parent: { key: "ECOM-1", fields: { summary: "User Authentication" } },
    }
  },
  {
    id: "story-2", key: "ECOM-102",
    fields: {
      summary: "OAuth2 integration (Google, GitHub, Microsoft)",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: daysAgo(12),
      created: daysAgo(35), updated: daysAgo(10),
      customfield_10016: 13,
      parent: { key: "ECOM-1", fields: { summary: "User Authentication" } },
    }
  },
  {
    id: "story-3", key: "ECOM-103",
    fields: {
      summary: "Password reset and recovery flow",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: daysAgo(8),
      created: daysAgo(25), updated: daysAgo(7),
      customfield_10016: 5,
    }
  },
  {
    id: "story-4", key: "ECOM-104",
    fields: {
      summary: "Two-factor authentication setup",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: daysAgo(5),
      created: daysAgo(20), updated: daysAgo(4),
      customfield_10016: 8,
    }
  },

  // ============ IN PROGRESS - DUE SOON (Follow-ups) ============
  {
    id: "story-5", key: "ECOM-201",
    fields: {
      summary: "Shopping cart persistence across sessions",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      duedate: hoursFromNow(3), // Due in 3 hours - IMMEDIATE
      created: daysAgo(12), updated: hoursAgo(2),
      customfield_10016: 8,
      parent: { key: "ECOM-2", fields: { summary: "Shopping Cart" } },
    }
  },
  {
    id: "story-6", key: "ECOM-202",
    fields: {
      summary: "Checkout form with address validation",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Mike Wilson", emailAddress: "mike@example.com" },
      duedate: hoursFromNow(8), // Due in 8 hours - IMMEDIATE
      created: daysAgo(10), updated: hoursAgo(1),
      customfield_10016: 5,
      parent: { key: "ECOM-2", fields: { summary: "Shopping Cart" } },
    }
  },
  {
    id: "story-7", key: "ECOM-203",
    fields: {
      summary: "Order confirmation email templates",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: hoursFromNow(18), // Due in 18 hours - TODAY
      created: daysAgo(8), updated: hoursAgo(4),
      customfield_10016: 3,
    }
  },
  {
    id: "story-8", key: "ECOM-204",
    fields: {
      summary: "Cart quantity update optimization",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      duedate: daysFromNow(2), // Due in 2 days - UPCOMING
      created: daysAgo(5), updated: daysAgo(1),
      customfield_10016: 3,
    }
  },

  // ============ BLOCKED STORIES (Risk factors) ============
  {
    id: "story-9", key: "ECOM-301",
    fields: {
      summary: "Stripe payment gateway integration",
      status: { name: "Blocked", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      duedate: daysAgo(5), // 5 days overdue
      created: daysAgo(20), updated: daysAgo(3),
      customfield_10016: 13,
      labels: ["blocked", "external-dependency"],
      parent: { key: "ECOM-3", fields: { summary: "Payment Integration" } },
    }
  },
  {
    id: "story-10", key: "ECOM-302",
    fields: {
      summary: "PayPal checkout integration",
      status: { name: "Blocked", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      duedate: daysAgo(3), // 3 days overdue
      created: daysAgo(18), updated: daysAgo(2),
      customfield_10016: 8,
      labels: ["blocked"],
      parent: { key: "ECOM-3", fields: { summary: "Payment Integration" } },
    }
  },
  {
    id: "story-11", key: "ECOM-303",
    fields: {
      summary: "Inventory sync with warehouse API",
      status: { name: "Blocked", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Mike Wilson", emailAddress: "mike@example.com" },
      duedate: daysAgo(7), // 7 days overdue
      created: daysAgo(25), updated: daysAgo(5),
      customfield_10016: 8,
      labels: ["blocked", "external-dependency", "critical-path"],
    }
  },
  {
    id: "story-12", key: "ECOM-304",
    fields: {
      summary: "Real-time stock level updates",
      status: { name: "Blocked", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      duedate: daysAgo(2),
      created: daysAgo(15), updated: daysAgo(1),
      customfield_10016: 5,
      labels: ["blocked"],
    }
  },

  // ============ SEVERELY OVERDUE (Escalations) ============
  {
    id: "story-13", key: "ECOM-305",
    fields: {
      summary: "Product search with ElasticSearch",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Mike Wilson", emailAddress: "mike@example.com" },
      duedate: daysAgo(15), // 15 days overdue - CRITICAL ESCALATION
      created: daysAgo(45), updated: daysAgo(3),
      customfield_10016: 8,
    }
  },
  {
    id: "story-14", key: "ECOM-306",
    fields: {
      summary: "Customer reviews and ratings module",
      status: { name: "In Review", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: daysAgo(12), // 12 days overdue - ESCALATION LEVEL 2
      created: daysAgo(35), updated: daysAgo(4),
      customfield_10016: 5,
    }
  },
  {
    id: "story-15", key: "ECOM-307",
    fields: {
      summary: "Wishlist functionality",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Low", id: "4" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: daysAgo(10), // 10 days overdue - ESCALATION LEVEL 2
      created: daysAgo(30), updated: daysAgo(2),
      customfield_10016: 5,
    }
  },
  {
    id: "story-16", key: "ECOM-308",
    fields: {
      summary: "Product comparison feature",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      duedate: daysAgo(8), // 8 days overdue - ESCALATION LEVEL 1
      created: daysAgo(28), updated: daysAgo(1),
      customfield_10016: 5,
    }
  },

  // ============ ON HOLD (Needs Follow-up) ============
  {
    id: "story-17", key: "ECOM-401",
    fields: {
      summary: "Social media sharing integration",
      status: { name: "On Hold", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Low", id: "4" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: daysFromNow(10),
      created: daysAgo(25), updated: daysAgo(8),
      customfield_10016: 3,
    }
  },
  {
    id: "story-18", key: "ECOM-402",
    fields: {
      summary: "Gift card system implementation",
      status: { name: "Waiting for Approval", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      assignee: { displayName: "Sarah Johnson", emailAddress: "sarah@example.com" },
      duedate: daysFromNow(5),
      created: daysAgo(20), updated: daysAgo(10),
      customfield_10016: 8,
    }
  },
  {
    id: "story-19", key: "ECOM-403",
    fields: {
      summary: "Loyalty points system design",
      status: { name: "On Hold", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Low", id: "4" },
      issuetype: { name: "Story", subtask: false },
      duedate: daysFromNow(15),
      created: daysAgo(18), updated: daysAgo(12),
      customfield_10016: 5,
    }
  },

  // ============ TO DO ============
  {
    id: "story-20", key: "ECOM-501",
    fields: {
      summary: "Apple Pay integration",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      duedate: daysFromNow(14),
      created: daysAgo(7), updated: daysAgo(7),
      customfield_10016: 8,
      parent: { key: "ECOM-3", fields: { summary: "Payment Integration" } },
    }
  },
  {
    id: "story-21", key: "ECOM-502",
    fields: {
      summary: "Google Pay integration",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Story", subtask: false },
      duedate: daysFromNow(14),
      created: daysAgo(7), updated: daysAgo(7),
      customfield_10016: 5,
      parent: { key: "ECOM-3", fields: { summary: "Payment Integration" } },
    }
  },
  {
    id: "story-22", key: "ECOM-503",
    fields: {
      summary: "Inventory dashboard for admins",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Story", subtask: false },
      duedate: daysFromNow(21),
      created: daysAgo(5), updated: daysAgo(5),
      customfield_10016: 8,
      parent: { key: "ECOM-4", fields: { summary: "Inventory Management" } },
    }
  },

  // ============ BUGS ============
  {
    id: "bug-1", key: "ECOM-601",
    fields: {
      summary: "Cart total miscalculation with percentage discounts",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Bug", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      duedate: hoursFromNow(2), // IMMEDIATE - Critical bug
      created: daysAgo(1), updated: hoursAgo(1),
      customfield_10016: 3,
    }
  },
  {
    id: "bug-2", key: "ECOM-602",
    fields: {
      summary: "Session timeout during checkout causes data loss",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Bug", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: hoursFromNow(6), // IMMEDIATE
      created: daysAgo(2), updated: hoursAgo(3),
      customfield_10016: 5,
    }
  },
  {
    id: "bug-3", key: "ECOM-603",
    fields: {
      summary: "Mobile responsive issues on checkout page",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Bug", subtask: false },
      duedate: daysFromNow(1),
      created: daysAgo(1), updated: daysAgo(1),
      customfield_10016: 3,
    }
  },
  {
    id: "bug-4", key: "ECOM-604",
    fields: {
      summary: "Product images not loading on slow connections",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Medium", id: "3" },
      issuetype: { name: "Bug", subtask: false },
      assignee: { displayName: "Emily Chen", emailAddress: "emily@example.com" },
      duedate: daysAgo(4), // 4 days overdue
      created: daysAgo(10), updated: daysAgo(2),
      customfield_10016: 2,
    }
  },
  {
    id: "bug-5", key: "ECOM-605",
    fields: {
      summary: "Search results pagination broken",
      status: { name: "Blocked", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Bug", subtask: false },
      assignee: { displayName: "Mike Wilson", emailAddress: "mike@example.com" },
      duedate: daysAgo(6), // 6 days overdue and blocked
      created: daysAgo(14), updated: daysAgo(4),
      customfield_10016: 3,
      labels: ["blocked"],
    }
  },

  // ============ TASKS ============
  {
    id: "task-1", key: "ECOM-701",
    fields: {
      summary: "Set up CI/CD pipeline for staging",
      status: { name: "Done", statusCategory: { key: "done", name: "Done" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Task", subtask: false },
      assignee: { displayName: "Alex Kumar", emailAddress: "alex@example.com" },
      duedate: daysAgo(7),
      created: daysAgo(15), updated: daysAgo(6),
      customfield_10016: 5,
    }
  },
  {
    id: "task-2", key: "ECOM-702",
    fields: {
      summary: "Database migration scripts for v2.0",
      status: { name: "In Progress", statusCategory: { key: "indeterminate", name: "In Progress" } },
      priority: { name: "Highest", id: "1" },
      issuetype: { name: "Task", subtask: false },
      assignee: { displayName: "John Smith", emailAddress: "john@example.com" },
      duedate: hoursFromNow(12), // TODAY
      created: daysAgo(5), updated: hoursAgo(2),
      customfield_10016: 8,
    }
  },
  {
    id: "task-3", key: "ECOM-703",
    fields: {
      summary: "Performance testing and optimization",
      status: { name: "To Do", statusCategory: { key: "new", name: "To Do" } },
      priority: { name: "High", id: "2" },
      issuetype: { name: "Task", subtask: false },
      duedate: daysFromNow(7),
      created: daysAgo(3), updated: daysAgo(3),
      customfield_10016: 13,
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
    costVariance: 18.5, // 18.5% over budget
    overdueCost: overdueSP * HOURS_PER_SP * HOURLY_RATE,
    delayedTasks
  };

  const riskFactors: RiskFactor[] = [
    { 
      name: 'Blocked Items', 
      severity: 'high', 
      description: `${blockedStories.length} critical items blocked by external dependencies`, 
      impactedTasks: blockedStories.length 
    },
    { 
      name: 'Overdue Tasks', 
      severity: 'high', 
      description: `${delayedTasks.length} tasks have missed their deadlines`, 
      impactedTasks: delayedTasks.length 
    },
    { 
      name: 'Payment Integration Delay', 
      severity: 'high', 
      description: 'Stripe API access pending approval - blocking checkout flow', 
      impactedTasks: 3 
    },
    { 
      name: 'Resource Constraint', 
      severity: 'medium', 
      description: 'Backend team at 120% capacity this sprint', 
      impactedTasks: 8 
    },
    { 
      name: 'Unassigned High Priority', 
      severity: 'medium', 
      description: '3 high priority items without assignee', 
      impactedTasks: 3 
    },
    { 
      name: 'Technical Debt', 
      severity: 'low', 
      description: 'Legacy code in search module needs refactoring', 
      impactedTasks: 2 
    },
  ];

  const risk: RiskMetrics = {
    level: 'high',
    score: 72,
    factors: riskFactors,
    highPriorityBlocked: blockedStories.filter(i => 
      i.fields.priority?.name === 'Highest' || i.fields.priority?.name === 'High'
    ),
    overdueTasks: delayedTasks
  };

  // Generate escalation items based on overdue duration
  const escalatedItems: EscalationItem[] = [];
  
  delayedTasks.forEach(task => {
    const dueDate = new Date(task.fields.duedate!);
    const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue > 5) {
      let level = 1;
      let reason = '';
      
      if (daysOverdue > 14) {
        level = 3;
        reason = `CRITICAL: ${daysOverdue} days overdue - Executive escalation required`;
      } else if (daysOverdue > 10) {
        level = 2;
        reason = `HIGH: ${daysOverdue} days overdue - Manager escalation active`;
      } else {
        level = 1;
        reason = `${daysOverdue} days overdue - Team lead notified`;
      }
      
      escalatedItems.push({
        issue: task,
        level,
        reason,
        escalatedAt: daysAgo(Math.min(daysOverdue - 5, 10)),
        previousFollowUps: Math.floor(daysOverdue / 2)
      });
    }
  });

  const escalation: EscalationMetrics = {
    level: Math.max(...escalatedItems.map(e => e.level), 0),
    escalatedItems: escalatedItems.sort((a, b) => b.level - a.level),
    pendingEscalations: delayedTasks.filter(t => {
      const dueDate = new Date(t.fields.duedate!);
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysOverdue > 2 && daysOverdue <= 5;
    }),
    recentEscalations: escalatedItems.slice(0, 5)
  };

  // Generate follow-up items
  const followUpItems: FollowUpItem[] = [];

  // Immediate follow-ups (due within 4 hours)
  inProgressStories.forEach(task => {
    if (task.fields.duedate) {
      const dueDate = new Date(task.fields.duedate);
      const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 0 && hoursDiff <= 4) {
        followUpItems.push({
          issue: task,
          reason: `URGENT: Due in ${Math.round(hoursDiff)} hours - Immediate attention required`,
          dueIn: `${Math.round(hoursDiff)} hours`,
          urgency: 'immediate',
          history: [
            { date: hoursAgo(2), action: 'Status check', outcome: 'In progress, needs support' },
            { date: daysAgo(1), action: 'Daily standup', outcome: 'On track' },
          ]
        });
      } else if (hoursDiff > 4 && hoursDiff <= 24) {
        followUpItems.push({
          issue: task,
          reason: 'Due today - Check progress and blockers',
          dueIn: `${Math.round(hoursDiff)} hours`,
          urgency: 'today',
          history: [
            { date: daysAgo(1), action: 'Progress review', outcome: 'Needs final testing' },
          ]
        });
      }
    }
  });

  // On hold items need follow-up
  const onHoldItems = stories.filter(i => 
    i.fields.status.name.toLowerCase().includes('hold') ||
    i.fields.status.name.toLowerCase().includes('waiting')
  );
  
  onHoldItems.forEach(task => {
    const daysSinceUpdate = Math.floor((now.getTime() - new Date(task.fields.updated).getTime()) / (1000 * 60 * 60 * 24));
    followUpItems.push({
      issue: task,
      reason: `On Hold for ${daysSinceUpdate} days - Review and unblock`,
      dueIn: 'Review needed',
      urgency: daysSinceUpdate > 7 ? 'immediate' : 'today',
      history: [
        { date: daysAgo(daysSinceUpdate), action: 'Put on hold', outcome: 'Waiting for stakeholder decision' },
      ]
    });
  });

  // Upcoming deadlines
  upcomingDeadlines.forEach(task => {
    if (!followUpItems.find(f => f.issue.key === task.key)) {
      const dueDate = new Date(task.fields.duedate!);
      const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      followUpItems.push({
        issue: task,
        reason: `Deadline in ${daysDiff} day(s) - Verify completion status`,
        dueIn: daysDiff === 0 ? 'Today' : `${daysDiff} days`,
        urgency: daysDiff <= 1 ? 'today' : 'upcoming',
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
