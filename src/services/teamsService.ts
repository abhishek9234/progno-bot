// Email Service using SendGrid (Azure-compatible)

// For Azure WebApp deployment, set SENDGRID_API_KEY in App Settings
 
interface EmailMessage {

  to: string[];

  subject: string;

  text: string;

  html?: string;

}
 
interface SendGridPayload {

  personalizations: { to: { email: string }[] }[];

  from: { email: string; name: string };

  subject: string;

  content: { type: string; value: string }[];

}
 
// Store configuration - in production, these would come from environment/settings

let emailConfig = {

  apiKey: "",

  fromEmail: "noreply@yourapp.com",

  fromName: "Project Manager Bot"

};
 
export const configureEmailService = (config: Partial<typeof emailConfig>) => {

  emailConfig = { ...emailConfig, ...config };

};
 
export const getEmailConfig = () => ({ ...emailConfig });
 
export const sendEmail = async (

  message: EmailMessage

): Promise<{ success: boolean; error?: string }> => {

  if (!emailConfig.apiKey) {

    console.warn("SendGrid API key not configured - simulating email send");

    // Simulate success for demo purposes when API key not set

    console.log("Email would be sent to:", message.to);

    console.log("Subject:", message.subject);

    console.log("Content:", message.text);

    return { success: true };

  }
 
  const payload: SendGridPayload = {

    personalizations: [

      {

        to: message.to.map(email => ({ email }))

      }

    ],

    from: {

      email: emailConfig.fromEmail,

      name: emailConfig.fromName

    },

    subject: message.subject,

    content: [

      { type: "text/plain", value: message.text },

      ...(message.html ? [{ type: "text/html", value: message.html }] : [])

    ]

  };
 
  try {

    console.log("Sending email via SendGrid:", message.to);

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {

      method: "POST",

      headers: {

        "Authorization": `Bearer ${emailConfig.apiKey}`,

        "Content-Type": "application/json",

      },

      body: JSON.stringify(payload),

    });
 
    if (!response.ok) {

      const errorText = await response.text();

      console.error("SendGrid error:", errorText);

      return { success: false, error: `SendGrid error: ${response.status}` };

    }
 
    console.log("Email sent successfully");

    return { success: true };

  } catch (error) {

    console.error("Failed to send email:", error);

    return { 

      success: false, 

      error: error instanceof Error ? error.message : "Unknown error" 

    };

  }

};
 
export const sendFollowUpEmail = async (

  recipientEmail: string,

  recipientName: string,

  itemTitle: string,

  message: string,

  priority: string

): Promise<{ success: boolean; error?: string }> => {

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<div style="background-color: #0076D7; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
<h1 style="margin: 0;">📋 Follow-up Required</h1>
</div>
<div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
<h2 style="color: #333; margin-top: 0;">${itemTitle}</h2>
<p><strong>Priority:</strong> <span style="color: ${priority === 'high' ? '#FF0000' : priority === 'medium' ? '#FFA500' : '#008000'}">${priority}</span></p>
<p><strong>Message:</strong></p>
<div style="background-color: white; padding: 15px; border-left: 4px solid #0076D7; margin: 10px 0;">

          ${message}
</div>
<p style="color: #666; font-size: 12px; margin-top: 20px;">

          This is an automated follow-up notification from Project Manager Bot.
</p>
</div>
</div>

  `;
 
  return sendEmail({

    to: [recipientEmail],

    subject: `[Follow-up] ${itemTitle}`,

    text: `Follow-up for ${recipientName}: ${itemTitle}\n\nPriority: ${priority}\n\nMessage: ${message}`,

    html

  });

};
 
export const sendEscalationEmail = async (

  recipients: { email: string; name: string; role: string }[],

  itemTitle: string,

  assignee: string,

  reason: string,

  isOnHold: boolean,

  onHoldBy?: string

): Promise<{ success: boolean; error?: string }> => {

  const recipientList = recipients.map(r => `${r.name} (${r.role})`).join(", ");

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<div style="background-color: #FF0000; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
<h1 style="margin: 0;">🚨 Escalation Alert</h1>
</div>
<div style="padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
<h2 style="color: #333; margin-top: 0;">${itemTitle}</h2>
<table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
<tr>
<td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Assignee:</strong></td>
<td style="padding: 8px; border-bottom: 1px solid #ddd;">${assignee}</td>
</tr>
<tr>
<td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Status:</strong></td>
<td style="padding: 8px; border-bottom: 1px solid #ddd;">${isOnHold ? '🔴 On Hold' : '🟢 Active'}</td>
</tr>

          ${isOnHold && onHoldBy ? `
<tr>
<td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>On Hold By:</strong></td>
<td style="padding: 8px; border-bottom: 1px solid #ddd;">${onHoldBy}</td>
</tr>

          ` : ''}
<tr>
<td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Recipients:</strong></td>
<td style="padding: 8px; border-bottom: 1px solid #ddd;">${recipientList}</td>
</tr>
</table>
<p><strong>Reason for Escalation:</strong></p>
<div style="background-color: white; padding: 15px; border-left: 4px solid #FF0000; margin: 10px 0;">

          ${reason}
</div>
<p style="color: #666; font-size: 12px; margin-top: 20px;">

          This is an automated escalation notification from Project Manager Bot.
</p>
</div>
</div>

  `;
 
  return sendEmail({

    to: recipients.map(r => r.email),

    subject: `[ESCALATION] ${itemTitle}`,

    text: `Escalation Alert: ${itemTitle}\n\nAssignee: ${assignee}\nStatus: ${isOnHold ? 'On Hold' : 'Active'}\n${isOnHold && onHoldBy ? `On Hold By: ${onHoldBy}\n` : ''}\nReason: ${reason}`,

    html

  });

};

 