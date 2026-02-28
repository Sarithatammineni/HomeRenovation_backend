// backend/routes/expenses.js
const express = require('express');
const router  = express.Router();
const db      = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

// GET /api/expenses
router.get('/', requireAuth, async (req, res) => {
  let q = db
    .from('expenses')
    .select('*, projects(name, color)')
    .eq('user_id', req.user.id)
    .order('expense_date', { ascending: false });
  if (req.query.project_id) q = q.eq('project_id', req.query.project_id);
  const { data, error } = await q;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/expenses/summary — totals by category
router.get('/summary', requireAuth, async (req, res) => {
  const { data, error } = await db
    .from('expenses')
    .select('category, amount, project_id, projects(name)')
    .eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });

  const byCategory = data.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});
  const byProject = data.reduce((acc, e) => {
    const name = e.projects?.name || 'Unknown';
    acc[name] = (acc[name] || 0) + Number(e.amount);
    return acc;
  }, {});
  const total = data.reduce((s, e) => s + Number(e.amount), 0);

  res.json({ byCategory, byProject, total });
});

// POST /api/expenses
router.post('/', requireAuth, async (req, res) => {
  const { description, project_id, category, amount, expense_date } = req.body;
  if (!description || !project_id || !amount)
    return res.status(400).json({ error: 'description, project_id and amount are required' });
  const { data, error } = await db
    .from('expenses')
    .insert({
      description, project_id,
      category: category || 'Materials',
      amount, expense_date: expense_date || new Date().toISOString().split('T')[0],
      user_id: req.user.id,
    })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/expenses/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await db
    .from('expenses')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Expense deleted' });
});

module.exports = router;
