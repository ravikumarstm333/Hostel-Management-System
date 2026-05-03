import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const FoodOrder = () => {
  const [formData, setFormData] = useState({ hostelName: '', roomNumber: '', foodItems: '', quantity: 1 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchMyOrders(); }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await API.get('/mess/orders/my');
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/mess/orders', formData);
      alert('✅ Order placed successfully!');
      setFormData({ hostelName: '', roomNumber: '', foodItems: '', quantity: 1 });
      fetchMyOrders();
    } catch (err) {
      alert('❌ Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mess Management - Place Order</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            className="border p-2 rounded" placeholder="Hostel Name" required
            value={formData.hostelName} onChange={e => setFormData({...formData, hostelName: e.target.value})}
          />
          <input 
            className="border p-2 rounded" placeholder="Room Number" required
            value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})}
          />
          <textarea 
            className="border p-2 rounded md:col-span-2" placeholder="Food Items (e.g. Masala Dosa, Coffee)" required
            value={formData.foodItems} onChange={e => setFormData({...formData, foodItems: e.target.value})}
          />
          <input 
            type="number" className="border p-2 rounded" placeholder="Quantity" 
            value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}
          />
          <button 
            disabled={loading} type="submit" 
            className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
          >
            {loading ? 'Placing Order...' : 'Order Now'}
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">My Recent Orders</h2>
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order._id} className="border p-4 rounded-lg bg-gray-50 flex justify-between items-center">
            <div>
              <p className="font-bold">{order.foodItems} (x{order.quantity})</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {order.status}
            </span>
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-400">No orders placed yet.</p>}
      </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Student Portal</footer>
    </div>
  );
};

export default FoodOrder;