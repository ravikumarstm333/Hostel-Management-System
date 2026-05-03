import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Redirect if already logged in
  if (user) {
    const dashboards = {
      STUDENT: '/dashboard',
      WARDEN: '/warden/dashboard',
      TECHNICIAN: '/technician/dashboard',
      MESS_INCHARGE: '/mess/dashboard',
    };
    return <Navigate to={dashboards[user.role] || '/dashboard'} replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (!formData.role) {
      return setError('Please select a role');
    }

    setIsLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      login(data);
      const dashboards = {
        STUDENT: '/dashboard',
        WARDEN: '/warden/dashboard',
        TECHNICIAN: '/technician/dashboard',
        MESS_INCHARGE: '/mess/dashboard',
      };
      navigate(dashboards[data.role] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-gray-100 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
            <i className="fas fa-user-plus text-white text-xl"></i>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 text-sm mt-1">Join the HOSTELC community</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input name="name" type="text" required value={formData.name} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="John Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select name="role" required value={formData.role} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
              <option value="">Select your role</option>
              <option value="STUDENT">Student</option>
              <option value="WARDEN">Warden</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="MESS_INCHARGE">Mess Incharge</option>
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              required 
              value={formData.password} 
              onChange={handleChange} 
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
              placeholder="••••••••"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-indigo-600"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="••••••••" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isLoading ? (
              <><i className="fas fa-spinner fa-spin"></i> Processing...</>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;