require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`⚡ [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error Code:', err.code);
    console.error('Message:', err.message);
  });

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const savedItem = await Item.create(req.body);
    console.log('💾 Data saved to Database!');
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('❌ Database Save Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res) => {
  console.log(`🚫 404 Route Not Found: ${req.url}`);
  res.status(404).json({ message: "Backend Error: Endpoint not found" });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BACKEND ACTIVE: http://localhost:${PORT}`);
});