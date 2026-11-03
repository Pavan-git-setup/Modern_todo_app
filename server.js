import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'todos.json');

// Middleware
app.use(cors());
app.use(express.json());
// Serve static assets from public folder or project root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Seed initial tasks
const initialTodos = [
  {
    id: '1',
    text: 'Welcome to your modernized Node.js To-Do app! 🚀',
    completed: false,
    priority: 'high',
    category: 'Work',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    text: 'Try filtering tasks by status or priority',
    completed: false,
    priority: 'medium',
    category: 'Personal',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    text: 'Mark this task as completed by clicking the checkbox',
    completed: true,
    priority: 'low',
    category: 'General',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// Helper: Ensure data file exists
async function initDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(initialTodos, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to initialize data directory:', err);
  }
}

// Helper: Read todos
async function readTodos() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading todos file:', err);
    return [];
  }
}

// Helper: Write todos
async function writeTodos(todos) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing todos file:', err);
    throw err;
  }
}

// --- REST API Endpoints ---

// GET /api/todos - Retrieve all todos
app.get('/api/todos', async (req, res) => {
  const todos = await readTodos();
  res.json(todos);
});

// POST /api/todos - Create a new todo
app.post('/api/todos', async (req, res) => {
  const { text, priority = 'medium', category = 'General' } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  const newTodo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
    category: category.trim() || 'General',
    createdAt: new Date().toISOString()
  };

  const todos = await readTodos();
  todos.unshift(newTodo);
  await writeTodos(todos);

  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  let todos = await readTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  todos[index] = {
    ...todos[index],
    ...updates,
    id // prevent changing the id
  };

  await writeTodos(todos);
  res.json(todos[index]);
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  let todos = await readTodos();
  const filtered = todos.filter(t => t.id !== id);

  if (filtered.length === todos.length) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await writeTodos(filtered);
  res.json({ message: 'Task deleted successfully', id });
});

// POST /api/todos/clear-completed - Clear completed todos
app.post('/api/todos/clear-completed', async (req, res) => {
  let todos = await readTodos();
  const remaining = todos.filter(t => !t.completed);
  await writeTodos(remaining);
  res.json({ message: 'Cleared completed tasks', remaining });
});

// Fallback route for SPA - checks public/index.html first, then root index.html
app.get('*', async (req, res) => {
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  const rootIndex = path.join(__dirname, 'index.html');

  try {
    await fs.access(publicIndex);
    return res.sendFile(publicIndex);
  } catch {
    try {
      await fs.access(rootIndex);
      return res.sendFile(rootIndex);
    } catch {
      const files = await fs.readdir(__dirname).catch(() => []);
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>App Starting Up</title></head>
        <body style="font-family: system-ui, sans-serif; padding: 40px; text-align: center; line-height: 1.6;">
          <h2>Node.js API Server is Live! 🚀</h2>
          <p>The backend is active, but <code>index.html</code> was not found in <code>public/</code> or root.</p>
          <p>Files in current directory: <code>${files.join(', ')}</code></p>
        </body>
        </html>
      `);
    }
  }
});

// Start Server
await initDataFile();
app.listen(PORT, () => {
  console.log(`✨ Server running at http://localhost:${PORT}`);
});
