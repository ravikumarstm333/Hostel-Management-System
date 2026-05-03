import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Gatepass from './pages/Gatepass';
import Allotment from './pages/Allotment';
import Fees from './pages/Fees';
import NightMess from './pages/NightMess';
import Emergency from './pages/Emergency';
import Complaints from './pages/Complaints';
import NoticeBoard from './pages/NoticeBoard';
import Forms from './pages/Forms';
import FoodOrder from './pages/FoodOrder';
import WardenDashboard from './pages/warden/WardenDashboard';
import FeesCheck from './pages/warden/FeesCheck';
import ComplaintsManage from './pages/warden/ComplaintsManage';
import StudentDatabase from './pages/warden/StudentDatabase';
import WardenGatepass from './pages/warden/WardenGatepass';
import WardenAllotment from './pages/warden/WardenAllotment';
import StockServices from './pages/warden/StockServices';
import EmergencyNotifications from './pages/warden/EmergencyNotifications';
import GraphStats from './pages/warden/GraphStats';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianInventory from './pages/technician/TechnicianInventory';
import TechnicianRatings from './pages/technician/TechnicianRatings';
import MessDashboard from './pages/MESS/MessDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public — Login (unified for all roles) */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/dashboard" element={<ProtectedRoute roles={['STUDENT']}><Dashboard /></ProtectedRoute>} />
          <Route path="/gatepass" element={<ProtectedRoute roles={['STUDENT']}><Gatepass /></ProtectedRoute>} />
          <Route path="/allotment" element={<ProtectedRoute roles={['STUDENT']}><Allotment /></ProtectedRoute>} />
          <Route path="/fees" element={<ProtectedRoute roles={['STUDENT']}><Fees /></ProtectedRoute>} />
          <Route path="/nightmess" element={<ProtectedRoute roles={['STUDENT']}><NightMess /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute roles={['STUDENT']}><Emergency /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute roles={['STUDENT']}><Complaints /></ProtectedRoute>} />
          <Route path="/noticeboard" element={<ProtectedRoute roles={['STUDENT']}><NoticeBoard /></ProtectedRoute>} />
          <Route path="/forms" element={<ProtectedRoute roles={['STUDENT']}><Forms /></ProtectedRoute>} />
          <Route path="/mess/order" element={<ProtectedRoute roles={['STUDENT']}><FoodOrder /></ProtectedRoute>} />

          {/* Warden Routes */}
          <Route path="/warden/dashboard" element={<ProtectedRoute roles={['WARDEN']}><WardenDashboard /></ProtectedRoute>} />
          <Route path="/warden/fees" element={<ProtectedRoute roles={['WARDEN']}><FeesCheck /></ProtectedRoute>} />
          <Route path="/warden/complaints" element={<ProtectedRoute roles={['WARDEN']}><ComplaintsManage /></ProtectedRoute>} />
          <Route path="/warden/students" element={<ProtectedRoute roles={['WARDEN']}><StudentDatabase /></ProtectedRoute>} />
          <Route path="/warden/services" element={<ProtectedRoute roles={['WARDEN']}><StockServices /></ProtectedRoute>} />
          <Route path="/warden/emergency" element={<ProtectedRoute roles={['WARDEN']}><EmergencyNotifications /></ProtectedRoute>} />
          <Route path="/warden/stats" element={<ProtectedRoute roles={['WARDEN']}><GraphStats /></ProtectedRoute>} />
          <Route path="/warden/WardenGatepass" element={<ProtectedRoute roles={['WARDEN']}><WardenGatepass/></ProtectedRoute>}/>
          <Route path="/warden/WardenAllotment" element={<ProtectedRoute roles={['WARDEN']}><WardenAllotment/></ProtectedRoute>}/>

          {/* Technician Routes */}
          <Route path="/technician/dashboard" element={<ProtectedRoute roles={['TECHNICIAN']}><TechnicianDashboard /></ProtectedRoute>} />
          <Route path="/technician/inventory" element={<ProtectedRoute roles={['TECHNICIAN']}><TechnicianInventory /></ProtectedRoute>} />
          <Route path="/technician/ratings" element={<ProtectedRoute roles={['TECHNICIAN']}><TechnicianRatings /></ProtectedRoute>} />

          {/* Mess Incharge Routes */}
          <Route path="/mess/dashboard" element={<ProtectedRoute roles={['MESS_INCHARGE']}><MessDashboard /></ProtectedRoute>} />

          {/* Catch-all: redirect old login URLs to unified login */}
          <Route path="/warden" element={<Login />} />
          <Route path="/technician" element={<Login />} />
          <Route path="/mess" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
