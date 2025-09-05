import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { createClient } from "npm:@supabase/supabase-js";

const editUser = new Hono();

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

editUser.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const { data, error } = await supabase.from("users").update(body).eq("id", id);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ message: "User updated successfully", data });
});

export default editUser;
