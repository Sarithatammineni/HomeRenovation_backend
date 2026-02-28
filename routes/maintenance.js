// backend/routes/maintenance.js
const express = require('express');
const router  = express.Router();
const db      = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');

router.get('/',       requireAuth, async (req, res) => { const { data, error } = await db.from('maintenance').select('*').eq('user_id', req.user.id).order('next_date', { ascending: true, nullsFirst: false }); if (error) return res.status(400).json({ error: error.message }); res.json(data); });
router.post('/',      requireAuth, async (req, res) => { const { data, error } = await db.from('maintenance').insert({ ...req.body, user_id: req.user.id }).select().single(); if (error) return res.status(400).json({ error: error.message }); res.status(201).json(data); });
router.patch('/:id',  requireAuth, async (req, res) => { const { data, error } = await db.from('maintenance').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select().single(); if (error) return res.status(400).json({ error: error.message }); res.json(data); });
router.delete('/:id', requireAuth, async (req, res) => { const { error } = await db.from('maintenance').delete().eq('id', req.params.id).eq('user_id', req.user.id); if (error) return res.status(400).json({ error: error.message }); res.json({ message: 'Deleted' }); });
module.exports = router;
