import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GITHUB_TOKEN = Deno.env.get('GITHUB_ACCESS_TOKEN');
const OWNER = Deno.env.get('GITHUB_OWNER') || 'YOUR_GITHUB_USERNAME';
const REPO = Deno.env.get('GITHUB_REPO') || 'YOUR_REPO_NAME';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    if (!GITHUB_TOKEN) {
      throw new Error('GITHUB_ACCESS_TOKEN not configured');
    }

    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/monitor.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'Velocity-Scraper-Trigger',
        },
        body: JSON.stringify({ ref: 'main' }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API Error:', errorText);
      throw new Error(`GitHub API Error: ${response.status} - ${errorText}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Scraper triggered successfully! The workflow will begin shortly.',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error triggering scraper:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
