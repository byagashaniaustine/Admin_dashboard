import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { createClient } from "npm:@supabase/supabase-js";

// Load environment variables
import "https://deno.land/std@0.224.0/dotenv/load.ts";

const getContent = new Hono();

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or SERVICE ROLE KEY missing in environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// GET registrations
getContent.get("/", async (c) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

export default getContent;
