import { useEffect, useState } from 'react';
import WardenNavbar from '../../components/WardenNavbar';
import API from '../../api';

const WardenGatepass = () => {
  const [gatepasses, setGatepasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGatepasses();
  }, []);

  const fetchGatepasses = async () => {
    try {
      const { data } = await API.get('/warden/gatepasses');
      setGatepasses(data);
    } catch (err) {
      console.error('Error fetching gatepasses:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/warden/gatepasses/${id}/status`, { status });
      fetchGatepasses();
      alert('Status updated');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <WardenNavbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          
          <h2 className="text-xl font-medium text-gray-800 flex gap-2 mb-4">
            <i className="fas fa-door-open text-indigo-500"></i> Gatepass Requests
          </h2>

          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading gatepasses...</p>
          ) : (
            <div className="space-y-4">
              
              {gatepasses.map((gp) => (
                <div
                  key={gp._id}
                  className={`border rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 ${
                    gp.status === 'PENDING'
                      ? 'border-yellow-400 bg-yellow-50'
                      : gp.status === 'APPROVED'
                      ? 'border-green-400 bg-green-50'
                      : 'border-red-400 bg-red-50'
                  }`}
                >
                  
                  {/* Left Info */}
                  <div>
                    <p className="font-semibold text-gray-800">
                      Student: {gp.student_id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Reason: {gp.reason}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Out: {gp.outTime && new Date(gp.outTime).toLocaleString()}
                    </p>
                    {gp.expectedInTime && (
                      <p className="text-xs text-gray-400">
                        Expected In: {new Date(gp.expectedInTime).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold uppercase">
                      {gp.status}
                    </span>

                    {gp.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateStatus(gp._id, 'APPROVED')}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateStatus(gp._id, 'REJECTED')}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}

              {gatepasses.length === 0 && (
                <p className="text-center py-10 text-gray-400">
                  No gatepass requests found
                </p>
              )}

            </div>
          )}
        </div>
      </main>

      <footer className="text-center text-gray-400 text-xs py-6 border-t mt-12">
        HOSTELC — Warden Portal
      </footer>
    </div>
  );
};

export default WardenGatepass;