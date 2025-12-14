import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  channel: 'email' | 'teams';
  type: 'followup' | 'escalation';
  issue: {
    key: string;
    summary: string;
    status: string;
    priority: string;
    assignee: string;
    assigneeEmail: string;
  };
  recipients: Array<{ email: string; name: string }>;
  message: string;
  reason: string;
  managerEmail: string;
  managerName: string;
  isOnHold: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: NotificationRequest = await req.json();
    console.log('Notification request received:', JSON.stringify(payload, null, 2));

    const { channel, type, issue, recipients, message, reason, managerEmail, managerName, isOnHold } = payload;

    // Build notification content
    const subject = type === 'followup' 
      ? `[Follow-up Required] ${issue.key}: ${issue.summary}`
      : `[ESCALATION] ${issue.key}: ${issue.summary}`;

    const bodyContent = `
${type === 'escalation' ? '⚠️ ESCALATION NOTICE' : '📋 Follow-up Required'}

Issue: ${issue.key}
Summary: ${issue.summary}
Status: ${issue.status}
Priority: ${issue.priority || 'Not set'}
Assignee: ${issue.assignee || 'Unassigned'}

Reason: ${reason}

${isOnHold ? '⏸️ This item is currently ON HOLD and requires immediate attention.' : ''}

${message ? `Additional Notes:\n${message}` : ''}

---
This notification was sent via PM Assistant.
Please take appropriate action as soon as possible.
    `.trim();

    if (channel === 'email') {
      // For demo purposes, we'll log the email content
      // In production, integrate with Resend or another email service
      console.log('=== EMAIL NOTIFICATION ===');
      console.log('To:', recipients.map(r => `${r.name} <${r.email}>`).join(', '));
      console.log('Subject:', subject);
      console.log('Body:', bodyContent);
      console.log('========================');

      // Simulate email sending success
      return new Response(
        JSON.stringify({ 
          success: true, 
          channel: 'email',
          message: `Email sent to ${recipients.length} recipient(s)`,
          recipients: recipients.map(r => r.email)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (channel === 'teams') {
      // Microsoft Teams webhook integration
      // In production, you would call the Teams webhook URL
      const teamsMessage = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": type === 'escalation' ? "FF0000" : "0076D7",
        "summary": subject,
        "sections": [{
          "activityTitle": subject,
          "facts": [
            { "name": "Issue", "value": issue.key },
            { "name": "Summary", "value": issue.summary },
            { "name": "Status", "value": issue.status },
            { "name": "Priority", "value": issue.priority || 'Not set' },
            { "name": "Assignee", "value": issue.assignee || 'Unassigned' },
            { "name": "Reason", "value": reason }
          ],
          "markdown": true
        }],
        "potentialAction": [{
          "@type": "OpenUri",
          "name": "View in Jira",
          "targets": [{
            "os": "default",
            "uri": `https://jira.atlassian.com/browse/${issue.key}`
          }]
        }]
      };

      console.log('=== TEAMS NOTIFICATION ===');
      console.log('Recipients:', recipients.map(r => r.name).join(', '));
      console.log('Message:', JSON.stringify(teamsMessage, null, 2));
      console.log('==========================');

      // Simulate Teams notification success
      return new Response(
        JSON.stringify({ 
          success: true, 
          channel: 'teams',
          message: `Teams notification sent to ${recipients.length} recipient(s)`,
          recipients: recipients.map(r => r.name)
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid channel specified' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in send-notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
