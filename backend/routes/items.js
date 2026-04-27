const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// IMPORTANT: This router is mounted at '/api' in server.js
// So these paths must start with '/items'

// GET all items -> GET /api/items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create item -> POST /api/items
router.post('/items', async (req, res) => {
  try {
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    });
    const newItem = await item.save();
    console.log('✅ Data saved to DB:', newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('❌ DB Save Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// DELETE item -> DELETE /api/items/:id
router.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update item -> PUT /api/items/:id
router.put('/items/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;