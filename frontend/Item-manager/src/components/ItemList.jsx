import { deleteItem } from '../api';

export default function ItemList({ items, onRefresh }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#636e72', marginTop: '20px' }}>
        <p>No items found. Add some to your inventory!</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      <h2>Inventory ({items.length})</h2>
      {items.map(item => (
        <div key={item._id} className="item-card">
          <div className="item-info">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="item-price">${item.price.toFixed(2)}</div>
          </div>
          <button
            onClick={() => handleDelete(item._id)}
            className="btn-delete"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}