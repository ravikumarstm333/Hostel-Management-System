import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const WardenNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-wrap">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-white text-sm"></i>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">HOSTELC</h1>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Warden</span>
        </div>
        <div className="flex items-center space-x-4">
          <i className="far fa-bell text-gray-400"></i>
          <div className="flex items-center space-x-2">
            <i className="fas fa-user-circle text-gray-500 text-xl"></i>
            <span className="text-sm text-gray-700">{user?.name || 'Warden'}</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-2 flex flex-wrap gap-1 text-sm">
        <Link to="/warden/dashboard" className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Dashboard</Link>
        <Link to="/warden/fees" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Fee Status</Link>
        <Link to="/warden/complaints" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Complaints</Link>
        <Link to="/warden/students" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Student Database</Link>
        <Link to="/warden/services" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Services & Stock</Link>
        <Link to="/warden/emergency" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Emergency Alerts</Link>
        <Link to="/warden/stats" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Statistics</Link>
        <Link to="/warden/WardenGatepass" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Gatepass</Link>
        <Link to="/warden/WardenAllotment" className="px-3 py-1 rounded-full text-gray-600 hover:text-indigo-600">Allotment</Link>

      </div>
    </header>
  );
};

export default WardenNavbar;
