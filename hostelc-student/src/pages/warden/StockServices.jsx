import { useEffect, useState } from 'react';
import WardenNavbar from '../../components/WardenNavbar';

const StockServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', lastService: '', nextDue: '' });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('hostelc_services') || '[]');
    setServices(data);
  }, []);

  const addService = () => {
    if (!newService.name || !newService.lastService || !newService.nextDue) return;
    const updated = [...services, { ...newService, status: new Date(newService.nextDue) < new Date() ? 'Due' : 'OK' }];
    setServices(updated);
    localStorage.setItem('hostelc_services', JSON.stringify(updated));
    setNewService({ name: '', lastService: '', nextDue: '' });
  };

  const updateStatus = (index, newStatus) => {
    const updated = [...services];
    updated[index].status = newStatus;
    setServices(updated);
    localStorage.setItem('hostelc_services', JSON.stringify(updated));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium text-gray-800 flex gap-2 mb-4"><i className="fas fa-tools text-indigo-500"></i> Public Services & Maintenance</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Add New Service</h3>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                placeholder="Enter Service Name"
                value={newService.name}
                onChange={(e) =>
                  setNewService({ ...newService, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
              <input
                type="date"
                value={newService.lastService}
                onChange={(e) =>
                  setNewService({ ...newService, lastService: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
              <input
                type="date"
                value={newService.nextDue}
                onChange={(e) =>
                  setNewService({ ...newService, nextDue: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />

              <button
                onClick={addService}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-700 transition-colors"
              >
                Add Service
              </button>
            </div>
            <div className="space-y-3">
              {services.map((s, idx) => (
                <div key={idx} className={`border rounded-lg p-3 ${s.status === 'Due' ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start flex-wrap">
                    <div><h3 className="font-medium">{s.name}</h3><p className="text-xs text-gray-500">Last: {s.lastService} | Next Due: {s.nextDue}</p></div>
                    <select value={s.status} onChange={(e) => updateStatus(idx, e.target.value)} className="text-sm border rounded-lg px-2 py-1">
                      <option value="OK">OK</option><option value="Due">Due</option><option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">HOSTELC — Warden Portal</footer>
    </div>
  );
};

export default StockServices;
