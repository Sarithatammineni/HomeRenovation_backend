// backend/routes/projects.js
const express = require('express');
const router  = express.Router();
const db      = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/projects — list all projects for logged-in user
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await db
    .from('projects')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/projects/:id — single project with all related data
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await db
    .from('projects')
    .select('*, tasks(*), expenses(*), shopping_items(*), permits(*), photos(*)')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();
  if (error) return res.status(404).json({ error: 'Project not found' });
  res.json(data);
});

// POST /api/projects — create new project
router.post('/', requireAuth, async (req, res) => {
  const { name, description, budget, deadline, status, color, progress } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Project name is required' });
  const { data, error } = await db
    .from('projects')
    .insert({
      name, description, budget: budget || 0,
      deadline, status: status || 'planning',
      color: color || '#c17b3a',
      progress: progress || 0,
      user_id: req.user.id,
    })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PATCH /api/projects/:id — update project
router.patch('/:id', requireAuth, async (req, res) => {
  const { data, error } = await db
    .from('projects')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/projects/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await db
    .from('projects')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Project deleted' });
});

module.exports = router;
