import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const menuItems = [
  { id: 1, name: 'Aloo Paratha', price: 40 },
  { id: 2, name: 'Paneer Paratha', price: 60 },
  { id: 3, name: 'Maggi', price: 30 },
  { id: 4, name: 'Veg Sandwich', price: 45 },
  { id: 5, name: 'Masala Omelette', price: 35 },
  { id: 6, name: 'Cold Coffee', price: 50 },
  { id: 7, name: 'Cheese Paratha', price: 70 },
  { id: 8, name: 'Bread Pakora', price: 25 }
];

const NightMess = () => {

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [formData, setFormData] = useState({
    hostelName: '',
    roomNumber: ''
  });

  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');

  // ================= LOAD =================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('hostel_cart') || '[]');
    setCart(saved);
    fetchMyOrders();
  }, []);

  const saveCart = (newCart) => {
    localStorage.setItem('hostel_cart', JSON.stringify(newCart));
    setCart(newCart);

    // 🔥 AUTO SHOW FORM WHEN ITEM ADDED
    if (newCart.length > 0) {
      setShowOrderForm(true);
    }
  };

  // ================= ADD TO CART =================
  const addToCart = (item) => {
    const exists = cart.find(i => i.id === item.id);

    let updated;

    if (exists) {
      updated = cart.map(i =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...cart, { ...item, qty: 1 }];
    }

    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter(i => i.id !== id);
    saveCart(updated);

    if (updated.length === 0) {
      setShowOrderForm(false); // hide form if empty cart
    }
  };

  // ================= ORDER =================
  const placeOrder = async () => {

    if (!formData.hostelName || !formData.roomNumber) {
      return alert('Enter Hostel Name & Room Number');
    }

    try {
      const foodItems = cart
        .map(i => `${i.name} x${i.qty}`)
        .join(', ');

      await API.post('/mess/orders', {
        hostelName: formData.hostelName,
        roomNumber: formData.roomNumber,
        foodItems,
        quantity: cart.reduce((s, i) => s + i.qty, 0)
      });

      setCart([]);
      localStorage.removeItem('hostel_cart');

      setFormData({ hostelName: '', roomNumber: '' });
      setShowOrderForm(false);

      setMsg('✅ Order placed successfully!');
      fetchMyOrders();

      setTimeout(() => setMsg(''), 3000);

    } catch (err) {
      alert('❌ Order failed');
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await API.get('/mess/orders/my');
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">🌙 Night Mess</h2>

          <button
            onClick={() => setCartOpen(true)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Cart ({count})
          </button>
        </div>

        {/* MENU */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded shadow">
              <h3>{item.name}</h3>
              <p className="text-indigo-600">₹{item.price}</p>

              <button
                onClick={() => addToCart(item)}
                className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>

        {/* 🔥 AUTO FORM SHOW */}
        {showOrderForm && (
          <div className="mt-8 bg-white p-4 rounded shadow">

            <h3 className="font-bold mb-3">
              📦 Complete Your Order
            </h3>

            <div className="grid md:grid-cols-2 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Hostel Name"
                value={formData.hostelName}
                onChange={(e) =>
                  setFormData({ ...formData, hostelName: e.target.value })
                }
              />

              <input
                className="border p-2 rounded"
                placeholder="Room Number"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
              />
            </div>

            <button
              onClick={placeOrder}
              className="bg-green-600 text-white px-4 py-2 rounded mt-4"
            >
              Place Order (₹{total})
            </button>

          </div>
        )}

        {/* MESSAGE */}
        {msg && (
          <p className="text-green-600 mt-4">{msg}</p>
        )}

        {/* ORDERS */}
        <div className="mt-10">
          <h2 className="font-bold mb-2">My Orders</h2>

          {orders.map(o => (
            <div key={o._id} className="border p-3 mb-2 flex justify-between">
              <div>
                <p>{o.foodItems}</p>
                <small>{o.hostelName} - Room {o.roomNumber}</small>
              </div>

              <b>{o.status}</b>
            </div>
          ))}
        </div>

      </main>

      {/* CART */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-end">
          <div className="bg-white w-96 p-4">

            <h3 className="font-bold mb-3">Cart</h3>

            {cart.map(i => (
              <div key={i.id} className="flex justify-between mb-2">
                <span>{i.name} x{i.qty}</span>
                <span>₹{i.price * i.qty}</span>
                <button onClick={() => removeItem(i.id)}>❌</button>
              </div>
            ))}

            <p className="font-bold mt-3">Total: ₹{total}</p>

          </div>
        </div>
      )}

    </div>
  );
};

export default NightMess;