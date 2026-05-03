import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await API.get('/notices');
      setNotices(data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Alert': return 'border-red-400';
      case 'Important': return 'border-amber-400';
      case 'Event': return 'border-green-400';
      default: return 'border-indigo-400';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2">
            <i className="fas fa-newspaper text-indigo-500"></i> Notice Board
          </h2>
          <div className="mt-5 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 py-10">Loading notices...</p>
            ) : notices.length > 0 ? (
              notices.map((n) => (
                <div key={n._id} className={`border-l-4 ${getTypeColor(n.type)} bg-gray-50 p-4 rounded-r-lg transition-all hover:shadow-sm`}>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{n.title}</h3>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{n.description}</p>
                  <span className="text-xs text-indigo-600 mt-1 inline-block font-medium">{n.type}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-10">No notices posted yet.</p>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Student Portal</footer>
    </div>
  );
};

export default NoticeBoard;
