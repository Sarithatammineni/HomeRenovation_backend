// backend/routes/tasks.js
const express = require('express');
const router  = express.Router();
const db      = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/tasks — with optional filters
router.get('/', requireAuth, async (req, res) => {
  let query = db
    .from('tasks')
    .select('*, projects(name, color)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (req.query.project_id) query = query.eq('project_id', req.query.project_id);
  if (req.query.priority)   query = query.eq('priority', req.query.priority);
  if (req.query.status)     query = query.eq('status', req.query.status);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/tasks
router.post('/', requireAuth, async (req, res) => {
  const { name, project_id, priority, status, assignee, due_date, description } = req.body;
  if (!name || !project_id) return res.status(400).json({ error: 'name and project_id are required' });
  const { data, error } = await db
    .from('tasks')
    .insert({
      name, project_id,
      priority: priority || 'medium',
      status: status || 'todo',
      assignee, due_date, description,
      user_id: req.user.id,
    })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PATCH /api/tasks/:id
router.patch('/:id', requireAuth, async (req, res) => {
  const { data, error } = await db
    .from('tasks')
    .update(req.body)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/tasks/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await db
    .from('tasks')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Task deleted' });
});

module.exports = router;
