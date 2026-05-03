import { useEffect, useState } from 'react';
import MessNavbar from '../../components/MessNavbar';
import API from '../../api';

const MessDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchAllOrders = async () => {
    try {
      const res = await API.get('/mess/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/mess/orders/${id}/status`, { status });
      fetchAllOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <MessNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-light text-gray-800">
            Mess Incharge Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Manage student food orders
          </p>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          {loading ? (
            <p className="text-center py-6">Loading...</p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm text-left">

                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Food</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">

                      <td className="p-3">
                        <p className="font-medium">
                          {order.studentName || 'Student'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.student_id}
                        </p>
                      </td>

                      <td className="p-3">
                        {order.hostelName} - Room {order.roomNumber}
                      </td>

                      <td className="p-3">
                        {order.foodItems} (x{order.quantity})
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                          {order.status}
                        </span>
                      </td>

                      <td className="p-3 flex gap-2 justify-center">

                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateStatus(order._id, 'ACCEPTED')}
                              className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                              Accept
                            </button>

                            <button
                              onClick={() => updateStatus(order._id, 'REJECTED')}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.status === 'ACCEPTED' && (
                          <button
                            onClick={() => updateStatus(order._id, 'PREPARING')}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Prepare
                          </button>
                        )}

                        {order.status === 'PREPARING' && (
                          <button
                            onClick={() => updateStatus(order._id, 'DELIVERED')}
                            className="bg-purple-500 text-white px-2 py-1 rounded"
                          >
                            Deliver
                          </button>
                        )}

                        {order.status === 'DELIVERED' && (
                          <span className="text-green-600 font-semibold">
                            Completed
                          </span>
                        )}

                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>

              {orders.length === 0 && (
                <p className="text-center text-gray-400 mt-4">
                  No orders found
                </p>
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
};

export default MessDashboard;