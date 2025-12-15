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

    console.log(`Processing action: ${action}, projectKey: ${projectKey}`);

    if (action === 'getProjects') {
      console.log('Fetching projects from:', `${JIRA_BASE_URL}/rest/api/3/project`);
      console.log('Using email:', JIRA_EMAIL);
      
      const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/project`, { headers });
      const responseText = await response.text();
      
      console.log('Jira API response status:', response.status);
      console.log('Jira API response body:', responseText.substring(0, 500));
      
      if (!response.ok) {
        console.error('Jira getProjects error:', response.status, responseText);
        throw new Error(`Jira API error: ${response.status} - ${responseText}`);
      }
      
      const projects = JSON.parse(responseText);
      console.log('Found projects count:', Array.isArray(projects) ? projects.length : 'not an array');
      
      return new Response(JSON.stringify({ projects }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'getProjectIssues' && projectKey) {
      // Use the new /rest/api/3/search/jql endpoint (POST method)
      const searchUrl = `${JIRA_BASE_URL}/rest/api/3/search/jql`;
      const searchBody = {
        jql: `project = "${projectKey}" ORDER BY created DESC`,
        maxResults: 100,
        fields: [
          "summary",
          "status",
          "priority",
          "issuetype",
          "assignee",
          "duedate",
          "created",
          "updated",
          "customfield_10016",
          "parent",
          "labels"
        ]
      };

      console.log('Search URL:', searchUrl);
      console.log('Search body:', JSON.stringify(searchBody));

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(searchBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Jira search/jql error:', response.status, errorText);
        throw new Error(`Jira API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Found ${data.issues?.length || 0} issues`);
      
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
