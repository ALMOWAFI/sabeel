import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

// Edge Function: healthcheck
type HealthRow = { status: string };

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Respond with the current health status from the database
Deno.serve(async () => {
  const { data, error } = await supabase
    .from<HealthRow>("health_check")
    .select("status")
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ status: "error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ status: data?.status || "unknown" }), {
    headers: { "Content-Type": "application/json" },
  });
});
