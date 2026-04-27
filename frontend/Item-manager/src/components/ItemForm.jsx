import { useState } from 'react';
import { createItem } from '../api';

export default function ItemForm({ onItemAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem({
        name,
        description,
        price: Number(price)
      });
      setName('');
      setDescription('');
      setPrice('');
      onItemAdded();
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="form-card">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Item Name</label>
          <input
            placeholder="Enter item name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Description</label>
          <textarea
            placeholder="Enter item description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows="3"
          />
        </div>
        <div className="input-group">
          <label>Price ($)</label>
          <input
            placeholder="0.00"
            type="number"
            step="0.01"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Add Item to Inventory</button>
      </form>
    </div>
  );
}