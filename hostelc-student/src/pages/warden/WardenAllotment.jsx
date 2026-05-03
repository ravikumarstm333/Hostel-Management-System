import { useEffect, useState } from 'react';
import WardenNavbar from '../../components/WardenNavbar';
import API from '../../api';

const WardenAllotment = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/warden/allotments');
      setRequests(data);
    } catch (err) {
      console.error('Error fetching allotments:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/warden/allotments/${id}/status`, {
        status
      });

      fetchRequests();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">
            Room Allotment Requests
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500">No requests found</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="border p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {r.currentRoom || 'N/A'} → {r.requestedRoom}
                    </p>
                    <p className="text-sm text-gray-500">
                      {r.reason}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      r.status === 'APPROVED'
                        ? 'bg-green-100 text-green-700'
                        : r.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {r.status}
                    </span>

                    {r.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateStatus(r._id, 'APPROVED')}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateStatus(r._id, 'REJECTED')}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WardenAllotment;