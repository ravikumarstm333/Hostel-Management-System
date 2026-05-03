import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Dashboard = () => {
  const { user } = useAuth();
  const [pendingGatepass, setPendingGatepass] = useState(0);
  const [feeDue, setFeeDue] = useState(28000);
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    setCurrentDate(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get('/complaints/my');
      setActiveComplaints(data.filter(c => c.status !== 'COMPLETED').slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 animate-card">
          <h2 className="text-2xl font-light text-gray-800">Welcome back, {user?.name || 'Student'}</h2>
          <p className="text-gray-500 text-sm mt-1">Hostel: Room {user?.roomNumber || 'N/A'} | Mess: North Wing</p>
          <p className="text-xs text-gray-400 mt-2">{currentDate}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-indigo-400 card-hover">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Pending Gatepass</p>
                <p className="text-3xl font-semibold">{pendingGatepass}</p>
              </div>
              <i className="fas fa-id-card text-indigo-300 text-2xl"></i>
            </div>
            <Link to="/gatepass" className="text-indigo-600 text-sm mt-2 inline-block">View →</Link>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-400 card-hover">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Fee Due</p>
                <p className="text-3xl font-semibold">₹{feeDue}</p>
              </div>
              <i className="fas fa-wallet text-emerald-300 text-2xl"></i>
            </div>
            <Link to="/fees" className="text-emerald-600 text-sm mt-2 inline-block">Pay →</Link>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-amber-400 card-hover">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Complaints</p>
                <p className="text-3xl font-semibold">{activeComplaints.length}</p>
              </div>
              <i className="fas fa-bug text-amber-300 text-2xl"></i>
            </div>
            <Link to="/complaints" className="text-amber-600 text-sm mt-2 inline-block">Manage →</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <i className="fas fa-history text-indigo-400"></i> Recent Activity
            </h3>
            <div className="mt-4 text-sm text-gray-500">
              No recent gatepass requests found.
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <i className="fas fa-exclamation-circle text-amber-400"></i> Active Complaints
            </h3>
            <div className="mt-3 space-y-3">
              {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : activeComplaints.length > 0 ? (
                activeComplaints.map((c) => (
                  <div key={c._id} className="flex justify-between items-center text-sm border-b pb-2">
                    <div>
                      <p className="font-medium text-gray-700">{c.title}</p>
                      <p className="text-xs text-gray-400">{c.category}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium uppercase">
                      {c.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No active complaints.</p>
              )}
              <Link to="/complaints" className="text-indigo-600 text-xs mt-2 inline-block">View All Complaints →</Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Student Portal</footer>
    </div>
  );
};

export default Dashboard;
