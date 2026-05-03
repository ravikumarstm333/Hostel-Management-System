import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import WardenNavbar from '../../components/WardenNavbar';

const GraphStats = () => {
  const [feeData, setFeeData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const students = JSON.parse(localStorage.getItem('hostelc_students') || '[]');
    const paid = students.filter((s) => s.feePaid).length;
    const unpaid = students.length - paid;
    setFeeData([{ name: 'Paid', value: paid }, { name: 'Unpaid', value: unpaid }]);

    const complaints = JSON.parse(localStorage.getItem('hostelc_complaints') || '[]');
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    setComplaintData([{ name: 'Pending', count: pending }, { name: 'In Progress', count: inProgress }, { name: 'Resolved', count: resolved }]);

    const services = JSON.parse(localStorage.getItem('hostelc_services') || '[]');
    const due = services.filter((s) => s.status === 'Due').length;
    const ok = services.filter((s) => s.status === 'OK').length;
    setServiceData([{ name: 'Due', value: due }, { name: 'OK', value: ok }]);
  };

  const COLORS = ['#4f46e5', '#f59e0b', '#10b981'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-medium text-gray-800 flex gap-2 mb-6"><i className="fas fa-chart-line text-indigo-500"></i> Overall Statistics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-medium text-center mb-3">Fee Payment Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart><Pie data={feeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{feeData.map((_, idx) => <Cell key={`fee-${idx}`} fill={COLORS[idx % COLORS.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-medium text-center mb-3">Complaints Resolution Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complaintData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="count" fill="#4f46e5" /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-medium text-center mb-3">Service Maintenance Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart><Pie data={serviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{serviceData.map((_, idx) => <Cell key={`service-${idx}`} fill={idx === 0 ? '#ef4444' : '#10b981'} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-center">
            <div className="text-center"><i className="fas fa-chart-simple text-5xl text-indigo-400 mb-3"></i><p className="text-gray-500">Additional metrics can be added here (e.g., monthly trends)</p></div>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Warden Portal</footer>
    </div>
  );
};

export default GraphStats;
