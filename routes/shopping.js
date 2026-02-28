// backend/routes/shopping.js
const express = require('express');
const router  = express.Router();
const db      = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  let q = db.from('shopping_items').select('*, projects(name)').eq('user_id', req.user.id).order('created_at', { ascending: false });
  if (req.query.project_id) q = q.eq('project_id', req.query.project_id);
  const { data, error } = await q;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
router.post('/', requireAuth, async (req, res) => {
  const { data, error } = await db.from('shopping_items').insert({ ...req.body, user_id: req.user.id }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});
router.patch('/:id', requireAuth, async (req, res) => {
  const { data, error } = await db.from('shopping_items').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await db.from('shopping_items').delete().eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});
module.exports = router;
