import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Allotment = () => {
  const { user } = useAuth();
  const [currentRoom, setCurrentRoom] = useState(user?.roomNumber || '');
  const [requestedRoom, setRequestedRoom] = useState('');
  const [reason, setReason] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [previousRequests, setPreviousRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/student/allotments/my');
      setPreviousRequests(data);
    } catch (err) {
      console.error('Error fetching allotment history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/student/allotments', {
        currentRoom: currentRoom || 'N/A',
        requestedRoom,
        reason
      });
      setStatusMsg('Request submitted to warden');
      setRequestedRoom('');
      setReason('');
      fetchHistory();
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      console.log("Full Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit allotment request");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2">
            <i className="fas fa-bed text-indigo-500"></i> Request Hostel Change
          </h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium">Current Room</label>
              <input
                type="text"
                value={currentRoom}
                onChange={(e) => setCurrentRoom(e.target.value)}
                placeholder="e.g., B-206"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Requested Hostel / Room</label>
              <input
                type="text"
                value={requestedRoom}
                onChange={(e) => setRequestedRoom(e.target.value)}
                required
                placeholder="e.g., C-Block, Room 304"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Reason for change</label>
              <textarea
                rows="2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Mention valid reason..."
              ></textarea>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
              <i className="fas fa-paper-plane"></i> Submit Request
            </button>
          </form>
          {statusMsg && <div className="mt-3 text-sm text-green-600 font-medium">{statusMsg}</div>}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Previous Requests</h3>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading history...</p>
            ) : previousRequests.length > 0 ? (
              previousRequests.map((r) => (
                <div key={r._id} className="border-b pb-3 flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{r.currentRoom} → {r.requestedRoom}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleDateString()} | {r.reason}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${r.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      r.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {r.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No previous requests found.</p>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Student Portal</footer>
    </div>
  );
};

export default Allotment;
