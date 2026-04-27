require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`⚡ [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
  });

// Schema & Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

// --- Routes ---

// Health Check / Root
app.get('/', (req, res) => {
  res.send('🚀 Backend is running!');
});

const itemRouter = express.Router();

// Get all items
itemRouter.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create item
itemRouter.post('/', async (req, res) => {
  console.log('📥 POST request received at /items');
  console.log('Body:', req.body);
  try {
    const savedItem = await Item.create(req.body);
    console.log('💾 Data saved to Database!');
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('❌ Database Save Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update item
itemRouter.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete item
itemRouter.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply the router to both paths
app.use('/api/items', itemRouter);
app.use('/items', itemRouter);

// 404 Handler
app.use((req, res) => {
  console.log(`🚫 404 Route Not Found: ${req.url}`);
  res.status(404).json({ message: "Backend Error: Endpoint not found" });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BACKEND ACTIVE: http://localhost:${PORT}`);
});
