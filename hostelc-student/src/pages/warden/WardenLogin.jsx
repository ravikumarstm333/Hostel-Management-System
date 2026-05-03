import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WardenLogin = () => {
  const [email, setEmail] = useState('warden@hostelc.com');
  const [password, setPassword] = useState('warden123');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('role', 'warden');
    navigate('/warden/dashboard');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-up border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <i className="fas fa-shield-alt text-white text-xl"></i>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800">HOSTELC</h2>
        <p className="text-center text-gray-500 text-sm mt-1">Warden Portal Login</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center gap-2">
            <i className="fas fa-sign-in-alt"></i> Sign In
          </button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-6">Demo: warden@hostelc.com / warden123</p>
      </div>
    </div>
  );
};

export default WardenLogin;
