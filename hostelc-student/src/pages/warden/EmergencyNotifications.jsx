import { useEffect, useState } from 'react';
import WardenNavbar from '../../components/WardenNavbar';
import API from '../../api';

const EmergencyNotifications = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const { data } = await API.get('/emergencies');
      setEmergencies(data);
    } catch (err) {
      console.error('Error fetching emergencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/emergencies/${id}/status`, { status });
      fetchEmergencies();
      alert('Status updated');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2 mb-4">
            <i className="fas fa-ambulance text-red-500"></i> Emergency Notifications from Students
          </h2>
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading notifications...</p>
          ) : (
            <div className="space-y-4">
              {emergencies.map((e) => (
                <div key={e._id} className={`border-l-4 rounded-lg p-4 ${e.status === 'PENDING' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 uppercase">{e.type}</h3>
                      <p className="text-sm text-gray-600">
                        {e.studentId?.name} (Room {e.studentId?.roomNumber}) • {new Date(e.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-indigo-600 font-medium mt-1">Contact: {e.studentId?.contact}</p>
                    </div>
                    <select 
                      value={e.status} 
                      onChange={(ev) => updateStatus(e._id, ev.target.value)} 
                      className="text-sm border rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </div>
                  <p className="text-gray-700 text-sm mt-3 bg-white/50 p-2 rounded border border-gray-100">{e.description}</p>
                </div>
              ))}
              {emergencies.length === 0 && (
                <p className="text-center py-10 text-gray-400">No emergency notifications found.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Warden Portal</footer>
    </div>
  );
};

export default EmergencyNotifications;
