import './App.css';
import { useEffect, useState } from 'react';
import { getItems } from './api';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';

function App() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container">
      <h1>📦 Inventory Manager</h1>
      <div className="main-layout">
        <div className="form-section">
          <ItemForm onItemAdded={fetchItems} />
        </div>
        <div className="inventory-section">
          <ItemList items={items} onRefresh={fetchItems} />
        </div>
      </div>
    </div>
  );
}

export default App;