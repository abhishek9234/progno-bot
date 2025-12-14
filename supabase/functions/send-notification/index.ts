import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${type === 'escalation' ? '#dc2626' : '#2563eb'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .issue-card { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${type === 'escalation' ? '#dc2626' : '#2563eb'}; }
          .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; }
          .value { color: #111827; margin-bottom: 10px; }
          .reason { background: ${type === 'escalation' ? '#fef2f2' : '#eff6ff'}; padding: 10px; border-radius: 4px; margin: 10px 0; }
          .on-hold { background: #fef3c7; padding: 10px; border-radius: 4px; margin: 10px 0; color: #92400e; }
          .footer { background: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; color: #6b7280; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .badge-priority { background: #fee2e2; color: #991b1b; }
          .badge-status { background: #dbeafe; color: #1e40af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">${type === 'escalation' ? '⚠️ ESCALATION NOTICE' : '📋 Follow-up Required'}</h2>
          </div>
          <div class="content">
            <div class="issue-card">
              <div class="label">Issue</div>
              <div class="value" style="font-size: 18px; font-weight: bold;">${issue.key}</div>
              
              <div class="label">Summary</div>
              <div class="value">${issue.summary}</div>
              
              <div style="display: flex; gap: 10px; margin-top: 10px;">
                <span class="badge badge-status">${issue.status}</span>
                <span class="badge badge-priority">${issue.priority || 'Not set'}</span>
              </div>
              
              <div style="margin-top: 15px;">
                <div class="label">Assignee</div>
                <div class="value">${issue.assignee || 'Unassigned'}</div>
              </div>
            </div>
            
            <div class="reason">
              <div class="label">Reason</div>
              <div class="value">${reason}</div>
            </div>
            
            ${isOnHold ? '<div class="on-hold">⏸️ This item is currently <strong>ON HOLD</strong> and requires immediate attention.</div>' : ''}
            
            ${message ? `<div style="margin-top: 15px;"><div class="label">Additional Notes</div><div class="value">${message}</div></div>` : ''}
          </div>
          <div class="footer">
            <p>This notification was sent via PM Assistant.</p>
            <p>Please take appropriate action as soon as possible.</p>
          </div>
        </div>
      </body>
      </html>
    `.trim();

    if (channel === 'email') {
      console.log('Sending email to:', recipients.map(r => r.email).join(', '));
      
      const emailResponse = await resend.emails.send({
        from: "PM Assistant <onboarding@resend.dev>",
        to: recipients.map(r => r.email),
        subject: subject,
        html: htmlContent,
      });

      console.log("Email sent successfully:", emailResponse);

      if (emailResponse.error) {
        throw new Error(emailResponse.error.message);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          channel: 'email',
          message: `Email sent to ${recipients.length} recipient(s)`,
          recipients: recipients.map(r => r.email),
          id: emailResponse.data?.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (channel === 'teams') {
      // Microsoft Teams webhook integration
      // Note: In production, you would need to configure a Teams webhook URL
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

      // For Teams, we currently simulate success
      // To enable real Teams notifications, configure TEAMS_WEBHOOK_URL secret
      return new Response(
        JSON.stringify({ 
          success: true, 
          channel: 'teams',
          message: `Teams notification prepared for ${recipients.length} recipient(s). Configure webhook for delivery.`,
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
