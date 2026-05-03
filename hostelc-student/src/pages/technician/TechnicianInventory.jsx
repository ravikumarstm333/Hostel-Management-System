import { useEffect, useState } from 'react';
import TechnicianNavbar from '../../components/TechnicianNavbar';

const TechnicianInventory = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0 });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const data = JSON.parse(localStorage.getItem('technician_inventory') || '[]');
    setItems(data);
  };

  const saveInventory = (newItems) => {
    localStorage.setItem('technician_inventory', JSON.stringify(newItems));
    setItems(newItems);
  };

  const addItem = () => {
    if (!newItem.name || newItem.quantity < 0) return;
    const newId = Math.max(...items.map((i) => i.id), 0) + 1;
    const updated = [...items, { id: newId, name: newItem.name, quantity: newItem.quantity }];
    saveInventory(updated);
    setNewItem({ name: '', quantity: 0 });
  };

  const updateQuantity = (id, delta) => {
    const updated = items.map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i));
    saveInventory(updated);
  };

  const deleteItem = (id) => {
    const updated = items.filter((i) => i.id !== id);
    saveInventory(updated);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TechnicianNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2 mb-4"><i className="fas fa-boxes text-indigo-500"></i> Inventory Stock</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Add New Item</h3>
              <input type="text" placeholder="Item name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 mb-2" />
              <input type="number" placeholder="Quantity" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) || 0 })} className="w-full border rounded-lg px-3 py-2 mb-2" />
              <button onClick={addItem} className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full">Add Item</button>
            </div>
            <div className="md:col-span-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th><th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th></tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => updateQuantity(item.id, 1)} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs mr-1">+1</button>
                          <button onClick={() => updateQuantity(item.id, -1)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs mr-1">-1</button>
                          <button onClick={() => deleteItem(item.id)} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Technician Portal</footer>
    </div>
  );
};

export default TechnicianInventory;
