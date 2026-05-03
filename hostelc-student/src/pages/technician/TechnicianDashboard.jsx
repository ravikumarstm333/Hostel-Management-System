import { useEffect, useRef, useState } from 'react';
import TechnicianNavbar from '../../components/TechnicianNavbar';
import API from '../../api';

const TechnicianDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  const timerInterval = useRef(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/complaints/assigned');
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      addNotification('Failed to fetch assigned tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus, remarks = '') => {
    try {
      await API.patch(`/complaints/${taskId}/status`, { 
        status: newStatus,
        remarks: remarks
      });
      addNotification(`Status updated to ${newStatus.replace('_', ' ')}`);
      fetchTasks();
    } catch (err) {
      addNotification(err.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const addNotification = (msg) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
    setNotifications((prev) => [{ id: Date.now(), msg, timestamp: new Date() }, ...prev].slice(0, 5));
  };

  const startTimer = (taskId) => {
    if (activeTimer) return;
    setActiveTimer(taskId);
    handleStatusChange(taskId, 'IN_PROGRESS');
    timerInterval.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = (taskId) => {
    if (activeTimer !== taskId) return;
    clearInterval(timerInterval.current);
    setActiveTimer(null);
    setTimerSeconds(0);
  };

  const handleResolve = async (taskId) => {
    const remarks = prompt('Enter resolution remarks:');
    if (remarks === null) return;
    await handleStatusChange(taskId, 'COMPLETED', remarks);
  };

  const getStatusBadge = (status) => {
    if (status === 'ASSIGNED') return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs uppercase">Assigned</span>;
    if (status === 'IN_PROGRESS') return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs uppercase">In Progress</span>;
    if (status === 'COMPLETED') return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs uppercase">Completed</span>;
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TechnicianNavbar />
      {showNotification && (
        <div className="fixed top-20 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-up">
          <i className="fas fa-bell mr-2"></i> {notificationMsg}
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-light text-gray-800">Assigned Tasks</h2>
          <p className="text-gray-500 text-sm mt-1">Managed from Student Portal</p>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading tasks...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 uppercase">{task.category}</span>
                        {getStatusBadge(task.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        <i className="fas fa-map-marker-alt"></i> Room {task.studentId?.roomNumber}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Student: {task.studentId?.name} ({task.studentId?.contact})</p>
                      <p className="text-gray-600 text-sm mt-3">{task.description}</p>
                      {activeTimer === task._id && (
                        <p className="text-xs text-indigo-600 mt-2 font-medium">
                          Current session: {Math.floor(timerSeconds / 60)} min {timerSeconds % 60} sec
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.status !== 'COMPLETED' ? (
                        <>
                          {activeTimer !== task._id ? (
                            <button onClick={() => startTimer(task._id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">Start Work</button>
                          ) : (
                            <button onClick={() => stopTimer(task._id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">Pause Work</button>
                          )}
                          <button onClick={() => handleResolve(task._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition">Mark Completed</button>
                        </>
                      ) : (
                        <span className="text-green-600 font-medium flex items-center gap-1">
                          <i className="fas fa-check-circle"></i> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                No tasks assigned to you yet.
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Technician Portal</footer>
    </div>
  );
};

export default TechnicianDashboard;
