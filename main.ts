import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { serveStatic, cors } from "https://deno.land/x/hono@v4.3.11/middleware.ts";

import getContent from './api/getContent.ts'
import editUser from './api/editUser.ts';
import deleteUser from   './api/deleteUser.ts '
const app = new Hono();

// Enable CORS globally
app.use('*', cors({
  origin: '*',
}));

app.route('/api/getContent', getContent);
app.route('/api/editUser', editUser);
app.route('/api/deleteUser', deleteUser);
// Serve static files
app.use('/*', serveStatic({
  root: './Frontend/dist',
  // Optional: you can set `index: 'index.html'` to automatically serve index.html
}));

app.get('/*', async (c) => {
  const filePath = new URL('./Frontend/dist/index.html', import.meta.url).pathname;
  const data = await Deno.readFile(filePath);
  return c.body(data.buffer, 200, {
    'content-type': 'text/html'
  });
});


// Start server
Deno.serve({ port: 8000 }, app.fetch);

console.log('Server is running on http://localhost:8000');
