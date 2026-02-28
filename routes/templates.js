// backend/routes/templates.js
const express = require('express');
const router  = express.Router();
const db      = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// GET all public templates
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await db.from('templates').select('*').eq('is_public', true).order('name');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// POST /api/templates/apply — create project + tasks from template
router.post('/apply', requireAuth, async (req, res) => {
  const { template_id, project_name, start_date } = req.body;
  if (!template_id) return res.status(400).json({ error: 'template_id required' });

  const { data: tmpl, error: tErr } = await db.from('templates').select('*').eq('id', template_id).single();
  if (tErr) return res.status(404).json({ error: 'Template not found' });

  const { data: project, error: pErr } = await db
    .from('projects')
    .insert({ name: project_name || tmpl.name, description: tmpl.description, user_id: req.user.id, status: 'planning' })
    .select().single();
  if (pErr) return res.status(400).json({ error: pErr.message });

  const base  = new Date(start_date || Date.now());
  const tasks = (tmpl.tasks || []).map(t => {
    const due = new Date(base);
    due.setDate(due.getDate() + (t.days_offset || 0));
    return { name: t.name, priority: t.priority || 'medium', project_id: project.id, user_id: req.user.id, due_date: due.toISOString().split('T')[0] };
  });
  if (tasks.length) await db.from('tasks').insert(tasks);

  res.status(201).json({ project, tasksCreated: tasks.length });
});

module.exports = router;
