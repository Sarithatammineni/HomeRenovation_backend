// backend/routes/permits.js
const express = require('express');
const router  = express.Router();
const db      = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  let q = db.from('permits').select('*, projects(name)').eq('user_id', req.user.id).order('created_at', { ascending: false });
  if (req.query.project_id) q = q.eq('project_id', req.query.project_id);
  const { data, error } = await q;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
router.post('/', requireAuth, async (req, res) => {
  const { name, project_id, issuer, status, expiry_date, notes } = req.body;
  if (!name || !project_id) return res.status(400).json({ error: 'name and project_id required' });
  const { data, error } = await db.from('permits').insert({ name, project_id, issuer, status: status || 'required', expiry_date, notes, user_id: req.user.id }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});
router.patch('/:id', requireAuth, async (req, res) => {
  const { data, error } = await db.from('permits').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await db.from('permits').delete().eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});
module.exports = router;
