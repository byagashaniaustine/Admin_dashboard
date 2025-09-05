import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { createClient } from "npm:@supabase/supabase-js";

const deleteUser = new Hono();

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

deleteUser.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ message: "User deleted successfully" });
});

export default deleteUser;
