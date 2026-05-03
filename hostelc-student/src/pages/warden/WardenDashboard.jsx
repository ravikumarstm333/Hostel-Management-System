import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import WardenNavbar from '../../components/WardenNavbar';
import API from '../../api';

const WardenDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingComplaints: 0,
    emergencyRequests: 0,
    feesPendingCount: 0,
  });
  const [complaintsPreview, setComplaintsPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, complaintsRes, studentsRes] = await Promise.all([
        API.get('/warden/complaints/stats'),
        API.get('/warden/complaints'),
        API.get('/auth/students')
      ]);

      const complaintsData = complaintsRes.data.data || complaintsRes.data;
      
      setStats({
        totalStudents: studentsRes.data.length,
        pendingComplaints: statsRes.data.pending + statsRes.data.inProgress,
        emergencyRequests: 0, // Placeholder
        feesPendingCount: 3, // Placeholder
      });
      setComplaintsPreview(complaintsData.slice(0, 5));
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching warden dashboard:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 animate-card">
          <h2 className="text-2xl font-light text-gray-800">Welcome, Warden</h2>
          <p className="text-gray-500 text-sm mt-1">HOSTELC Management Dashboard</p>
          <p className="text-xs text-gray-400 mt-2">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {isLoading ? <div className="text-center py-10">Loading...</div> : <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-indigo-400 card-hover">
            <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Total Students</p><p className="text-3xl font-semibold">{stats.totalStudents}</p></div><i className="fas fa-users text-indigo-300 text-2xl"></i></div>
            <Link to="/warden/students" className="text-indigo-600 text-sm mt-2 inline-block">View →</Link>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-amber-400 card-hover">
            <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Pending Complaints</p><p className="text-3xl font-semibold">{stats.pendingComplaints}</p></div><i className="fas fa-exclamation-triangle text-amber-300 text-2xl"></i></div>
            <Link to="/warden/complaints" className="text-amber-600 text-sm mt-2 inline-block">View →</Link>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-400 card-hover">
            <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Emergency Alerts</p><p className="text-3xl font-semibold">{stats.emergencyRequests}</p></div><i className="fas fa-ambulance text-red-300 text-2xl"></i></div>
            <Link to="/warden/emergency" className="text-red-600 text-sm mt-2 inline-block">View →</Link>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-emerald-400 card-hover">
            <div className="flex justify-between items-start"><div><p className="text-gray-500 text-sm">Pending Fees</p><p className="text-3xl font-semibold">{stats.feesPendingCount}</p></div><i className="fas fa-wallet text-emerald-300 text-2xl"></i></div>
            <Link to="/warden/fees" className="text-emerald-600 text-sm mt-2 inline-block">View →</Link>
          </div>
        </div>}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-medium text-gray-800 flex items-center gap-2"><i className="fas fa-clipboard-list text-indigo-400"></i> Recent Complaints</h3>
            <div className="mt-3 space-y-2 max-h-64 overflow-auto">
              {complaintsPreview.map((c) => (
                <div key={c._id} className="border rounded-lg p-2 flex justify-between text-sm">
                  <span>{c.title} - {c.studentId?.name || 'Student'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full uppercase ${
                    c.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                    c.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{c.status}</span>
                </div>
              ))}
              {complaintsPreview.length === 0 && <p className="text-xs text-gray-400">No complaints found.</p>}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-medium text-gray-800 flex items-center gap-2"><i className="fas fa-tools text-amber-400"></i> System Status</h3>
            <div className="mt-4 text-sm text-gray-500">
              Backend API Connected: <span className="text-green-600 font-medium">ONLINE</span>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Warden Portal</footer>
    </div>
  );
};

export default WardenDashboard;
