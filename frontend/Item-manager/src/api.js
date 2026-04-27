import axios from 'axios';

const API = axios.create({
  // Use 127.0.0.1 and port 5050 to ensure we hit the backend directly
  baseURL: 'http://127.0.0.1:5050/api',
});

export const getItems = () => API.get('/items');
export const createItem = (data) => API.post('/items', data);
export const deleteItem = (id) => API.delete(`/items/${id}`);
export const updateItem = (id, data) => API.put(`/items/${id}`, data);
