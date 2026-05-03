import { useEffect, useState } from 'react';
import WardenNavbar from '../../components/WardenNavbar';

const FeesCheck = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const data = JSON.parse(localStorage.getItem('hostelc_students') || '[]');
    setStudents(data);
  };

  const toggleFeeStatus = (id) => {
    const updated = students.map((s) => (s.id === id ? { ...s, feePaid: !s.feePaid, amountDue: s.feePaid ? 28000 : 0 } : s));
    setStudents(updated);
    localStorage.setItem('hostelc_students', JSON.stringify(updated));
  };

  const filteredStudents = filter === 'all' ? students : students.filter((s) => (filter === 'paid' ? s.feePaid : !s.feePaid));

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-medium text-gray-800 flex gap-2"><i className="fas fa-wallet text-indigo-500"></i> Student Fee Status</h2>
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
              <button onClick={() => setFilter('paid')} className={`px-3 py-1 rounded-full text-sm ${filter === 'paid' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Paid</button>
              <button onClick={() => setFilter('unpaid')} className={`px-3 py-1 rounded-full text-sm ${filter === 'unpaid' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Unpaid</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs rounded-full ${s.feePaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{s.feePaid ? 'Paid' : 'Unpaid'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{s.amountDue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><button onClick={() => toggleFeeStatus(s.id)} className="text-indigo-600 hover:text-indigo-900">{s.feePaid ? 'Mark Unpaid' : 'Mark Paid'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Warden Portal</footer>
    </div>
  );
};

export default FeesCheck;
