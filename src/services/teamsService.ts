// Microsoft Teams Webhook Integration Service
 
interface TeamsMessage {
  title: string;
  text: string;
  themeColor?: string;
  sections?: TeamsSection[];
}
 
interface TeamsSection {
  activityTitle?: string;
  activitySubtitle?: string;
  activityText?: string;
  facts?: { name: string; value: string }[];
}
 
interface TeamsCardPayload {
  "@type": "MessageCard";
  "@context": "http://schema.org/extensions";
  themeColor: string;
  summary: string;
  title: string;
  sections: {
    activityTitle?: string;
    activitySubtitle?: string;
    activityText?: string;
    facts?: { name: string; value: string }[];
    markdown: boolean;
  }[];
}
 
export const sendTeamsMessage = async (
  webhookUrl: string,
  message: TeamsMessage
): Promise<{ success: boolean; error?: string }> => {
  if (!webhookUrl) {
    return { success: false, error: "Teams webhook URL is not configured" };
  }
 
  const payload: TeamsCardPayload = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: message.themeColor || "0076D7",
    summary: message.title,
    title: message.title,
    sections: message.sections?.map(section => ({
      ...section,
      markdown: true
    })) || [{
      activityTitle: message.title,
      activityText: message.text,
      markdown: true
    }]
  };
 
  try {
    console.log("Sending Teams message to webhook:", webhookUrl);
   
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
 
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Teams webhook error:", errorText);
      return { success: false, error: `Teams API error: ${response.status}` };
    }
 
    console.log("Teams message sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to send Teams message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};
 
export const sendFollowUpToTeams = async (
  webhookUrl: string,
  itemTitle: string,
  assignee: string,
  message: string,
  priority: string
): Promise<{ success: boolean; error?: string }> => {
  const priorityColors: Record<string, string> = {
    high: "FF0000",
    medium: "FFA500",
    low: "008000",
  };
 
  return sendTeamsMessage(webhookUrl, {
    title: "📋 Follow-up Required",
    text: message,
    themeColor: priorityColors[priority.toLowerCase()] || "0076D7",
    sections: [
      {
        activityTitle: itemTitle,
        activitySubtitle: `Assigned to: ${assignee}`,
        activityText: message,
        facts: [
          { name: "Priority", value: priority },
          { name: "Status", value: "Follow-up Sent" },
          { name: "Sent At", value: new Date().toLocaleString() }
        ]
      }
    ]
  });
};
 
export const sendEscalationToTeams = async (
  webhookUrl: string,
  itemTitle: string,
  assignee: string,
  manager: string,
  reason: string,
  isOnHold: boolean
): Promise<{ success: boolean; error?: string }> => {
  const facts = [
    { name: "Assignee", value: assignee },
    { name: "Manager", value: manager },
    { name: "Status", value: isOnHold ? "On Hold" : "Active" },
    { name: "Escalated At", value: new Date().toLocaleString() }
  ];
 
  if (isOnHold) {
    facts.push({ name: "Blocked By", value: "On Hold Status" });
  }
 
  return sendTeamsMessage(webhookUrl, {
    title: "🚨 Escalation Alert",
    text: reason,
    themeColor: "FF0000",
    sections: [
      {
        activityTitle: itemTitle,
        activitySubtitle: `Escalation Notification`,
        activityText: reason,
        facts
      }
    ]
  });
};