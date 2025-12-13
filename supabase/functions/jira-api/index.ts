import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, projectKey } = await req.json();
    
    const JIRA_BASE_URL = Deno.env.get('JIRA_BASE_URL');
    const JIRA_EMAIL = Deno.env.get('JIRA_EMAIL');
    const JIRA_API_TOKEN = Deno.env.get('JIRA_API_TOKEN');

    if (!JIRA_BASE_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
      throw new Error('Jira credentials not configured');
    }

    const auth = btoa(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`);
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (action === 'getProjects') {
      const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/project`, { headers });
      if (!response.ok) throw new Error(`Jira API error: ${response.status}`);
      const projects = await response.json();
      return new Response(JSON.stringify({ projects }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'getProjectIssues' && projectKey) {
      const jql = encodeURIComponent(`project = ${projectKey} ORDER BY created DESC`);
      const response = await fetch(
        `${JIRA_BASE_URL}/rest/api/3/search?jql=${jql}&maxResults=100&fields=summary,status,priority,issuetype,assignee,duedate,created,updated,customfield_10016,parent,labels`,
        { headers }
      );
      if (!response.ok) throw new Error(`Jira API error: ${response.status}`);
      const data = await response.json();
      return new Response(JSON.stringify({ issues: data.issues || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Jira API error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
