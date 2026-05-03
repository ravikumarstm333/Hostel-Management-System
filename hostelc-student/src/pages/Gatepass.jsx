import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api';

const Gatepass = () => {
  const [reason, setReason] = useState('');
  const [type, setType] = useState('DAY_OUT');

  const [outDateTime, setOutDateTime] = useState('');
  const [inDateTime, setInDateTime] = useState('');

  const [timeError, setTimeError] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH HISTORY ----------------
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get('/gatepasses/my');
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeError('');

    // VALIDATION
    if (!reason || !outDateTime) {
      setTimeError('Please fill all required fields');
      return;
    }

    if (type === 'NIGHT_OUT' && !inDateTime) {
      setTimeError('Return time required for Night Out');
      return;
    }

    try {
      await API.post('/gatepasses', {
        reason,
        type,
        outTime: outDateTime,
        inTime: type === 'NIGHT_OUT' ? inDateTime : null
      });

      // RESET
      setReason('');
      setOutDateTime('');
      setInDateTime('');
      setType('DAY_OUT');

      fetchHistory();
      alert('Gatepass submitted successfully');
    } catch (err) {
      setTimeError(err.response?.data?.msg || 'Submission failed');
    }
  };

  // ---------------- STATUS COLOR ----------------
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600';
      case 'REJECTED':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">

          {/* ================= FORM ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Apply Gatepass
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* TYPE */}
              <div>
                <label className="text-sm font-medium">Gatepass Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="DAY_OUT">Day Out ☀️</option>
                  <option value="NIGHT_OUT">Night Out 🌙</option>
                </select>
              </div>

              {/* OUT TIME */}
              <div>
                <label className="text-sm font-medium">Out Date & Time</label>
                <input
                  type="datetime-local"
                  value={outDateTime}
                  onChange={(e) => setOutDateTime(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* IN TIME ONLY FOR NIGHT OUT */}
              {type === 'NIGHT_OUT' && (
                <div>
                  <label className="text-sm font-medium">
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={inDateTime}
                    onChange={(e) => setInDateTime(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              )}

              {/* REASON */}
              <div>
                <label className="text-sm font-medium">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                Submit Request
              </button>

              {/* ERROR */}
              {timeError && (
                <p className="text-red-500 text-sm">{timeError}</p>
              )}
            </form>
          </div>

          {/* ================= HISTORY ================= */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Gatepass History
            </h2>

            <div className="space-y-3 max-h-[500px] overflow-auto">

              {loading ? (
                <p>Loading...</p>
              ) : history.length > 0 ? (
                history.map((g) => (
                  <div
                    key={g._id}
                    className="border rounded-lg p-3"
                  >

                    <div className="flex justify-between">
                      <p className="font-medium">{g.reason}</p>

                      {/* TYPE BADGE */}
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {g.type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500">
                      Out: {new Date(g.outTime).toLocaleString()}
                    </p>

                    {g.inTime && (
                      <p className="text-xs text-gray-500">
                        Return: {new Date(g.inTime).toLocaleString()}
                      </p>
                    )}

                    <p className={`text-sm font-medium ${getStatusColor(g.status)}`}>
                      {g.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No history found</p>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Gatepass;