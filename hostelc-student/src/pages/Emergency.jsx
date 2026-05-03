import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const Emergency = () => {
  const [type, setType] = useState('');
  const [desc, setDesc] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/emergencies/my');
      setHistory(data);
    } catch (err) {
      console.error('Error fetching emergency history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/emergencies', { type, description: desc });
      setType('');
      setDesc('');
      fetchHistory();
      alert('Emergency request sent to warden');
    } catch (err) {
      alert('Failed to send emergency request');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2">
            <i className="fas fa-ambulance text-red-500"></i> Emergency / Medicine Request
          </h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium">Type (Medicine / Urgent Help)</label>
              <input 
                type="text" 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                required 
                placeholder="e.g., Paracetamol, Locked out of room"
                className="w-full border rounded-lg px-4 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description / Details</label>
              <textarea 
                rows="2" 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)} 
                required 
                placeholder="Provide more information..."
                className="w-full border rounded-lg px-4 py-2"
              ></textarea>
            </div>
            <button type="submit" className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
              <i className="fas fa-paper-plane"></i> Send Request
            </button>
          </form>

          <div className="mt-8">
            <h3 className="font-medium text-gray-800 border-b pb-2">Recent Requests</h3>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : history.length > 0 ? (
                history.map((h) => (
                  <div key={h._id} className="border-b pb-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-800">{h.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${
                        h.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {h.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{h.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(h.createdAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No recent emergency requests found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Student Portal</footer>
    </div>
  );
};

export default Emergency;
